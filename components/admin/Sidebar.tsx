"use client"
import React from 'react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { adminSideBarLinks } from '@/constantes'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '../ui/avatar'
export default function Sidebar() {
    const pathname = usePathname()
    return (
        <div className='adminSidebar'>
            <div>
                <div className="logo">
                    <Image
                        src="/images/Logo.png"
                        alt="Logo"
                        height={40}
                        width={40}
                    />
                    <h1>Miss Pigier</h1>
                </div> 
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
                                                className = {`${isSelected ? "brightness-0 invert" : ""} object-contain`}
                                            />
                                        </div>
                                        <p className={cn(isSelected ? "text-white" : "text-gray-500")}>
                                            {link.text}
                                        </p>
                                    </div>
                                </Link>
                            )
                        })
                    }
                </div>
            </div> 
             <div className="user">
                <Avatar>
                    <AvatarFallback className="bg-amber-300">
                        IN
                    </AvatarFallback>
                </Avatar>

                <div className="flex flex-col max-md:hidden">
                    <p className="font-semibold text-gray-200">John Simth</p>
                    <p className="text-sm text-gray-500">John Simth</p>
                </div>
            </div>   
        </div>
    )
}