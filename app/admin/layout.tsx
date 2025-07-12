import Sidebar from '@/components/admin/Sidebar'
import React, { ReactNode } from 'react'
import '@/styles/admin.css'
import Header from '@/components/admin/Header'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { db } from '@/database/drizzle'
import { admins } from '@/database/schema'
import { eq } from 'drizzle-orm'

const layout = async ({children} : {children : ReactNode}) => {
    const session = await auth(); 
    if(!session?.user || !session.user.id) redirect('/auth/admin')
    const isConnect = await db
        .select()
        .from(admins)
        .where(eq(admins.id, session.user.id))
        .limit(1)
    if(isConnect.length == 0) {
        redirect('/')
    }
    return (
        <main className='flex min-h-screen w-full flex-row'>
            <Sidebar session={session}/>
            <div className='adminContainer'>
                <Header session = {session}/>
                {children}
            </div>
        </main>
    )
}

export default layout