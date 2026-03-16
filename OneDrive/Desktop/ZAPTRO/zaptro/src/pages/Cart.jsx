import React, { useState } from 'react'
import { useCart } from '../context/CartContext'
// FaExclamationTriangle add kiya hai error message ke liye
import { FaRegTrashAlt, FaCheckCircle, FaCreditCard, FaMoneyBillWave, FaExclamationTriangle } from 'react-icons/fa';
import { LuNotebookText } from 'react-icons/lu';
import { MdDeliveryDining } from 'react-icons/md';
import { GiShoppingBag } from 'react-icons/gi';
import { ImSpinner2 } from 'react-icons/im';
import { useUser } from '@clerk/react';
import { useNavigate } from 'react-router-dom';
import emptyCart from "../assets/empty-cart.png"

const Cart = ({location, getLocation}) => {
  const { cartItem , updateQuantity, deleteItem, setCartItem} = useCart()
  const {user} = useUser()
  const navigate = useNavigate()

  const [isConfirming, setIsConfirming] = useState(false)
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [showPaymentOptions, setShowPaymentOptions] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [isPaying, setIsPaying] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [addressError, setAddressError] = useState(false) // Nayi state error ke liye

  const totalPrice = cartItem.reduce((total, item) => total + (item.price * item.quantity), 0)
  const grandTotal = totalPrice + 5

  const handleConfirm = () => {
    setIsConfirming(true)
    setTimeout(() => {
      setIsConfirming(false)
      setIsConfirmed(true)
      setAddressError(false) // Confirm hote hi error hata do
    }, 1000)
  }

  const handleFinalOrder = () => {
    setIsPaying(true)

    const newOrder = {
      orderId: "ZAP" + Math.floor(Math.random() * 900000 + 100000),
      items: [...cartItem], 
      total: grandTotal.toFixed(0),
      paymentMethod: paymentMethod,
      date: new Date().toLocaleString(),
      status: "Confirmed",
      userId: user?.id 
    }

    setTimeout(() => {
      const existingOrders = JSON.parse(localStorage.getItem('userOrders') || '[]')
      localStorage.setItem('userOrders', JSON.stringify([newOrder, ...existingOrders]))

      setIsPaying(false)
      setShowSuccess(true)
      
      setCartItem([])
      localStorage.removeItem('cartItem')
    }, 2500)
  }

  if (showSuccess) {
    return (
      <div className='flex flex-col gap-3 justify-center items-center h-[600px]'>
        <GiShoppingBag className='text-green-500 text-8xl animate-bounce' />
        <h1 className='text-gray-800 font-bold text-4xl'>Order Placed!</h1>
        <p className='text-gray-500 font-semibold text-center'>
            Amount of ${grandTotal.toFixed(0)} received via {paymentMethod.toUpperCase()}
        </p>
        <div className='flex gap-4'>
            <button onClick={()=>navigate('/products')} className='bg-red-500 text-white px-5 py-2 rounded-md cursor-pointer mt-4'>Continue Shopping</button>
            <button onClick={()=>navigate('/orders')} className='bg-gray-800 text-white px-5 py-2 rounded-md cursor-pointer mt-4'>View My Orders</button>
        </div>
      </div>
    )
  }

  return (
    <div className='mt-10 max-w-6xl mx-auto mb-5 px-4 md:px-0'>
      {
        cartItem.length > 0 ? <div>
          <h1 className='font-bold text-2xl '>My Cart ({cartItem.length})</h1>
          <div>
            <div className='mt-10'>
              {cartItem.map((item, index) => (
                <div key={index} className='bg-gray-100 p-5 rounded-md flex items-center justify-between mt-3 w-full'>
                  <div className='flex items-center gap-4'>
                    <img src={item.images[0]} alt={item.title} className='w-20 h-20 rounded-md' />
                    <div>
                      <h1 className='md:w-[300px] line-clamp-2 '>{item.title}</h1>
                      <p className='text-red-500 font-semibold text-lg'>${item.price.toFixed(0)}</p>
                    </div>
                  </div>
                  <div className='bg-red-500 text-white flex gap-4 p-2 rounded-md font-bold text-xl'>
                    <button onClick={()=>updateQuantity(cartItem, item.id, "decrease")} className='cursor-pointer'>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={()=>updateQuantity(cartItem, item.id, "increase")} className='cursor-pointer'>+</button>
                  </div>
                  <span onClick={()=>deleteItem(item.id)} className='hover:bg-white/60 transition-all rounded-full p-3 hover:shadow-2xl'>
                    <FaRegTrashAlt className='text-red-500 text-2xl cursor-pointer' />
                  </span>
                </div>
              ))}
            </div>
            
            <div className='grid grid-cols-1 md:grid-cols-2 md:gap-20'>
              <div className='bg-gray-100 rounded-md p-7 mt-4 space-y-2'>
                <h1 className='text-gray-800 font-bold text-xl'>Delivery Info</h1>
                <div className='flex flex-col space-y-1'>
                  <label>Full Name</label>
                  <input type="text" className='p-2 rounded-md outline-none border-none' defaultValue={user?.fullName}/>
                </div>
                <div className='flex flex-col space-y-1'>
                  <label>Address</label>
                  <input type="text" className='p-2 rounded-md outline-none border-none' defaultValue={location?.county || location?.village}/>
                </div>
                <div className='flex w-full gap-5'>
                  <div className='flex flex-col space-y-1 w-full'>
                    <label>State</label>
                    <input type="text" className='p-2 rounded-md w-full outline-none border-none' defaultValue={location?.state}/>
                  </div>
                  <div className='flex flex-col space-y-1 w-full'>
                    <label>PostCode</label>
                    <input type="text" className='p-2 rounded-md w-full outline-none border-none' defaultValue={location?.postcode || location?.pincode}/>
                  </div>
                </div>
                <div className='flex w-full gap-5'>
                  <div className='flex flex-col space-y-1 w-full'>
                    <label>Country</label>
                    <input type="text" className='p-2 rounded-md w-full outline-none border-none' defaultValue={location?.country}/>
                  </div>
                  <div className='flex flex-col space-y-1 w-full'>
                    <label>Phone No</label>
                    <input type="text" className='p-2 rounded-md w-full outline-none border-none' placeholder='Enter Number'/>
                  </div>
                </div>
                <button onClick={handleConfirm} className={`${isConfirmed ? 'bg-green-600' : 'bg-red-500'} text-white px-3 py-1 rounded-md mt-3 cursor-pointer flex items-center gap-2 font-bold`}>
                  {isConfirming ? <ImSpinner2 className='animate-spin'/> : isConfirmed ? <><FaCheckCircle/> Address Confirmed</> : "Submit"}
                </button>
                <div className='flex items-center justify-center w-full text-gray-700'>---------OR-----------</div>
                <div className='flex justify-center'>
                  <button onClick={getLocation} className='bg-red-500 text-white px-3 py-2 rounded-md cursor-pointer'>Detect Location</button>
                </div>
              </div>

              <div className='bg-white border border-gray-100 shadow-xl rounded-md p-7 mt-4 space-y-2 h-max'>
                <h1 className='text-gray-800 font-bold text-xl'>Bill details</h1>
                <div className='flex justify-between items-center text-gray-700'>
                  <h1 className='flex gap-1 items-center'><LuNotebookText />Items total</h1>
                  <p>${totalPrice.toFixed(0)}</p>
                </div>
                <div className='flex justify-between items-center text-gray-700'>
                  <h1 className='flex gap-1 items-center'><MdDeliveryDining />Delivery Charge</h1>
                  <p className='text-red-500 font-semibold'>FREE</p>
                </div>
                <div className='flex justify-between items-center text-gray-700'>
                  <h1 className='flex gap-1 items-center'><GiShoppingBag />Handling Charge</h1>
                  <p className='text-red-500 font-semibold'>$5</p>
                </div>
                <hr className='mt-2 border-gray-100'/>
                <div className='flex justify-between items-center font-bold text-lg'>
                  <h1>Grand total</h1>
                  <p>${grandTotal.toFixed(0)}</p>
                </div>

                {showPaymentOptions ? (
                  <div className='mt-6 p-4 bg-gray-50 rounded-md border border-dashed border-red-300 animate-in fade-in duration-500'>
                    <h2 className='font-bold text-gray-800 mb-3 text-sm'>Choose Payment Method:</h2>
                    <div className='space-y-2'>
                      <div onClick={()=>setPaymentMethod('cod')} className={`p-2 border rounded-md cursor-pointer flex items-center gap-2 text-sm ${paymentMethod==='cod' ? 'border-red-500 bg-white' : 'border-gray-200 bg-white'}`}>
                        <FaMoneyBillWave className='text-green-600'/> Cash on Delivery (COD)
                      </div>
                      <div onClick={()=>setPaymentMethod('online')} className={`p-2 border rounded-md cursor-pointer flex items-center gap-2 text-sm ${paymentMethod==='online' ? 'border-red-500 bg-white' : 'border-gray-200 bg-white'}`}>
                        <FaCreditCard className='text-blue-600'/> Online Payment
                      </div>
                    </div>
                    <button 
                      onClick={handleFinalOrder}
                      disabled={isPaying}
                      className='bg-green-600 text-white w-full py-3 rounded-md mt-4 font-bold flex justify-center items-center gap-2 cursor-pointer shadow-lg'
                    >
                      {isPaying ? <><ImSpinner2 className='animate-spin'/> Paying...</> : `Confirm & Pay $${grandTotal.toFixed(0)}`}
                    </button>
                    <button onClick={()=>setShowPaymentOptions(false)} className='w-full text-[10px] text-gray-400 mt-2 underline text-center'>Go back to Bill</button>
                  </div>
                ) : (
                  <>
                    <div className='pt-4'>
                      <h1 className='font-semibold text-gray-700 mb-3'>Apply Promo Code</h1>
                      <div className='flex gap-3'>
                        <input type="text" placeholder='Enter code' className='p-2 rounded-md w-full border border-gray-200 outline-none'/>
                        <button className='bg-white text-black border border-gray-200 px-4 cursor-pointer py-1 rounded-md'>Apply</button>
                      </div>
                    </div>
                    
                    {/* Yahan par error message add kiya hai */}
                    {addressError && (
                      <div className='text-red-500 text-[12px] font-bold mt-4 flex items-center gap-1 animate-pulse'>
                         <FaExclamationTriangle /> Please confirm address first!
                      </div>
                    )}

                    <button 
                      onClick={() => {
                        if(!isConfirmed) {
                          setAddressError(true);
                          // 3 second baad error khud hi hat jayega
                          setTimeout(() => setAddressError(false), 3000);
                          return;
                        }
                        setShowPaymentOptions(true);
                      }} 
                      className='bg-red-500 text-white px-3 py-3 rounded-md w-full cursor-pointer mt-2 font-bold shadow-md hover:bg-red-600 transition-colors'
                    >
                      Proceed to Checkout
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div> : <div className='flex flex-col gap-3 justify-center items-center h-[600px]'>
          <h1 className='text-red-500/80 font-bold text-5xl text-muted text-center px-4'>Oh no! Your cart is empty</h1>
          <img src={emptyCart} alt="" className='w-[400px]'/>
          <button onClick={()=>navigate('/products')} className='bg-red-500 text-white px-3 py-2 rounded-md cursor-pointer '>Continue Shopping</button>
        </div>
      }
    </div>
  )
}

export default Cart