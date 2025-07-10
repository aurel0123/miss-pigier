import React from 'react'

const Header = () => {
  return (
    <header className='admin-header'>
        <div>
            <h2 className="text-2xl font-semibold text-dark-400">
                John Simth
            </h2>
            <p className="text-base text-slate-500">
                Bienvenue sur votre espace administrateur
            </p>
        </div>
    </header>
  )
}

export default Header