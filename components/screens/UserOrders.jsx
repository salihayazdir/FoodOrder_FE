import {useEffect} from 'react'
import axios from 'axios'
import getStatus from '../../utils/getStatus'
import { Disclosure } from '@headlessui/react'

export default function UserOrders({orders, setOrders}) {
    useEffect(() => {
        axios.get("http://localhost:5277/api/orders", {headers: {Authorization: localStorage.getItem("token")}})
        .then(res => {
            console.log(res)
            const mappedOrders = res.data.orderHeaderDetails.map(header => {
                const items = res.data.orderItems.filter(item => {
                        return item.orderHeader === header.id
                    })
                const total = items.reduce((acc, curr) => acc + curr.itemPrice * curr.quantity, 0)
                return {
                    ...header,
                    items,
                    total
                }
            })
            setOrders(mappedOrders)
        })
        .catch(err => console.log(err))
    }, [])

    console.log(orders)

    if(orders !== null)
  return (
    <div className='flex flex-col gap-4'>
        {orders.map(order => {
            const dateTime = new Date(order.date).toLocaleString("tr-TR")
            return (
                <Disclosure as={"div"} key={order.id} className='flex bg-white px-4 py-3 text-left rounded-md border border-gray-200 flex-col gap-2'  >
                    <Disclosure.Button className="py-2">
                        <div className='text-left' >
                            <div>Sipariş Tarihi: {dateTime}</div>
                            <div>Statü: {getStatus(order.status)}</div>
                            <div>Adres: {order.address}</div>
                            <div>Sipariş Tutarı: {order.total} TL</div>
                            <div>Notlar: {order.notes}</div>
                        </div>
                    </Disclosure.Button>
                    <Disclosure.Panel className="text-gray-500">
                        {
                            order.items.map(item => {
                                return <div key={item.id}> { `${item.itemName} x ${item.quantity} (${item.itemPrice*item.quantity} TL)` } </div>
                            })
                        }
                    </Disclosure.Panel>
                </Disclosure>
            )
        })}
        
    </div>
  )
}