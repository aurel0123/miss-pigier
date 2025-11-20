"use client";
import React from "react";
import { motion } from "framer-motion";
import { Target, Shield, Users, Award, CheckCircle, Zap } from "lucide-react";

const AboutPage = () => {
    const features = [
        {
            icon: Users,
            title: "Expérience utilisateur fluide",
            description: "Interface moderne et intuitive accessible depuis tout appareil"
        },
        {
            icon: Shield,
            title: "Système sécurisé",
            description: "Vote transparent avec multiples niveaux de protection"
        },
        {
            icon: CheckCircle,
            title: "Gestion claire",
            description: "Organisation simplifiée des concours et des candidats"
        },
        {
            icon: Zap,
            title: "Accessibilité totale",
            description: "Plateforme disponible sur smartphone, tablette et ordinateur"
        }
    ];

    const security = [
        "Garantir la validité des votes",
        "Empêcher les doublons et la fraude",
        "Sécuriser les données des utilisateurs",
        "Assurer un traitement rapide et précis des résultats"
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="py-20 px-4">
                <div className="container mx-auto max-w-6xl">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6">
                            À propos du site
                        </h1>
                        <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
                            Bienvenue sur notre plateforme de vote en ligne, un espace moderne, sécurisé et entièrement dédié à l'organisation de concours, d'élections et d'événements interactifs.
                        </p>
                    </motion.div>

                    {/* Mission Section */}
                    <motion.div
                        className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 md:p-12 border border-primary/20 mb-12"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 text-center">
                            Notre Mission
                        </h2>
                        <p className="text-gray-300 text-lg leading-relaxed text-center max-w-3xl mx-auto">
                            Notre objectif est de permettre aux participants, candidats et organisateurs de bénéficier d'un système de vote fiable, accessible et simple d'utilisation. Grâce à une interface moderne et un design élégant, chaque visiteur peut découvrir les candidats, consulter leurs profils, suivre l'évolution des votes et participer en toute simplicité.
                        </p>
                    </motion.div>

                    {/* Features Grid */}
                    <motion.div
                        className="mb-16"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
                            Ce que nous offrons
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="bg-primary/10 p-3 rounded-lg flex-shrink-0">
                                            <feature.icon size={28} className="text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-2">
                                                {feature.title}
                                            </h3>
                                            <p className="text-gray-400">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Security Section */}
            <section className="py-16 px-4 bg-gray-900/50">
                <div className="container mx-auto max-w-5xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <div className="text-center mb-12">
                            <div className="flex justify-center mb-6">
                                <div className="bg-primary/10 p-4 rounded-full">
                                    <Shield size={48} className="text-primary" />
                                </div>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                Fiabilité et Sécurité
                            </h2>
                            <p className="text-gray-300 text-lg max-w-3xl mx-auto">
                                La sécurité est au cœur de notre technologie. Notre système intègre plusieurs niveaux de protection.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                            {security.map((item, index) => (
                                <motion.div
                                    key={index}
                                    className="flex items-start gap-3 bg-gray-800/30 rounded-lg p-4 border border-primary/10"
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <CheckCircle className="text-primary flex-shrink-0 mt-1" size={20} />
                                    <p className="text-gray-300">{item}</p>
                                </motion.div>
                            ))}
                        </div>

                        <p className="text-gray-400 text-center">
                            Nous utilisons des technologies récentes et robustes afin d'assurer une plateforme stable, performante et adaptée aux besoins des organisateurs.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Transparency Section */}
            <section className="py-16 px-4">
                <div className="container mx-auto max-w-5xl">
                    <motion.div
                        className="bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/20 rounded-2xl p-8 md:p-12 border border-primary/30"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <div className="text-center mb-8">
                            <Award size={48} className="text-primary mx-auto mb-4" />
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                Transparence et Équité
                            </h2>
                            <p className="text-gray-200 text-lg max-w-2xl mx-auto">
                                Chaque vote compte. Notre plateforme applique des règles strictes de vérification afin d'assurer que chaque participant puisse voter équitablement et que les résultats reflètent fidèlement la volonté du public.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Engagement Section */}
            <section className="py-16 px-4 bg-gray-900/50">
                <div className="container mx-auto max-w-4xl">
                    <motion.div
                        className="text-center"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                            Notre Engagement
                        </h2>
                        <p className="text-gray-300 text-lg leading-relaxed mb-8">
                            Nous nous engageons à offrir un service professionnel, respectueux des utilisateurs et orienté vers l'excellence. Notre ambition est de permettre aux structures, écoles, universités et organisations de disposer d'un outil en ligne fiable et à la hauteur de leurs événements.
                        </p>
                        <div className="bg-primary/10 rounded-xl p-6 border border-primary/20">
                            <p className="text-primary text-xl font-semibold">
                                Merci d'avoir choisi notre plateforme pour votre concours. Nous sommes honorés de participer à la réussite de votre événement.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;