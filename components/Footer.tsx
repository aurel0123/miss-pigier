import Link from 'next/link'
import React from 'react'
import { Separator } from './ui/separator'
import Image from 'next/image'

const Footer = () => {
    return (
        <section >
            <div className="container">
                <div className='space-y-4 mt-10'>
                    <div className='flex flex-col gap-4 items-center '>
                        <div>
                            <Image
                                src="/images/Logo.png"
                                alt='logo'
                                width={80}
                                height={100}
                            />
                        </div>
                        <ul className='flex flex-col lg:flex-row md:flex-col items-center gap-4'>
                            <li>
                                <Link href="/Contact" className='text-neutral-500'>
                                    Contactez-nous
                                </Link>
                            </li>
                            <li>
                                <Link href="/candidates" className='text-neutral-500'>
                                    Candidates
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className='text-neutral-500'>
                                    A propos 
                                </Link>
                            </li>
                            <li>
                                <Link href="/support" className='text-neutral-500'>
                                    Support
                                </Link>
                            </li>
                            <li>
                                <Link href="/fq" className='text-neutral-500'>
                                    FQ
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <Separator/>
                    <div className='flex lg:flex-row lg:justify-between flex-col gap-3 mt-10'>
                        <p>
                            © 2025 MissPigier. Tous droits réservés.
                        </p>
                        <ul className="flex flex-col gap-2 lg:flex-row md:flex-row">
                            <li>
                                <Link href="" className='text-neutral-500 underline'>
                                    Politique de confidentialité
                                </Link>
                            </li>
                            <li>
                                <Link href="" className='text-neutral-500 underline'>
                                    Paramètres des cookies
                                </Link>
                            </li>
                            <li>
                                <Link href="" className='text-neutral-500 underline'>
                                    Conditions d&apos;utilisation
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Footer