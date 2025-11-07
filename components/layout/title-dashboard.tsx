import {SidebarMenu , SidebarMenuItem, SidebarMenuButton} from '@/components/ui/sidebar';
import React from "react";
import Link from 'next/link'
import Image from "next/image";

export default function TitleDashboard(){
    return(
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton size="lg" >
                    <Link href='/' className={'flex gap-1 items-center justify-center logo'}>
                        <div className={''}>
                            <Image
                                src="/images/Logo.png"
                                alt="Logo"
                                height={40}
                                width={40}
                            />
                        </div>
                        <div>
                            <h1 className={'text-xl font-semibold font-outfit'}>Miss Pigier</h1>
                        </div>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
