import React from 'react'
import { Button } from './ui/button'
import Link from 'next/link'


const HeroSection = () => {
    return (
        <div className='hero'>
            <div className='hero-pattern'></div>
            {/* <div className="absolute inset-0 bg-gradient-to-r from-back/60 via-transparent to-black/60"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div> */}
            {/* <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-transparent to-black/50"></div> */}
            <div className='hero-container z-30'>
                <div className = "max-w-4xl gap-8 flex flex-col">
                    <h1 className='lg:text-[56px] md:text-4xl text-4xl  font-extrabold text-primary'> 
                        MISS PIGIER
                    </h1>
                    <h2 className='text-2xl lg:text-3xl md:text-3xl font-bold'>BENIN 2026</h2>
                    <p className="text-lg md:text-xl text-neutral-200 mb-8 max-w-2xl mx-auto leading-relaxed ">
                        Découvrez les candidates exceptionnelles de l&apos;Université Pigier. 
                        Participez à cet événement unique et soutenez votre candidate préférée !
                    </p>
                </div>
            </div>
            {/* Buttons CTA */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-center z-30 w-full">
                <Button size="lg" className="lg:px-10 lg:py-8 font-bold text-lg w-full md:w-auto" asChild>
                    <Link href="/candidates">
                        DECOUVREZ LES CANDIDATES
                    </Link>
                </Button>
                <Button
                    size="lg"
                    variant="outline"
                    className="lg:px-10 lg:py-8 font-bold text-lg bg-transparent border border-primary hover:bg-transparent w-full md:w-auto"
                    asChild
                >
                    <Link href="/candidates">
                        DECOUVREZ LES CANDIDATES
                    </Link>
                </Button>
            </div>
            <div className='DarkOver'></div>
        </div>
    )
}

export default HeroSection