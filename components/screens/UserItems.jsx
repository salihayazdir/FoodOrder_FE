import {useEffect, useState} from 'react'
import axios from 'axios'
import { Disclosure, Listbox } from '@headlessui/react'


export default function UserItems({items, cart, addToCart, removeFromCart}) {

    let categoriesFromItems;

    
    console.log(cart)
    if(items !== null){
        categoriesFromItems = [...new Set(items.map(item => item.category))]
        return (
        <div className=''>
            <div className='flex flex-col gap-8'>
                {categoriesFromItems.map(category => {
                    return (
                        <div key={category} className='flex flex-col gap-2'>
                            <div className='font-bold text-lg' >
                                {category}
                            </div>
                            <div className='flex flex-col gap-2'>
                                {items.filter(item => item.category === category).map(item => {
                                    const cartCount = cart.filter(x => x == item.id).length
                                    const existsInCart = cartCount > 0
                                    return (
                                        <div key={item.id} className='rounded-md bg-white border text-sm border-gray-200 flex flex-col px-4 py-3' >
                                            <div>{item.name}</div>
                                            <div>Fiyat: {item.price} TL</div>
                                            <div>Açıklama: {item.description}</div>
                                            <div className='flex' >
                                                <button
                                                className='bg-blue-50 text-blue-600 w-24 mt-2 rounded-md font-medium'
                                                onClick={() => addToCart(item.id)}
                                                >{existsInCart ? "+" : "Sepete Ekle"}</button>
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
                    )
                })}
            </div>
        </div>
  )
}
}