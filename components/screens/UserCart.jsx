import React, {useState} from 'react'
import { Listbox } from '@headlessui/react';
import axios from 'axios';

export default function UserCart({items, cart, setCart, addToCart, removeFromCart, addresses}) {
    if(cart.length === 0 ) return <div className='text-center font-bold text-gray-400 text-xl'>Sepet Boş</div>

    const [selectedAddress, setSelectedAddress] = useState(addresses[0])
    const [orderNotes, setOrderNotes] = useState("")
    
    const itemsInCart = items.filter(item => cart.indexOf(parseInt(item.id)) > -1)

    const cartItemCounts = cart.reduce((acc, curr) => {
        return acc[curr] ? ++acc[curr] : acc[curr] = 1, acc
    }, {});

    const cartTotal = itemsInCart.reduce((acc, curr) => {
        return acc + curr.price * cartItemCounts[curr.id]
    }, 0)

    const submitOrder = () => {
        axios.post(
            "http://localhost:5277/api/orders",
            {
                Notes: orderNotes,
                AddressId: selectedAddress.id,
                orderItems: itemsInCart.map(item => {
                    return ({
                        ItemId: item.id,
                        Quantity: cartItemCounts[item.id]
                    })
                })
            },
            {headers: {Authorization: localStorage.getItem("token")}}
        )
        .then(res => console.log(res))
        .catch(err => console.log(err))
    }


  return (
    <div className='flex flex-col gap-8'>
        <div>

        <span className='font-bold text-lg' >Adres</span>
        <Listbox value={selectedAddress} onChange={setSelectedAddress}>
            <div className="relative mt-1">
            <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-2 pl-3 border border-gray-200 pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300">
                <span className="block truncate">{selectedAddress.name}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                {/* <ChevronUpDownIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                /> */}
                </span>
            </Listbox.Button>
                <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {addresses.map((address) => (
                    <Listbox.Option
                    key={address.id}
                    value={address}
                    className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                        }`
                    }                                        >
                    {({ selected }) => (
                        <>
                        <span
                            className={`truncate flex flex-col gap-1  ${
                            selected ? 'font-medium' : 'font-normal'
                            }`}
                        >
                            <span className='text-black font-bold' >{address.name}</span>
                            <span className='text-gray-500' >{address.details}</span>
                        </span>
                        {selected ? (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                            {/* <CheckIcon className="h-5 w-5" aria-hidden="true" /> */}
                            </span>
                        ) : null}
                        </>
                    )}
                    </Listbox.Option>
                ))}
                </Listbox.Options>
            </div>
        </Listbox>
        </div>
        <div>
            <span className='font-bold text-lg' >Ürünler</span>
            <div className='flex flex-col gap-2'>
                {itemsInCart.map(item => {
                    const cartCount = cart.filter(x => x == item.id).length
                    const existsInCart = cartCount > 0
                    return (
                        <div key={item.id} className='rounded-md bg-white border text-sm border-gray-200 flex flex-col px-4 py-3' >
                            <div>{item.name}</div>
                            <div>Fiyat: {item.price} TL</div>
                            <div className='flex' >
                                <button
                                className='bg-blue-50 text-blue-600 w-24 mt-2 rounded-md font-medium'
                                onClick={() => addToCart(item.id)}
                                >+</button>
                                {
                                    existsInCart ? (
                                        <div className='ml-2' >
                                            <span className='font-semibold' >{cartCount} </span>
                                            <button
                                            className='bg-red-50 ml-2 text-red-600 w-24 mt-2 rounded-md font-medium'
                                            onClick={() => removeFromCart(item.id)}
                                            >-</button>
                                        </div>
                                    ) : null
                                }
                            </div>
                        </div>
                    )
                })}
                </div>
        </div>

        <div className='flex gap-2 text-xl'>
            <div>Sepet Tutarı: </div>
            <div className='font-bold'>{`${cartTotal} TL`}</div>
        </div>
        <div className='flex flex-col'>
            <span className='font-bold text-lg' >Sipariş Notları</span>

        <textarea
        className='bg-white rounded-md border border-gray-200 p-4'
        value={orderNotes}
        onChange={(e) => setOrderNotes(e.target.value)}
        />

        </div>
        <button
        className='flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-base font-medium text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
        onClick={submitOrder}
        >Sipariş Ver</button>
    </div>
  )
}
