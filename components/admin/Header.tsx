import { Session } from 'next-auth'
import React from 'react'

const Header = ({session} : {session:Session}) => {
  return (
    <header className='admin-header'>
        <div>
            <h2 className="text-2xl font-semibold text-dark-400">
                Bienvenu {session?.user?.name}
            </h2>
            <p className="text-base text-slate-600">
              Sur votre espace administrateur
            </p>
        </div>
    </header>
  )
}

export default Header