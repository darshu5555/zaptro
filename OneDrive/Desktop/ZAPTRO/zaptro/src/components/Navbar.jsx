import { MapPin } from 'lucide-react'
import React, { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { FaCaretDown } from 'react-icons/fa'
import { IoCartOutline } from 'react-icons/io5'
import { LuPackageCheck } from "react-icons/lu"; // Order icon ke liye
import { Show, SignInButton, useUser, useClerk } from '@clerk/react'
import { CgClose } from 'react-icons/cg'
import { useCart } from '../context/CartContext'
import { HiMenuAlt3, HiMenuAlt1} from 'react-icons/hi'
import ResponsiveMenu from './ResponsiveMenu'
import LogoutButton from './LogoutButton'


const Navbar = ({location, getLocation, openDropdown, setOpenDropdown}) => {

  const navigate = useNavigate()
  const { isSignedIn } = useUser() 
  const { openSignIn } = useClerk() 
  
  const {cartItem} = useCart()
  const [openNav, setOpenNav] = useState(false)
  
  const toggleDropdown = ()=>{
    setOpenDropdown(!openDropdown)
  }

  // Cart click handler
  const handleCartClick = (e) => {
    e.preventDefault(); 
    if (isSignedIn) {
      navigate('/cart');
    } else {
      openSignIn(); 
    }
  }

  return (
    <div className='bg-white py-3 shadow-2xl px-4 md:px-0'>
      <div className='max-w-6xl mx-auto flex justify-between items-center'>

{/* logo section */}
<div className='flex gap-7 items-center'>
  <Link to={'/'}><h1 className='font-bold text-3xl '><span className='text-red-500 font-serif'>Z</span>aptro</h1></Link>
  <div className='md:flex gap-1 cursor-pointer text-gray-700 items-center hidden relative'>
    <MapPin className='text-red-500'/>
    <span className='font-semibold' onClick={toggleDropdown}>{location ? <div className='-space-y-2 text-xs'>
      <p>{location.country}</p>
            <p>{location.state}</p>

    </div> : "Add Address"}</span>
    <FaCaretDown onClick={toggleDropdown}/>

    {/* Dropdown Location */}
    {
    openDropdown ? <div className='w-[250px] h-max shadow-2xl z-50 bg-white fixed top-16 left-60  border-2 p-5 border-gray-100 rounded-md'>
      <h1 className='font-semibold mb-4 text-xl flex justify-between items-center text-black'>Change Location <span className='cursor-pointer' onClick={toggleDropdown}><CgClose /></span></h1>
      <button onClick={getLocation} className='bg-red-500 text-white px-3 py-1 rounded-md cursor-pointer hover:bg-red-400 w-full'>Detect My Location</button>
    </div> : null
    }
  </div>
</div>

{/* menu section */}
<nav className='flex gap-7 items-center'>
  <ul className='md:flex gap-7 items-center text-xl font-semibold hidden'>
    <NavLink to={'/'} className={({isActive})=> `${isActive ? "border-b-3 transition-all border-red-500": "text-black"} cursor-pointer`}>    <li>Home</li>
</NavLink>
<NavLink to={'/products'} className={({isActive})=> `${isActive ? "border-b-3 transition-all border-red-500": "text-black"} cursor-pointer`}>    <li>Products</li>
</NavLink>
<NavLink to={'/about'} className={({isActive})=> `${isActive ? "border-b-3 transition-all border-red-500": "text-black"} cursor-pointer`}>    <li>About</li>
</NavLink>
<NavLink to={'/contact'} className={({isActive})=> `${isActive ? "border-b-3 transition-all border-red-500": "text-black"} cursor-pointer`}>    <li>Contact</li>
</NavLink>    

  </ul>

  {/* My Orders Section (Only for Logged in users) */}
  {isSignedIn && (
    <div onClick={() => navigate('/orders')} className='flex flex-col items-center cursor-pointer text-gray-700 hover:text-red-500 transition-all'>
      <LuPackageCheck className='h-7 w-7' />
      <span className='text-[10px] font-bold'>Orders</span>
    </div>
  )}

  {/* Updated Cart Link with Logic */}
  <div onClick={handleCartClick} className='relative cursor-pointer flex flex-col items-center text-gray-700 hover:text-red-500 transition-all'>
    <IoCartOutline className='h-7 w-7'/>
    <span className='bg-red-500 px-2 rounded-full absolute -top-1 -right-3 text-white text-sm'>{cartItem.length}</span>
    <span className='text-[10px] font-bold'>Cart</span>
  </div>

  <div className='hidden md:block'> 
                
         <Show when="signed-out">
          <SignInButton  className="bg-red-500 text-white px-3 py-1 rounded-md cursor-pointer" />
        </Show>
        <Show when="signed-in">
          <LogoutButton/>
        </Show>
      </div>
      {
        openNav ? <HiMenuAlt3 onClick={()=>setOpenNav(false)
        } className='h-7 w-7 md:hidden cursor-pointer'/>:<HiMenuAlt1 onClick={()=>setOpenNav(true)} className='h-7 w-7 md:hidden cursor-pointer'/>
      }
</nav>
      </div>
      <ResponsiveMenu  openNav={openNav} setOpenNav={setOpenNav}/>
    </div>
    
  )
}

export default Navbar