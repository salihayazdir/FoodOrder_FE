import {useEffect, useState} from 'react'
import axios from 'axios'
import { Disclosure, Listbox } from '@headlessui/react'


export default function AdminItems({items, setItems, categories}) {
    const [newItem, setNewItem] = useState({
        name: "",
        description: "",
        price: 0,
    })

    const [newItemCategory, setNewItemCategory] = useState(categories[0])

    const handleFormInputs = (e) => {
        setNewItem(prev => ({
            ...prev,
            [e.target.id]: e.target.value
        }))
    }
    const handleFormSubmit = (e) => {
        e.preventDefault()
        addItem()
    }

    const addItem = () => {
        axios.post("http://localhost:5277/api/items", {...newItem, categoryId: newItemCategory.id}, {headers: {Authorization: localStorage.getItem("token")}})
        .then(() => fetchItems()
        )
        .catch(err => console.error(err))
    }

    const deleteItem = (id) => {
        axios.delete(`http://localhost:5277/api/items/${id}`,  {headers: {Authorization: localStorage.getItem("token")}})
        .then(() => fetchItems())
        .catch(err => console.error(err))
    }


    const fetchItems = () => {
        axios.get("http://localhost:5277/api/items", {headers: {Authorization: localStorage.getItem("token")}})
        .then(res => {
            console.log(res)
            setItems(res.data)
        })
        .catch(err => console.log(err))
    }

    useEffect(() => {
        fetchItems()
    }, [])

    let categoriesFromItems;
    
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
                                    return (
                                        <div key={item.id} className='rounded-md bg-white border text-sm border-gray-200 flex flex-col px-4 py-3' >
                                            <div>{item.name}</div>
                                            <div>Fiyat: {item.price} TL</div>
                                            <div>Açıklama: {item.description}</div>
                                            <button
                                            className='bg-red-50 text-red-600 w-20 mt-2 rounded-md font-medium'
                                            onClick={() => deleteItem(item.id)}
                                            >Sil</button>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}
            </div>
            <div className="mt-10">
                <Disclosure>
                {({ open }) => (
                    <>
                    <Disclosure.Button className="flex w-full justify-between rounded-lg bg-blue-100 px-4 py-2 text-left text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75">
                        <span>Ürün Ekle</span>
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
                                value={newItem.name}
                                onChange={handleFormInputs}
                                className='peer block w-full appearance-none rounded-lg border border-gray-300 bg-transparent p-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-0 disabled:text-gray-500 '
                                placeholder=' '
                                />
                                <label
                                htmlFor='name'
                                className='absolute top-1 left-2 z-10 origin-[0] -translate-y-4 scale-75 transform bg-white px-2 text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-1 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-500 '
                                >
                                    Ürün İsmi
                                </label>
                            </div>
                            <div className='relative rounded-md '>
                                <input
                                id='price'
                                name='price'
                                type='number'
                                required
                                value={newItem.price}
                                onChange={handleFormInputs}
                                className='peer block w-full appearance-none rounded-lg border border-gray-300 bg-transparent p-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-0 disabled:text-gray-500 '
                                placeholder=' '
                                />
                                <label
                                htmlFor='price'
                                className='absolute top-1 left-2 z-10 origin-[0] -translate-y-4 scale-75 transform bg-white px-2 text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-1 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-500 '
                                >
                                    Fiyat
                                </label>
                            </div>
                            <div className='relative rounded-md '>
                                <input
                                id='description'
                                name='description'
                                type='text'
                                // required
                                value={newItem.description}
                                onChange={handleFormInputs}
                                className='peer block w-full appearance-none rounded-lg border border-gray-300 bg-transparent p-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-0 disabled:text-gray-500 '
                                placeholder=' '
                                />
                                <label
                                htmlFor='description'
                                className='absolute top-1 left-2 z-10 origin-[0] -translate-y-4 scale-75 transform bg-white px-2 text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-1 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-500 '
                                >
                                    Açıklama
                                </label>
                            </div>

                            <Listbox value={newItemCategory} onChange={setNewItemCategory}>
                                <div className="relative mt-1">
                                <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                                    <span className="block truncate">{newItemCategory.name}</span>
                                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                    {/* <ChevronUpDownIcon
                                        className="h-5 w-5 text-gray-400"
                                        aria-hidden="true"
                                    /> */}
                                    </span>
                                </Listbox.Button>
                                    <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                    {categories.map((category) => (
                                        <Listbox.Option
                                        key={category.id}
                                        value={category}
                                        className={({ active }) =>
                                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                            active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                                            }`
                                        }                                        >
                                        {({ selected }) => (
                                            <>
                                            <span
                                                className={`block truncate ${
                                                selected ? 'font-medium' : 'font-normal'
                                                }`}
                                            >
                                                {category.name}
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
}