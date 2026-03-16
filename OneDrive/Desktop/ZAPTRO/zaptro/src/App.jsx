import React, { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Products from './pages/Products'
import About from './pages/About'
import Contact from './pages/Contact'
import Cart from './pages/Cart'
import Orders from './pages/Orders' // 1. Orders page import kiya
import Navbar from './components/Navbar'
import axios from 'axios'
import Footer from './components/Footer'
import SingleProduct from './pages/SingleProduct'
import CategoryProduct from './pages/CategoryProduct'
import { useCart } from './context/CartContext'
import ProtectedRoute from './components/ProtectedRoute'

const App = () => {
  const [location, setLocation] = useState()
  const [openDropdown,setOpenDropdown]=useState(false)
  const {cartItem, setCartItem} = useCart()

  const getLocation = () => {
    if (!navigator.geolocation) {
      console.log("Geolocation not supported")
      return
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords
        const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
        try {
          const res = await axios.get(url)
          const address = res.data.address
          const exactLocation = {
            village: address.village || address.town || address.city,
            district: address.county,
            state: address.state,
            country: address.country,
            pincode: address.postcode
          }
          setLocation(exactLocation)
          setOpenDropdown(false)
        } catch (error) {
          console.log("API Error:", error)
        }
      },
      (error) => {},
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    )
  }

  useEffect(() => {
    getLocation()
  }, [])

  useEffect(()=>{
    const storedCart = localStorage.getItem('cartItem')
    if(storedCart){
      setCartItem(JSON.parse(storedCart))
    }
  },[]);

  useEffect(()=>{
    localStorage.setItem('cartItem', JSON.stringify(cartItem))
  },[cartItem])

  return (
    <>
      <Navbar location={location} getLocation={getLocation} openDropdown={openDropdown} setOpenDropdown={setOpenDropdown}/>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/zaptro' element={<Home />} />
        <Route path='/products' element={<Products />} />
        <Route path='/products/:id' element={<SingleProduct />} />
        <Route path='/category/:category' element={<CategoryProduct />}/>
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/cart' element={<ProtectedRoute><Cart location={location} getLocation={getLocation} /></ProtectedRoute>} />
        {/* 2. Naya Order Route */}
        <Route path='/orders' element={<ProtectedRoute><Orders /></ProtectedRoute>} />
      </Routes>
      <Footer />
    </>
  )
}

export default App