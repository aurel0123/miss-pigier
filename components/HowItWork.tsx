"use client";
import React from "react";
import { motion } from "framer-motion";
import { Description } from "@/constantes/index";

const HowItWork = () => {
    return (
        <motion.section
            className="py-20 px-10 flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
        >
            <motion.h2
                className="lg:text-5xl text-xl md:text-3xl font-bold text-primary"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
            >
                Comment participer ?
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16 w-full">
                {Description.map((description, index) => (
                    <motion.div
                        key={description.etape}
                        className="space-y-8"
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: index * 0.2 }}
                        viewport={{ once: true }}
                    >
                        <div className="h-16 w-16 rounded-full bg-secondary flex justify-center items-center mx-auto">
                            <span className="text-lg font-medium text-neutral-900">{description.etape}</span>
                        </div>
                        <h3 className="text-xl font-semibold leading-0.5 text-center">{description.titre}</h3>
                        <p className="text-gray-600">{description.description}</p>
                    </motion.div>
                ))}
            </div>
        </motion.section>
    );
};

export default HowItWork;
