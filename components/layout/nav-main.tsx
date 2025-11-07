"use client";

import {DataNavigationLink} from "@/types";
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenuItem,
    SidebarMenu,
    SidebarMenuButton
} from '@/components/ui/sidebar' ;
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export  default function NavMain({data} : {data: DataNavigationLink[]}) {
    const pathname = usePathname();

    return(
        <SidebarGroup>
            <SidebarGroupLabel>{data[0].title}</SidebarGroupLabel>
                <SidebarMenu>
                    {
                        data[0].items?.map((item) =>{
                            const isSelected =
                                (
                                    item.url !== "/admin" &&
                                    item.url !== "/subadmin" &&
                                    pathname.includes(item.url) &&
                                    item.url.length > 1
                                ) ||
                                item.url === pathname
                            return(
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        className={isSelected ? 'bg-primary shadow-md' : ''}
                                    >
                                        <Link href={item.url}>
                                            {item.icon && <item.icon />}
                                            {item.title}
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )
                        })
                    }
                </SidebarMenu>

        </SidebarGroup>
    )
}