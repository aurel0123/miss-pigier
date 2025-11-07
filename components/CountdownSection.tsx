"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import config from "@/lib/config";

const CountdownSection = () => {
    const [timerleft, setTimerleft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        secondes: 0,
    });

    const getCurrentEvent = async () => {
        try {
            const response = await fetch(`${config.env.apiEndpoint}/api/Evenement/get`);
            const data = await response.json();
            if (data.success) {
                return data.evenements[0]?.dateFin;
            }
        } catch (error) {
            console.error("Erreur lors de la récupération de l'événement:", error);
            return null;
        }
    };

    useEffect(() => {
        const fetchDateAndStartTimer = async () => {
            const dateFinStr = await getCurrentEvent();
            if (!dateFinStr) return;

            const DateFin = new Date(dateFinStr).getTime();

            const timer = setInterval(() => {
                const now = new Date().getTime();
                const Difference = DateFin - now;

                if (Difference > 0) {
                    setTimerleft({
                        days: Math.floor(Difference / (1000 * 60 * 60 * 24)),
                        hours: Math.floor((Difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                        minutes: Math.floor((Difference % (1000 * 60 * 60)) / (1000 * 60)),
                        secondes: Math.floor((Difference % (1000 * 60)) / 1000),
                    });
                }
            }, 1000);

            return () => clearInterval(timer);
        };

        fetchDateAndStartTimer();
    }, []);

    return (
        <motion.section
            className="py-20 px-10"
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true }}
        >
            <div className="w-full flex flex-col items-center justify-center">
                <motion.h3
                    className="text-white text-xl mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    Evènement
                </motion.h3>

                <motion.h2
                    className="lg:text-5xl text-xl md:text-3xl font-bold text-primary mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    Décompte jusqu&apos;à la finale
                </motion.h2>

                <motion.p
                    className="text-gray-300 text-lg mb-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                >
                    Ne manquez pas la fin de l&apos;événement !
                </motion.p>
            </div>

            <motion.div
                className="CountDown lg:flex lg:flex-row md:flex grid grid-cols-2 gap-8 w-full justify-center items-center"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
            >
                {[
                    { label: "JOURS", value: timerleft.days },
                    { label: "HEURES", value: timerleft.hours },
                    { label: "MINUTES", value: timerleft.minutes },
                    { label: "SECONDES", value: timerleft.secondes },
                ].map((item, index) => (
                    <motion.div
                        key={index}
                        className="bg-gradient-to-b from-yellow-400/10 to-transparent border-2 border-yellow-400/30 rounded-lg p-6 w-[131px] h-[131px] flex flex-col items-center shadow-[0_0_20px_rgba(255,215,0,0.3),0_0_40px_rgba(255,215,0,0.2),0_0_60px_rgba(255,215,0,0.1)]"
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.2 }}
                        viewport={{ once: true }}
                    >
                        <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                            {String(item.value).padStart(2, "0")}
                        </div>
                        <div className="text-white text-lg font-semibold">{item.label}</div>
                    </motion.div>
                ))}
            </motion.div>
        </motion.section>
    );
};

export default CountdownSection;
