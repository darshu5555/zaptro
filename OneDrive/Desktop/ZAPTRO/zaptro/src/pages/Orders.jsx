import React, { useEffect, useState } from 'react'
import { FaRegClock, FaTrashAlt, FaBoxOpen, FaShippingFast, FaExclamationCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [selectedOrderId, setSelectedOrderId] = useState(null)
  const navigate = useNavigate();

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem('userOrders') || '[]')
    setOrders(savedOrders)
  }, [])

  const triggerCancel = (orderId) => {
    setSelectedOrderId(orderId)
    setShowModal(true)
  }

  const confirmCancel = () => {
    const updatedOrders = orders.filter(order => order.orderId !== selectedOrderId)
    setOrders(updatedOrders)
    localStorage.setItem('userOrders', JSON.stringify(updatedOrders))
    setShowModal(false)
    setSelectedOrderId(null)
  }

  return (
    <div className='mt-10 max-w-6xl mx-auto mb-10 px-4 relative'>
      
      {/* --- CUSTOM POP-UP MODAL --- */}
      {showModal && (
        <div className='fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 transition-all'>
          <div className='bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl border border-gray-100 text-center animate-in zoom-in duration-300'>
            <div className='bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5'>
              <FaExclamationCircle className='text-red-500 text-3xl'/>
            </div>
            <h2 className='text-xl font-bold text-gray-900 mb-2'>Confirm Cancellation</h2>
            <p className='text-gray-500 text-sm leading-relaxed mb-8'>
              Are you sure you want to cancel this order? This action cannot be undone and your items will be removed from the shipping queue.
            </p>
            
            <div className='flex gap-3'>
              <button 
                onClick={() => setShowModal(false)}
                className='flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all cursor-pointer'
              >
                Go Back
              </button>
              <button 
                onClick={confirmCancel}
                className='flex-1 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 shadow-lg shadow-red-200 transition-all cursor-pointer'
              >
                Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}

      <h1 className='font-bold text-3xl mb-8 text-gray-800 border-b-2 border-red-500 w-max pb-2'>Order History</h1>
      
      {orders.length > 0 ? (
        <div className='space-y-6'>
          {orders.map((order, index) => (
            <div key={index} className='border border-gray-100 rounded-xl p-6 shadow-sm bg-white hover:shadow-lg transition-all duration-300'>
              
              {/* Header Section */}
              <div className='flex flex-wrap justify-between items-start gap-4 border-b border-gray-50 pb-4 mb-4'>
                <div className='space-y-1'>
                  <p className='text-[10px] font-medium text-gray-400 uppercase tracking-widest'>Reference ID</p>
                  <p className='font-bold text-lg text-gray-800'>{order.orderId}</p>
                </div>
                <div className='flex gap-10 items-center'>
                    <div className='text-sm text-gray-500'>
                        <p className='font-medium text-gray-400 uppercase tracking-widest text-[10px]'>Placed On</p>
                        <p className='flex items-center gap-2 font-semibold text-gray-700'><FaRegClock className='text-red-400'/> {order.date}</p>
                    </div>
                    <div className='text-right'>
                        <p className='font-medium text-gray-400 uppercase tracking-widest text-[10px] mb-1'>Status</p>
                        <span className='text-[10px] font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full uppercase italic'>
                            {order.status}
                        </span>
                    </div>
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                {/* Items List */}
                <div className='space-y-4'>
                    <p className='text-xs font-bold text-gray-400 uppercase mb-2'>Items Ordered</p>
                    {order.items.map((item, i) => (
                    <div key={i} className='flex items-center gap-4 group'>
                        <img src={item.images[0]} alt={item.title} className='w-16 h-16 object-cover rounded-lg border border-gray-100' />
                        <div className='flex-1'>
                            <h3 className='text-sm font-bold text-gray-800 line-clamp-1'>{item.title}</h3>
                            <p className='text-xs text-gray-500 font-medium'>Qty: {item.quantity}   <br/>Price  ${item.price.toFixed(0)}</p>
                        </div>
                    </div>
                    ))}
                </div>

                {/* Payment Summary */}
                <div className='bg-gray-50 p-5 rounded-2xl border border-gray-100'>
                    <p className='text-xs font-bold text-gray-400 uppercase mb-4'>Payment Summary</p>
                    
                    <div className='space-y-2 text-sm'>
                        <div className='flex justify-between text-gray-600'>
                            <span>Subtotal</span>
                            <span className='font-semibold'>${(order.total - 5)}</span>
                        </div>
                        <div className='flex justify-between text-gray-600 italic'>
                            <span className='flex items-center gap-1'><FaShippingFast className='text-blue-500'/> Delivery Fee</span>
                            <span className='text-green-600 font-bold'>FREE</span>
                        </div>
                        <div className='flex justify-between text-gray-600'>
                            <span>Handling Charges</span>
                            <span className='font-semibold'>$5</span>
                        </div>
                        <hr className='border-gray-200 my-2' />
                        <div className='flex justify-between items-center pt-1'>
                            <span className='font-bold text-gray-800 text-lg'>Grand Total</span>
                            <span className='font-black text-2xl text-red-600'>${order.total}</span>
                        </div>
                    </div>

                    <div className='mt-6 flex flex-col gap-3'>
                        <div className='flex justify-between items-center text-[10px] text-gray-400 uppercase font-bold tracking-tighter'>
                            <span>Method: {order.paymentMethod}</span>
                        </div>
                        <button 
                            onClick={() => triggerCancel(order.orderId)}
                            className='w-full flex items-center justify-center gap-2 bg-white text-red-600 border border-red-200 py-3 rounded-xl hover:bg-red-600 hover:text-white transition-all duration-300 cursor-pointer text-xs font-black uppercase tracking-widest shadow-sm'
                        >
                            <FaTrashAlt /> Cancel Order
                        </button>
                    </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center py-24 bg-white border border-gray-100 rounded-2xl text-center'>
          <FaBoxOpen className='text-7xl text-gray-100 mb-6' />
          <h2 className='text-2xl font-black text-gray-800 mb-2'>No Orders Yet</h2>
          <p className='text-gray-500 mb-8'>Looks like you haven't made your choice yet.</p>
          <button onClick={() => navigate('/products')} className='bg-gray-900 text-white px-8 py-3 rounded-xl font-bold uppercase text-xs tracking-widest cursor-pointer'>Explore Shop</button>
        </div>
      )}
    </div>
  )
}

export default Orders