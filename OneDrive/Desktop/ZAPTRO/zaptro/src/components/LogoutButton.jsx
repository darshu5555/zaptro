import React from 'react';
import { useClerk } from '@clerk/react';

const LogoutButton = () => {
  const { signOut } = useClerk();

  const handleLogout = () => {
    // Ye line sabse zaroori hai. 
    // Isse Clerk ko pata chalega ki logout ke baad kahan jana hai.
    signOut({ redirectUrl: 'https://darshu5555.github.io/zaptro/' });
  };

  return (
    <button 
      onClick={handleLogout}
      className="bg-red-500 text-white px-3 py-1 rounded-md cursor-pointer"
    >
      Logout
    </button>
  );
};

export default LogoutButton;