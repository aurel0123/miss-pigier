"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import Link from 'next/link';

const HeroSection = () => {
    return (
        <div className='hero relative overflow-hidden'>
            <div className='hero-pattern'></div>

            {/* Container principal animé */}
            <motion.div
                className='hero-container z-30'
                initial={{ opacity: 0, y: 50 }}       // point de départ (invisible + décalé)
                animate={{ opacity: 1, y: 0 }}        // position finale
                transition={{ duration: 1, ease: 'easeOut' }} // durée & easing
            >
                <div className="max-w-4xl gap-8 flex flex-col text-center mx-auto">
                    <motion.h1
                        className='lg:text-[56px] md:text-4xl text-4xl font-extrabold text-primary'
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                    >
                        MISS PIGIER
                    </motion.h1>

                    <motion.h2
                        className='text-2xl lg:text-3xl md:text-3xl font-bold'
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                    >
                        BENIN 2026
                    </motion.h2>

                    <motion.p
                        className="text-lg md:text-xl text-neutral-200 mb-8 max-w-2xl mx-auto leading-relaxed"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.7 }}
                    >
                        Découvrez les candidates exceptionnelles de l&apos;Université Pigier.
                        Participez à cet événement unique et soutenez votre candidate préférée !
                    </motion.p>
                </div>
            </motion.div>

            {/* Boutons animés avec légère entrée en fondu */}
            <motion.div
                className="flex flex-col md:flex-row gap-4 md:gap-8 items-center z-30 w-full justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
            >
                <Button
                    className="text-md px-4 py-3 lg:px-10 lg:py-8 font-bold lg:text-lg w-full md:w-auto"
                    asChild
                >
                    <Link href="/candidates">DECOUVREZ LES CANDIDATES</Link>
                </Button>

                <Button
                    variant="outline"
                    className="text-primary text-md px-4 py-3 lg:px-10 lg:py-8 font-bold lg:text-lg bg-transparent border border-primary hover:bg-transparent hover:text-primary w-full md:w-auto"
                    asChild
                >
                    <Link href="/candidates">VOTER MAINTENANT</Link>
                </Button>
            </motion.div>

            <div className='DarkOver'></div>
        </div>
    );
};

export default HeroSection;
