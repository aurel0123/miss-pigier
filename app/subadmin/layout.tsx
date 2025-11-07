
import React, { ReactNode } from 'react'
import '@/styles/admin.css'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { db } from '@/database/drizzle'
import { admins } from '@/database/schema'
import { eq } from 'drizzle-orm'
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import AppSidebar from '@/components/layout/app-sidebar';
import {Separator} from "@/components/ui/separator";
import {Main} from '@/components/layout/main';


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
    const role = isConnect[0].role
    if (!role) redirect("/");
    return (
        <SidebarProvider className={'bg'}>
            <AppSidebar
                session={session}
                role={role}
            />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b">
                    <div className="flex items-center gap-2 px-3">
                        <SidebarTrigger className={'text-neutral-800 size-10'}/>
                        <Separator orientation="vertical" className="mr-2 h-4" />
                    </div>
                </header>
                <Main>
                    {children}
                </Main>
            </SidebarInset>
        </SidebarProvider>
    )
}

export default layout