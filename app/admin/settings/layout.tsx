import {ReactNode} from "react";
import {Separator} from "@/components/ui/separator";
import {SidebarNav} from "@/app/admin/settings/components/sidebar-nav";
import {Main} from "@/components/layout/main";
import {Bell, Globe, Palette, UserCog, Wrench} from "lucide-react";

const sidebarNavItems = [
    {
        title: 'Profile',
        href: '/admin/settings/',
        icon: <UserCog size={18} />,
    },
    {
        title: 'Appearance',
        href: '/admin/settings/appearance',
        icon: <Palette size={18} />,
    },
    {
        title: 'Notifications',
        href: '/admin/settings/notifications',
        icon: <Bell size={18} />,
    },
    {
        title: 'Site',
        href: '/settings/site',
        icon: <Globe size={18} />,
    },
]

const layout = ({children} : {children : ReactNode}) => {
    return (
        <>
            <Main fixed>
                <div className='space-y-0.5'>
                    <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
                        Settings
                    </h1>
                    <p className='text-muted-foreground'>
                        Manage your account settings and set e-mail preferences.
                    </p>
                </div>
                <Separator className='my-4 lg:my-6' />
                <div className='flex flex-1 flex-col space-y-2 overflow-hidden md:space-y-2 lg:flex-row lg:space-y-0 lg:space-x-12'>
                    <aside className='top-0 lg:sticky lg:w-1/5'>
                        <SidebarNav items={sidebarNavItems} />
                    </aside>
                    <div className='flex w-full overflow-y-hidden p-1'>
                        {children}
                    </div>
                </div>
            </Main>
        </>
    )
}

export  default layout;