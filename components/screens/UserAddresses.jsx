import React, {useState} from 'react'
import axios from 'axios'
import { Disclosure, Listbox } from '@headlessui/react'

export default function UserAddresses({addresses, fetchAddresses}) {
const [newAddress, setNewAddress] = useState({
    name: "",
    details: ""
})

const handleFormInputs = (e) => {
        setNewAddress(prev => ({
            ...prev,
            [e.target.id]: e.target.value
        }))
    }
    const handleFormSubmit = (e) => {
        e.preventDefault()
        addAddress()
    }

    const addAddress = () => {
        axios.post("http://localhost:5277/api/addresses", {...newAddress}, {headers: {Authorization: localStorage.getItem("token")}})
        .then(() => fetchAddresses()
        )
        .catch(err => console.error(err))
    }

    const deleteAddress = (id) => {
        axios.delete(`http://localhost:5277/api/addresses/${id}`,  {headers: {Authorization: localStorage.getItem("token")}})
        .then(() => fetchAddresses())
        .catch(err => console.error(err))
    }

  return (
        <div className=''>
            <div className='flex flex-col gap-2'>
                {addresses.map(address => {
                    return (
                        <div key={address.id} className='rounded-md bg-white border text-sm border-gray-200 flex flex-col px-4 py-3' >
                            <div className='font-semibold'>{address.name}</div>
                            <div>{address.details}</div>
                            <button
                            className='bg-red-50 text-red-600 w-20 mt-2 rounded-md font-medium'
                            onClick={() => deleteAddress(address.id)}
                            >Sil</button>
                        </div>
                    )
                })}
            </div>
            <div className="mt-10">
                <Disclosure>
                {({ open }) => (
                    <>
                    <Disclosure.Button className="flex w-full justify-between rounded-lg bg-blue-100 px-4 py-2 text-left text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75">
                        <span>Adres Ekle</span>
                        {/* <ChevronUpIcon
                        className={`${
                            open ? 'rotate-180 transform' : ''
                        } h-5 w-5 text-blue-500`}
                        /> */}
                    </Disclosure.Button>
                    <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                        <form onSubmit={handleFormSubmit} className='flex flex-col gap-2'>
                            <div className='relative rounded-md '>
                                <input
                                id='name'
                                name='name'
                                type='text'
                                required
                                value={newAddress.name}
                                onChange={handleFormInputs}
                                className='peer block w-full appearance-none rounded-lg border border-gray-300 bg-transparent p-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-0 disabled:text-gray-500 '
                                placeholder=' '
                                />
                                <label
                                htmlFor='name'
                                className='absolute top-1 left-2 z-10 origin-[0] -translate-y-4 scale-75 transform bg-white px-2 text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-1 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-500 '
                                >
                                    Adres İsmi
                                </label>
                            </div>
                            <div className='relative rounded-md '>
                                <input
                                id='details'
                                name='details'
                                type='text'
                                // required
                                value={newAddress.details}
                                onChange={handleFormInputs}
                                className='peer block w-full appearance-none rounded-lg border border-gray-300 bg-transparent p-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-0 disabled:text-gray-500 '
                                placeholder=' '
                                />
                                <label
                                htmlFor='details'
                                className='absolute top-1 left-2 z-10 origin-[0] -translate-y-4 scale-75 transform bg-white px-2 text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-1 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-500 '
                                >
                                    Açık Adres
                                </label>
                            </div>

                            <button
                            type='submit'
                                className='flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-1.5 px-4 text-base font-medium text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                            > Ekle
                            </button>
                        </form>
                    </Disclosure.Panel>
                    </>
                )}
                </Disclosure>

            </div>
        </div>
  )
}
