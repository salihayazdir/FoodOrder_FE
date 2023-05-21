import Head from 'next/head'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import cookie from "cookie"
import UserOrders from '../components/screens/UserOrders';
import UserCart from '../components/screens/UserCart';
import UserItems from '../components/screens/UserItems';
import UserAddresses from '../components/screens/UserAddresses';

export default function Home({userData}) {
    const router = useRouter();
    const [screen, setScreen] = useState("items")

    const [cart, setCart] = useState([])
    const [items, setItems] = useState(null)
    const [orders, setOrders] = useState(null)
    const [addresses, setAddresses] = useState(null)

    const fetchItems = () => {
    axios.get("http://localhost:5277/api/items", {headers: {Authorization: localStorage.getItem("token")}})
    .then(res => {
        console.log(res)
        setItems(res.data)
    })
    .catch(err => console.log(err))
    }

    const fetchAddresses = () => {
    axios.get("http://localhost:5277/api/addresses", {headers: {Authorization: localStorage.getItem("token")}})
    .then(res => {
        console.log(res)
        setAddresses(res.data.filter(address => address.userId == userData.nameid))
    })
    .catch(err => console.log(err))
    }

    useEffect(() => {
        fetchItems()
        fetchAddresses()
    }, [])

    const addToCart = (id) => {
        setCart(prev => [...prev, id])
    }
    const removeFromCart = (id) => {
        setCart(prev => {
            let newArray = prev
            const index = newArray.indexOf(id)
            if(index < 0) return prev
            addToCart(id)
            newArray.splice(index, 1)
            return newArray
        })
    }

    console.log(addresses)

  return (
    <>
      <Head>
        <title>Yemek Siparişi</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className='flex min-h-screen' >
        <div className='border-r font-medium shadow-xl bg-white z-20 border-gray-200 px-4 pt-8 flex flex-col gap-4' >
        <div className='flex flex-col gap-4'>
            <div
            className="hover:bg-gray-100 cursor-pointer rounded-md px-4 py-2"
            onClick={() => setScreen("items")} >
                Menü
            </div>
            <div
            className="hover:bg-gray-100 cursor-pointer rounded-md px-4 py-2"
            onClick={() => setScreen("cart")}>
                Sepet
            </div>
            <div
            className="hover:bg-gray-100 cursor-pointer rounded-md px-4 py-2"
            onClick={() => setScreen("orders")}>
                Siparişler
            </div>
            <div
            className="hover:bg-gray-100 cursor-pointer rounded-md px-4 py-2"
            onClick={() => setScreen("addresses")}>
                Adresler
            </div>
        </div>
        <div
            className="hover:bg-gray-100 text-red-600 cursor-pointer rounded-md px-4 py-2"
            onClick={() => {
                localStorage.setItem("token", "")
                axios.get("http://localhost:3000/api/logout")
                    .then(router.push("/giris"))
                    .catch(err => console.log(err))
            } }>
                Çıkış Yap
            </div>
            </div>
        <div className='p-10 text-sm w-full bg-gray-50'>
          {screen === "items" ? (
                  <UserItems items={items} cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} />
              ) : null}
          {screen === "cart" ? (
                  <UserCart items={items} cart={cart} setCart={setCart} addToCart={addToCart} removeFromCart={removeFromCart} addresses={addresses} />
              ) : null}
          {screen === "orders" ? (
                  <UserOrders orders={orders} setOrders={setOrders} />
              ) : null}
          {screen === "addresses" ? (
                  <UserAddresses addresses={addresses} fetchAddresses={fetchAddresses} />
              ) : null}
        </div>
      </div>

    </>
  )
}

export async function getServerSideProps(context) {
  try {
    let userData = {}
    let role = ""
    const token = cookie.parse(context.req.headers.cookie).Authorization
    await axios.post("http://localhost:5277/api/auth/check",{}, {headers: {Authorization: token}})
     .then(resp => {
       role = resp.data.role
        resp.data.claimlist.forEach(claim => {
            userData = {...userData, [claim.type]: claim.value}
        })
     })

    if (role === "admin") throw '/admin';
    if (role === "customer") return {
      props: {userData},
    };

    throw "/giris"
  
    } catch (err) {
      console.log(err)
    if (err === '/admin' || err === '/giris')
      return {
        redirect: {
          permanent: false,
          destination: err,
        },
      };
      else {
        return {
        redirect: {
          permanent: false,
          destination: "/giris",
        },
      };
      }
  }
}
