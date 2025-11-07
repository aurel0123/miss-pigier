"use client";
import React from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

const Contact = () => {
    return (
        <motion.section
            className="py-20 px-10"
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
        >
            <div className="container">
                <div className="info-footer grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">
                    {[
                        {
                            Icon: Mail,
                            title: "Email",
                            text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in ero.",
                            link: "mailto:contact@pigier.com",
                            linkText: "contact@pigier.com",
                        },
                        {
                            Icon: Phone,
                            title: "Téléphone",
                            text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in ero.",
                            link: "tel:+2290190907890",
                            linkText: "+229 01 90 90 87 56",
                        },
                        {
                            Icon: MapPin,
                            title: "Adresse",
                            text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in ero.",
                            link: "#",
                            linkText: "123 Rue de l’Université, Paris, 75000 FR",
                        },
                    ].map((item, index) => (
                        <motion.div
                            key={index}
                            className="space-y-4"
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: index * 0.2 }}
                            viewport={{ once: true }}
                        >
                            <div className="flex justify-center md:justify-start">
                                <item.Icon size={50} className="text-primary" />
                            </div>
                            <h2 className="text-2xl font-bold">{item.title}</h2>
                            <p className="text-gray-400 mb-4 leading-relaxed text-sm">{item.text}</p>
                            <Link
                                href={item.link}
                                className="text-primary hover:text-secondary transition-colors underline"
                            >
                                {item.linkText}
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.section>
    );
};

export default Contact;
