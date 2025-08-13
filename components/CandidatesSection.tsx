"use client"
import React from 'react'
import { motion } from 'framer-motion'
import { Button } from './ui/button'
import Link from 'next/link'
import { Badge } from './ui/badge'
import { getCodeFil } from '@/lib/utils'
import { Candidate } from '@/types'
interface Props {
    candidates : Candidate[]
}

const CandidatesSection = ({candidates} : Props) => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delayChildren: 0.3,
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5
            }
        }
    };

    const cardHover = {
        scale: 1.05,
        transition: { duration: 0.3 }
    };

    
    return (
        <>
            <motion.div
                className="pt-24 pb-16 px-4 "
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <div className='flex flex-col gap-6 py-10 text-center'>
                    <motion.h1
                        className="text-2xl lg:text-6xl font-bold text-primary mb-4"
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        Découvrez les candidates de MissPigier
                    </motion.h1>
                    <motion.p
                        className="text-base text-white mb-8 max-w-3xl mx-auto"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        Explorez les profils des participantes et soutenez votre candidate préférée. Chaque vote compte dans cette compétition passionnante !
                    </motion.p>
                    <motion.div
                        className='flex lg:flex-row flex-col gap-4 justify-center'
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                    >
                        <Button
                            className='font-semibold hover:bg-yellow-500 transition-colors lg:px-10 lg:py-8 px-9 py-4 lg:text-lg'
                        >
                            <Link href="/candidates">
                                VOTER MAINTENANT
                            </Link>
                        </Button>
                        <Button variant="outline" className='border border-secondary g:px-10 lg:py-8 px-9 py-4 lg:text-lg'>
                            <Link href="/candidates">
                                PARTAGER
                            </Link>
                        </Button>
                    </motion.div>
                </div>
            </motion.div>
            <section className="py-10 px-4">
                <div className="flex flex-col px-1 mx-auto">
                    <motion.h2
                        className="text-2xl md:text-4xl font-bold text-yellow-400 text-center mb-4"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        Découvrez les candidates de MissPigier
                    </motion.h2>
                    <motion.p
                        className="text-center text-white mb-12 max-w-2xl mx-auto text-sm"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        Supportez vos candidates favoris en leur accordant vos votes. Chaque vote compte dans cette compétition prestigieuse !
                    </motion.p>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl "
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        {candidates.map((candidate) => (
                            <motion.div
                                key={candidate.id}
                                variants={itemVariants}
                                whileHover={cardHover}
                                className="relative cursor-pointer w-full h-[320px]  border-2 border-primary/30 rounded-2xl hover:shadow-[0_0_20px_rgba(255,215,0,0.3),0_0_40px_rgba(255,215,0,0.2),0_0_60px_rgba(255,215,0,0.1)]"
                            >
                                {/* Badge */}
                                <Badge className='absolute top-4 right-4 z-20 bg-secondary'>
                                    {getCodeFil(candidate.filiere)}
                                </Badge>
                                <div className="relative h-full overflow-hidden rounded-2xl">
                                    <motion.img
                                        src={candidate.image}
                                        alt="image"
                                        className="w-full h-full object-cover transition-transform duration-500 "
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />
                                </div>
                                <div className='absolute bottom-0 left-0 right-0 z-20 p-2'>
                                    <div>
                                        <Link href={`/candidates/${candidate.id}`} className='text-primary hover:underline font-extrabold text-base'>
                                            {candidate.nom}{" "} {candidate.prenom}
                                        </Link>
                                        <p className='text-[12px]'>
                                            {candidate.description}
                                        </p>
                                    </div>
                                    <div className='flex flex-row justify-between items-center'>
                                        <div className='flex flex-col text-sm'>
                                            <h4 className='font-semibold'>VOTES</h4>
                                            <p className='text-lg font-extrabold text-primary'>
                                                {candidate.nombreVotes}
                                            </p>
                                        </div>
                                        <Button size="sm" className=''>
                                            <Link href="/voter" className='font-extrabold text-sm text-neutral-950'>
                                                VOTER
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>
            <motion.section
                className="py-16 px-4 bg-gray-900"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
            >
                <div className="container mx-auto">
                    <motion.h2
                        className="text-3xl md:text-4xl font-bold text-yellow-400 text-center mb-8"
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        Comment ça marche ?
                    </motion.h2>

                    <motion.div
                        className="max-w-3xl mx-auto space-y-4 text-white"
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        <div className="flex items-start gap-4">
                            <span className="bg-yellow-400 text-black rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">1</span>
                            <p>Parcourez les profils des candidates Miss et Mister.</p>
                        </div>
                        <div className="flex items-start gap-4">
                            <span className="bg-yellow-400 text-black rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">2</span>
                            <p>Cliquez sur le bouton &#34;Voter&#34; du candidat de votre choix.</p>
                        </div>
                        <div className="flex items-start gap-4">
                            <span className="bg-yellow-400 text-black rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">3</span>
                            <p>Sélectionnez le nombre de votes que vous souhaitez attribuer.</p>
                        </div>
                        <div className="flex items-start gap-4">
                            <span className="bg-yellow-400 text-black rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">4</span>
                            <p>Procédez au paiement sécurisé via notre partenaire FedaPay.</p>
                        </div>
                        <div className="flex items-start gap-4">
                            <span className="bg-yellow-400 text-black rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">5</span>
                            <p>Votre vote sera immédiatement comptabilisé et visible sur le profil du candidat.</p>
                        </div>
                    </motion.div>

                    <motion.p
                        className="text-center text-gray-400 text-sm mt-8"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        viewport={{ once: true }}
                    >
                        <strong>NOTE:</strong> Vous pouvez voter autant de fois que vous le souhaitez pour participer davantage.
                    </motion.p>
                </div>
            </motion.section>
        </>

    )
}

export default CandidatesSection