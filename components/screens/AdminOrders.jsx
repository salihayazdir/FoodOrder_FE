import {useEffect} from 'react'
import axios from 'axios'
import AdminOrder from '../AdminOrder'

export default function AdminOrders({orders, setOrders}) {

    const fetchOrders = () => {
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
    }

    useEffect(() => {
        fetchOrders()
    }, [])

    if(orders !== null)
  return (
    <div className='flex flex-col gap-4'>
        {orders.map(order => {
            const dateTime = new Date(order.date).toLocaleString("tr-TR")
            return (
                <AdminOrder order={order} dateTime={dateTime} fetchOrders={fetchOrders} />
            )
        })}
        
    </div>
  )
}

