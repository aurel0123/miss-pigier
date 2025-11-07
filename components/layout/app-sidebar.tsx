"use client"
import React from "react";
import NavMain from "@/components/layout/nav-main";
import TitleDashboard from '@/components/layout/title-dashboard'
import {Sidebar, SidebarHeader, SidebarContent, SidebarFooter} from '@/components/ui/sidebar';
import {Session} from "next-auth";
import {dataNavigation} from '@/constantes/index';
import AppOther from "@/components/layout/app-other";
import AppUser from "@/components/layout/app-user";
type Role = "admin" | "subadmin" | "responsable" ;

export default function AppSidebar({ role , session , ...props }: React.ComponentProps<typeof Sidebar> & { role: Role ,session : Session,}) {
    return (
        <Sidebar collapsible={'icon'} {...props} className={'border-0'} variant={'floating'}>
            <SidebarHeader>
                <TitleDashboard/>
            </SidebarHeader>
            <SidebarContent>
                {
                    role == "admin" ? (
                        <NavMain data={dataNavigation.nav_admin} />
                    ) : (
                        <NavMain data={dataNavigation[`nav_${role}`]}/>
                    )
                }
                {
                    role == "admin" ? (
                        <AppOther data={dataNavigation[`other_admin`]} />
                    ) : (
                        <NavMain data={dataNavigation[`other_${role}`]}/>
                    )
                }
            </SidebarContent>
            <SidebarFooter>

                <AppUser session={session}/>
            </SidebarFooter>
        </Sidebar>
    )
}