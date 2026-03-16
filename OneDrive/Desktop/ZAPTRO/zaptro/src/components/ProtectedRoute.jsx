import { useUser } from '@clerk/react'
import React from 'react'
import { Navigate } from 'react-router-dom'
import { ImSpinner2 } from 'react-icons/im'; 

const ProtectedRoute = ({children}) => {
  const { isLoaded, isSignedIn } = useUser()

  
  if (!isLoaded) {
    return (
      <div className='h-screen w-full flex flex-col justify-center items-center gap-4 bg-white'>
       
        <ImSpinner2 className='text-red-500 text-5xl animate-spin' />
        <p className='text-gray-600 font-semibold animate-pulse'>Zaptro is loading...</p>
      </div>
    )
  }

  if (!isSignedIn) {
    return <Navigate to='/' />
  }

  return (
    <>
      {children}
    </>
  )
}

export default ProtectedRoute