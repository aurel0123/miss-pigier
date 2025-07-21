"use client"
import React from 'react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { adminSideBarLinks } from '@/constantes'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { Session } from 'next-auth'
import { DropdownMenu } from '@radix-ui/react-dropdown-menu'
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { ChevronsUpDown, LogOut } from 'lucide-react'
import signOutAction from '@/lib/actions/signOut'
export default function Sidebar({session} : {session : Session}) {
    const pathname = usePathname()
    return (
        <div className='adminSidebar'>
            <div>
                <Link href='/' className="logo">
                    <Image
                        src="/images/Logo.png"
                        alt="Logo"
                        height={40}
                        width={40}
                    />  
                    <h1>Miss Pigier</h1>
                </Link> 
                <div className='flex flex-col gap-5 mt-10'>
                    {
                        adminSideBarLinks.map((link)=> {
                            const isSelected = (link.path !== "/admin" && pathname.includes(link.path) && link.path.length > 1) || link.path == pathname
                            return (
                                <Link href={link.path} key={link.path}>
                                    <div className={cn("link", isSelected && "bg-primary shadow-sm")}>
                                        <div className='size-5 relative'>
                                            <Image
                                                src={link.img}
                                                alt="icon"
                                                fill
                                                className = {`${isSelected ? "brightness-0 " : ""} object-contain`}
                                            />
                                        </div>
                                        <p className={cn(isSelected ? "text-primary-foreground" : "text-gray-500")}>
                                            {link.text}
                                        </p>
                                    </div>
                                </Link>
                            )
                        })
                    }
                </div>
            </div> 
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <div className="user">
                        <Avatar>
                            <AvatarFallback className="bg-amber-500 text-neutral-950 font-semibold p-3">
                                IN
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex flex-col max-md:hidden items-start">
                            <p className="font-semibold text-gray-600">{session?.user?.name}</p>
                            <p className="text-xs text-gray-900">{session?.user?.email}</p>
                        </div>
                        <ChevronsUpDown className="text-neutral-950 size-4" />
                    </div> 
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    className=" min-w-56 rounded-lg bg-neutral-100"
                    align="end"
                    side="right"
                >
                    <DropdownMenuLabel className="p-0 font-normal">
                        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarFallback className="bg-amber-500 text-neutral-950 font-semibold rounded-lg">CN</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-medium text-gray-600">{session?.user?.name}</span>
                            <span className="truncate text-xs text-gray-900">{session?.user?.email}</span>
                            </div>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className='text-gray-600 hover:bg-transparent hover:text-neutral-900'>
                        <form action={signOutAction} className="w-full">
                            <button type="submit" className="w-full flex items-center gap-2 px-2 py-1 text-left">
                                <LogOut />
                                Log out
                            </button>
                        </form>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
               
        </div>
    )
}