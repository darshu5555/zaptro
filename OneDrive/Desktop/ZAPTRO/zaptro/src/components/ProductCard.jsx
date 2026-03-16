import React from 'react'
import { IoCartOutline } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const ProductCard = ({product}) => {
  const navigate = useNavigate()
  const {addToCart, cartItem} = useCart()

  console.log(cartItem)
  return (
    <div className='border relative border-gray-100 rounded-2xl cursor-pointer hover:scale-105 hover:shadow-2xl transition-all p-3 h-[380px] flex flex-col'>
      
      <img 
        src={product.images[0]} 
        alt='' 
        className='bg-gray-100 h-[200px] w-full object-cover rounded-xl' onClick={()=>navigate(`/products/${product.id}`)}
      />

      <h1 className='line-clamp-2 p-1 font-semibold mt-2'>
        {product.title}
      </h1>

      <p className='my-1 text-lg text-gray-800 font-bold'>
        ${product.price.toFixed(0)}
      </p>

      <button onClick={()=>addToCart(product)}className='bg-red-500 px-3 py-2 text-lg rounded-md text-white w-full cursor-pointer flex gap-2 items-center justify-center font-semibold mt-auto'> 
        <IoCartOutline className='w-6 h-6' />
        Add to Cart
      </button>

    </div>
  )
}

export default ProductCard