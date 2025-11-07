import { Session } from 'next-auth'
import React from 'react'

const Header = ({session} : {session:Session}) => {
  return (
    <header className='bg-white h-24 p-4 border-b border-neutral-300 '>
        <div className='h-4/5 m-auto'>
            <h2 className="text-2xl font-semibold text-dark-400">
                Bienvenu {session?.user?.name}
            </h2>
        </div>
    </header>
  )
}

export default Header