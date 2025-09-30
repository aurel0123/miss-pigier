import Footer from '@/components/Footer'
import {Header} from '@/components/Header'
import { navigationLink } from '@/constantes'
import React, { ReactNode } from 'react'

const layout = ({children} : {children : ReactNode}) => {
    return (
        <main className='w-full'>
            <div className="max-w-7xl relative">
                <Header Navigation={navigationLink}/>
            </div>
            {children}
            <Footer/>
        </main>
    )
}

export default layout