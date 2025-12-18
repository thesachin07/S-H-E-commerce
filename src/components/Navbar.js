import React from 'react'

const Navbar = () => {
  return (
    <div>
        <nav className='items-center justify-between flex w-full border-b border-gray-200 px-6 py-4'>
          <div className='flex justify-items-start gap-12'>    
            {/* Logo */}
            <div className='p-1 cursor-pointer'>
              <svg width="50" height="35" viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">
                <text x="30" y="140" fontFamily="sans-serif" fontSize="140" fill="#E53935" fontWeight="bold">H&M</text>
              </svg>
            </div>
{/* <div className='p-1 cursor-pointer'>
              <svg width="50" height="35" viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">
                <text x="30" y="140" fontFamily="'Brush Script MT', cursive" fontSize="140" fill="#E53935" fontWeight="bold" letterSpacing="5">S&amp;H</text>
                <circle cx="75" cy="100" r="2" fill="white" />
                <circle cx="140" cy="120" r="1.5" fill="white" />
                <circle cx="110" cy="75" r="1" fill="white" />
                <circle cx="180" cy="130" r="2" fill="white" />
                <circle cx="210" cy="90" r="1" fill="white" />
                <circle cx="250" cy="70" r="1.3" fill="white" />
                <circle cx="220" cy="160" r="2" fill="white" />
                <circle cx="200" cy="110" r="1" fill="white" />
              </svg>
            </div> */}




            {/* Menu Links */}
            <div className='text-black flex items-center hidden md:flex'>
              <ul className='flex gap-6 font-medium text-sm tracking-wide'>
                <li className='hover:underline cursor-pointer'>LADIES</li>
                <li className='hover:underline cursor-pointer'>MEN</li>
                <li className='hover:underline cursor-pointer'>KIDS</li>
                <li className='hover:underline cursor-pointer'>HOME</li>
              </ul>
            </div>
          </div>

          {/* Icons (Simplified for clarity) */}
          {/* <div className='flex items-center gap-6 text-gray-700'> */}

            <div className='text-black text-2xl hover:cursor-pointer flex items-center gap-6'>
            {/* Icons */}
            <svg role="img" aria-hidden="true" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" height="16" width="16"><path fillRule="evenodd" d="M9.823 10.883a5.5 5.5 0 1 1 1.06-1.06l4.72 4.72-1.06 1.06-4.72-4.72ZM10.5 6.5a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"></path></svg>
            <svg role="img" aria-hidden="true" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" height="16" width="16"><path fillRule="evenodd" d="M12 4a4 4 0 1 1-8 0 4 4 0 0 1 8 0Zm-1.5 0a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z M8 9.5c-1.888 0-3.826.201-5.319.855-.755.33-1.43.793-1.918 1.435C.268 12.444 0 13.24 0 14.17V16h1.5v-1.83c0-.626.174-1.098.458-1.473.292-.384.732-.708 1.325-.968C4.487 11.202 6.174 11 8 11c1.833 0 3.518.182 4.721.7.591.254 1.03.574 1.319.96.283.375.46.859.46 1.511V16H16v-1.829c0-.948-.265-1.755-.761-2.414-.49-.65-1.168-1.11-1.925-1.436C11.82 9.678 9.88 9.5 8 9.5Z"></path></svg>
            <svg role="img" aria-hidden="true" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" height="16" width="16"><path d="M8.697 2.253a4.278 4.278 0 0 1 6.05 6.05L8 15.05 1.253 8.304a4.278 4.278 0 0 1 6.05-6.05L8 2.948l.696-.696Zm4.99 1.06a2.778 2.778 0 0 0-3.93 0L8.003 5.07 6.243 3.315a2.779 2.779 0 0 0-3.93 3.928L8 12.928l5.686-5.686a2.778 2.778 0 0 0 0-3.928Z"></path></svg>
            <svg role="img" aria-hidden="true" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" height="16" width="16"><path fillRule="evenodd" d="M8 0C6.928 0 5.92.298 5.16.75c-.704.42-1.411 1.115-1.411 2V4.5L0 4.501V15h16V4.5h-3.75V2.75c0-.893-.7-1.59-1.41-2.01C10.08.29 9.072 0 8 0Zm2.75 6v3h1.5V6h2.25v7.5h-13V6h2.25v3h1.5V6h5.5Zm0-1.5V2.75c0-.08-.107-.383-.674-.72C9.557 1.724 8.816 1.5 8 1.5c-.808 0-1.55.228-2.07.539-.577.343-.68.648-.68.711V4.5h5.5Z"></path></svg>
          </div>

          
        </nav>
      </div>
  )
}

export default Navbar