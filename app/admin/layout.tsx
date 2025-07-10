import Sidebar from '@/components/admin/Sidebar'
import React, { ReactNode } from 'react'
import '@/styles/admin.css'
import Header from '@/components/admin/Header'

const layout = ({children} : {children : ReactNode}) => {
    return (
        <main className='flex min-h-screen w-full flex-row'>
            <Sidebar />
            <div className='adminContainer'>
                <Header/>
                {children}
            </div>
        </main>
    )
}

export default layout