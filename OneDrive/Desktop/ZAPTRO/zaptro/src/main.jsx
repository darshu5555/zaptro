import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ClerkProvider } from '@clerk/react'
import { DataProvider } from './context/DataContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { ToastContainer
}  from 'react-toastify'
import ScrollToTop from "react-scroll-to-top";
import { HashRouter } from 'react-router-dom'

const   PUBLISHABLE_KEY = "pk_test_c2hhcnAtYXBoaWQtODEuY2xlcmsuYWNjb3VudHMuZGV2JA"

createRoot(document.getElementById('root')).render(
  
    <DataProvider>
        <CartProvider>
        <ClerkProvider publishableKey={PUBLISHABLE_KEY}
        afterSignOutUrl="/zaptro/"
        >

<HashRouter>
    <App />
    <ScrollToTop color='white'smooth style={{backgroundColor:'#fa2d37', display:'flex', alignItems:'center', justifyContent:'center'}}/>
    <ToastContainer
position="bottom-right"
autoClose={5000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick={false}
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="light"
/>
</HashRouter>
        </ClerkProvider>
        </CartProvider>
</DataProvider>
  
)
