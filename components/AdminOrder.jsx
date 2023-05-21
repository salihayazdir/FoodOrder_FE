import React from 'react'
import getStatus from '../utils/getStatus'
import { Disclosure, Listbox } from '@headlessui/react'
import { useState } from 'react'
import axios from 'axios'

function AdminOrder({order, dateTime, fetchOrders}) {
        const orderStatuses = [
        { id: 0, text: "İptal"},
        { id: 1, text: "Yeni Sipariş"},
        { id: 2, text: "Onaylandı"},
        { id: 3, text: "Yolda"},
        { id: 4, text: "Teslim Edildi"},
    ]

    const [selectedStatus, setSelectedStatus] = useState(orderStatuses[0])

    const changeStatus = () => {
        console.log("asd")
        axios.put(`http://localhost:5277/api/orders/${order.id}`, {status: selectedStatus.id}, {headers: {Authorization: localStorage.getItem("token")}})
        .then(() => fetchOrders())
        .catch(err => console.log(err))
    }

  return (
    <div key={order.id}
                className='flex text-gray-600 bg-white px-4 py-3 text-left rounded-md border border-gray-200 flex-col gap-2'>
                    <div className='text-left' >
                        <div>Müşteri: {order.user}</div>
                        <div className='font-semibold text-black'>Statü: {getStatus(order.status)}</div>
                        <div className='font-semibold text-black'>Sipariş Tarihi: {dateTime}</div>
                        <div>Adres: {order.address}</div>
                        <div>Sipariş Tutarı: {order.total} TL</div>
                        <div>Sipariş Notu: {order.notes}</div>
                    </div>
                    <Disclosure as={"div"} className='flex text-gray-600 bg-white px-4 py-2 text-left rounded-md border border-gray-200 flex-col gap-2'  >
                        <Disclosure.Button className="text-black py-1 font-semibold text-left">
                            Ürünler
                        </Disclosure.Button>
                        <Disclosure.Panel className="text-gray-500">
                            {
                                order.items.map(item => {
                                    return (<div key={item.id} > { `${item.itemName} x ${item.quantity} (${item.itemPrice*item.quantity} TL)` } </div>)
                                })
                            }
                        </Disclosure.Panel>
                    </Disclosure>
                    <Disclosure as={"div"} className='flex text-gray-600 bg-white px-4 py-2 text-left rounded-md border border-gray-200 flex-col gap-2'  >
                        <Disclosure.Button className="text-black py-1 font-semibold text-left">
                            Statü Değiştir
                        </Disclosure.Button>
                        <Disclosure.Panel className="text-gray-500">

                            <Listbox value={selectedStatus} onChange={setSelectedStatus}>
                                <div className="relative mt-1">
                                <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-2 pl-3 border border-gray-200 pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300">
                                    <span className="block truncate">{selectedStatus.text}</span>
                                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                    {/* <ChevronUpDownIcon
                                        className="h-5 w-5 text-gray-400"
                                        aria-hidden="true"
                                    /> */}
                                    </span>
                                </Listbox.Button>
                                    <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                    {orderStatuses.map((status) => (
                                        <Listbox.Option
                                        key={status.id}
                                        value={status}
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
                                                <span className='text-black font-bold' >{status.text}</span>
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
                            <button
                                className='my-2 text-sm flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4  font-medium text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                                onClick={changeStatus}
                                >Değiştir
                            </button>

                        </Disclosure.Panel>
                    </Disclosure>
                </div>
  )
}

export default AdminOrder