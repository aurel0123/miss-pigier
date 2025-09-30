"use client";
import { navigationLink } from "@/constantes";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { AlignRight } from 'lucide-react';
import { NavigationLink } from "@/types";
import  {ArrowLeft , Share2 } from "lucide-react"

interface Props {
    ChangeNavbar?: boolean,
    Navigation?: NavigationLink[]
}
const menuVariants = {
    closed: { opacity: 0, height: 0, transition: { when: "afterChildren" } },
    open: {
        opacity: 1,
        height: "auto",
        transition: { when: "beforeChildren", staggerChildren: 0.05 },
    },
};

const linkVariants = {
    closed: { opacity: 0, x: -20 },
    open: { opacity: 1, x: 0 },
};

export const Header = ({ ChangeNavbar, Navigation }: Props) => {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const handleShare = () => {
        const currentUrl = window.location.href;

        if (navigator.share) {
            navigator.share({
                title: "Vote pour un candidat",
                text: "Soutiens ton candidat préféré ici 👇",
                url: currentUrl,
            }).catch((error) => console.error("Erreur de partage", error));
        } else {
            // fallback vers WhatsApp
            const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
                `Soutiens ton candidat ici 👇\n${currentUrl}`
            )}`;
            window.open(whatsappUrl, "_blank");
        }
    };


    if (ChangeNavbar === true) {
        return (
            <div className="w-full z-50 fixed top-0 left-0 right-0 border-b border-amber-400 bg-background/70 backdrop-blur-md">
                <nav className="max-w-7xl mx-auto">
                    <ul className="flex flex-row gap-8 items-center justify-between p-6">
                        <li className="flex flex-row gap-2 items-center">
                            {/* Affiche l'icône s'il y en a une */}
                            <ArrowLeft className="w-4 h-4" />
                            <Link
                                href="/candidates"
                                className={cn(
                                    "text-base font-medium cursor-pointer hover:text-white transition-colors",
                                )}
                            >
                                Retour
                            </Link>
                        </li>
                        <li className="flex flex-row gap-2 items-center">
                            {/* Affiche l'icône s'il y en a une */}
                            <Share2 className="w-4 h-4" />
                            <Link
                                href=""
                                onClick={handleShare}
                                className={cn(
                                    "text-base font-medium cursor-pointer hover:text-white transition-colors",
                                )}
                            >
                                Partager
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        )
    }
    return (
        <header className="w-full z-50 fixed top-0 left-0 right-0 border-b border-amber-400 bg-background/70 backdrop-blur-md">
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between p-2 md:flex-nowrap">
                {/* Logo */}
                <Link href="/" className="flex items-center">
                    <Image
                        src="/images/Logo.png"
                        alt="Logo"
                        width={80}
                        height={100}
                        priority
                    />
                </Link>

                {/* Burger toggle (visible on mobile) */}
                <button
                    className="md:hidden p-2 focus:outline-none"
                    onClick={() => setIsOpen((v) => !v)}
                    aria-label="Toggle menu"
                >
                    <AlignRight />
                </button>

                {/* Desktop nav */}
                <nav className="hidden md:block">
                    <ul className="flex flex-row gap-8 items-center">
                        {Navigation && Navigation.map((link) => (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    className={cn(
                                        "text-base font-medium cursor-pointer hover:text-white transition-colors",
                                        pathname === link.href
                                            ? "text-neutral-100"
                                            : "text-neutral-300"
                                    )}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* CTA button on desktop */}
                <div className="hidden md:block">
                    <Button asChild>
                        <Link href="/candidates">VOTER</Link>
                    </Button>
                </div>
            </div>

            {/* Mobile menu */}
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.nav
                        className="md:hidden bg-primary-900"
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={menuVariants}
                    >
                        <motion.ul className="flex flex-col p-4 gap-4">
                            {navigationLink.map((link) => (
                                <motion.li key={link.href} variants={linkVariants}>
                                    <Link
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className={cn(
                                            "block text-base font-medium hover:text-white transition-colors",
                                            pathname === link.href
                                                ? "text-neutral-100"
                                                : "text-neutral-300"
                                        )}
                                    >
                                        {link.label}
                                    </Link>
                                </motion.li>
                            ))}
                            <motion.li variants={linkVariants}>
                                <Button asChild className="w-full">
                                    <Link href="/candidates">VOTER</Link>
                                </Button>
                            </motion.li>
                        </motion.ul>
                    </motion.nav>
                )}
            </AnimatePresence>
        </header>
    );
};


