"use client"

import {Users, Trophy, Crown, Medal, TrendingUp} from 'lucide-react'
import {useEffect, useState} from 'react'
import config from '@/lib/config'
import {Card, CardContent} from '@/components/ui/card'
import {Badge} from '@/components/ui/badge'
import {Ring2} from "ldrs/react"
import 'ldrs/react/Ring2.css'

export default function Page() {
    const [rankings, setRankings] = useState([])
    const [loading, setLoading] = useState(true)

    const getRanking = async () => {
        try {
            const response = await fetch(`${config.env.apiEndpoint}/api/rankings/`)
            if (!response.ok) {
                throw Error("No such ranking")
            } else {
                const data = await response.json()
                // Trier par nombre de votes décroissant
                const sortedData = Array.isArray(data)
                    ? data.sort((a, b) => b.nombreVotes - a.nombreVotes)
                    : []
                setRankings(sortedData)
            }
        } catch (error) {
            console.error("Erreur lors du chargement:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getRanking()
        // Actualiser toutes les 30 secondes
        const interval = setInterval(getRanking, 30000)
        return () => clearInterval(interval)
    }, [])

    const totalRanks = rankings.reduce((sum, ranking) => sum + ranking.nombreVotes, 0)

    const getPodiumIcon = (index) => {
        if (index === 0) return <Crown className="h-8 w-8 text-yellow-500" />
        if (index === 1) return <Medal className="h-7 w-7 text-gray-400" />
        if (index === 2) return <Medal className="h-6 w-6 text-amber-700" />
        return <Trophy className="h-5 w-5 text-gray-400" />
    }

    const getPodiumStyle = (index) => {
        if (index === 0) return "border-yellow-500 bg-gradient-to-br from-yellow-50 to-amber-50 shadow-xl"
        if (index === 1) return "border-gray-400 bg-gradient-to-br from-gray-50 to-slate-50 shadow-lg"
        if (index === 2) return "border-amber-700 bg-gradient-to-br from-amber-50 to-orange-50 shadow-lg"
        return "border-gray-300 bg-white shadow-md"
    }

    const calculatePercentage = (votes) => {
        if (totalRanks === 0) return 0
        return ((votes / totalRanks) * 100).toFixed(1)
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Ring2
                        size="40"
                        stroke="5"
                        strokeLength="0.25"
                        bgOpacity="0.1"
                        speed="0.8"
                        color="#EAB308"
                    />
                    <p className="text-gray-600">Chargement du classement...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-950 to-black">
            {/* En-tête */}
            <section className="py-16 mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Classement en Temps Réel
                    </h1>
                    <p className="text-xl mb-8 max-w-2xl mx-auto">
                        Suivez l&apos;évolution des votes et découvrez qui mène la course pour le titre de Miss Pigier
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                        <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
                            <Users className="h-5 w-5 " />
                            <span className="text-white font-bold text-lg">{totalRanks} votes au total</span>
                        </div>
                        <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
                            <TrendingUp className="h-5 w-5 text-white" />
                            <span className="text-white font-bold text-lg">{rankings.length} candidates</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Podium - Top 3 */}
            {rankings.length >= 3 && (
                <section className="py-12 px-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                            {/* 2ème place */}
                            <div className="order-2 md:order-1 md:mt-12">
                                <Card className="bg-gray-900/50 backdrop-blur-sm border-2 border-gray-500 hover:scale-105 transition-transform shadow-2xl">
                                    <CardContent className="p-6">
                                        <div className="flex flex-col items-center">
                                            <div className="relative mb-4">
                                                <Badge className="absolute -top-2 -right-2 bg-gray-400 text-white px-3 py-1 text-lg font-bold">
                                                    2
                                                </Badge>
                                                <img
                                                    src={rankings[1]?.image}
                                                    alt={`${rankings[1]?.prenom} ${rankings[1]?.nom}`}
                                                    className="w-32 h-32 rounded-full object-cover border-4 border-gray-400"
                                                />
                                            </div>
                                            <h3 className="text-xl font-bold text-white text-center">
                                                {rankings[1]?.prenom} {rankings[1]?.nom}
                                            </h3>
                                            <p className="text-sm text-gray-300 text-center mb-3">
                                                {rankings[1]?.filiere}
                                            </p>
                                            <div className="text-center">
                                                <p className="text-3xl font-bold text-gray-200">{rankings[1]?.nombreVotes}</p>
                                                <p className="text-sm text-gray-400">votes ({calculatePercentage(rankings[1]?.nombreVotes)}%)</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* 1ère place */}
                            <div className="order-1 md:order-2">
                                <Card className="bg-gradient-to-br from-yellow-900/50 to-amber-900/50 backdrop-blur-sm border-4 border-yellow-500 hover:scale-105 transition-transform shadow-2xl">
                                    <CardContent className="p-6">
                                        <div className="flex flex-col items-center">
                                            <div className="relative mb-4">
                                                <Badge className="absolute -top-2 -right-2 bg-yellow-500 text-black px-3 py-1 text-lg font-bold animate-pulse">
                                                    1
                                                </Badge>
                                                <img
                                                    src={rankings[0]?.image}
                                                    alt={`${rankings[0]?.prenom} ${rankings[0]?.nom}`}
                                                    className="w-40 h-40 rounded-full object-cover border-4 border-yellow-500 shadow-2xl"
                                                />
                                            </div>
                                            <h3 className="text-2xl font-bold text-white text-center">
                                                {rankings[0]?.prenom} {rankings[0]?.nom}
                                            </h3>
                                            <p className="text-sm text-gray-200 text-center mb-3">
                                                {rankings[0]?.filiere}
                                            </p>
                                            <div className="text-center">
                                                <p className="text-4xl font-bold text-yellow-400">{rankings[0]?.nombreVotes}</p>
                                                <p className="text-sm text-gray-300">votes ({calculatePercentage(rankings[0]?.nombreVotes)}%)</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* 3ème place */}
                            <div className="order-3 md:mt-12">
                                <Card className="bg-amber-950/50 backdrop-blur-sm border-2 border-amber-700 hover:scale-105 transition-transform shadow-2xl">
                                    <CardContent className="p-6">
                                        <div className="flex flex-col items-center">
                                            <div className="relative mb-4">
                                                <Badge className="absolute -top-2 -right-2 bg-amber-700 text-white px-3 py-1 text-lg font-bold">
                                                    3
                                                </Badge>
                                                <img
                                                    src={rankings[2]?.image}
                                                    alt={`${rankings[2]?.prenom} ${rankings[2]?.nom}`}
                                                    className="w-32 h-32 rounded-full object-cover border-4 border-amber-700"
                                                />
                                            </div>
                                            <h3 className="text-xl font-bold text-white text-center">
                                                {rankings[2]?.prenom} {rankings[2]?.nom}
                                            </h3>
                                            <p className="text-sm text-gray-300 text-center mb-3">
                                                {rankings[2]?.filiere}
                                            </p>
                                            <div className="text-center">
                                                <p className="text-3xl font-bold text-amber-400">{rankings[2]?.nombreVotes}</p>
                                                <p className="text-sm text-gray-400">votes ({calculatePercentage(rankings[2]?.nombreVotes)}%)</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Classement complet */}
            <section className="py-12 px-4 pb-20">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-8 text-white">
                        Classement Complet
                    </h2>
                    <div className="space-y-4">
                        {rankings.map((candidate, index) => (
                            <Card
                                key={candidate.id}
                                className="bg-gray-900/70 backdrop-blur-sm border border-gray-700 hover:border-yellow-500 hover:shadow-2xl transition-all"
                            >
                                <CardContent className="p-4">
                                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                                        {/* Rang */}
                                        <div className="w-12 sm:w-16 text-center">
                                            <span className="text-2xl sm:text-3xl font-bold text-yellow-400">
                                              #{index + 1}
                                            </span>
                                        </div>

                                        {/* Photo */}
                                        <img
                                            src={candidate.image}
                                            alt={`${candidate.prenom} ${candidate.nom}`}
                                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-gray-600"
                                        />

                                        {/* Infos */}
                                        <div className="flex-grow text-center sm:text-left">
                                            <h3 className="text-lg sm:text-xl font-bold text-white">
                                                {candidate.prenom} {candidate.nom}
                                            </h3>
                                            <p className="text-sm text-gray-400">{candidate.filiere}</p>
                                        </div>

                                        {/* Votes */}
                                        <div className="text-center sm:text-right">
                                            <p className="text-2xl sm:text-3xl font-bold text-yellow-400">
                                                {candidate.nombreVotes}
                                            </p>
                                            <p className="text-xs sm:text-sm text-gray-400">
                                                {calculatePercentage(candidate.nombreVotes)}%
                                            </p>
                                        </div>
                                    </div>

                                    {/* Barre de progression */}
                                    <div className="mt-3 w-full bg-gray-800 rounded-full h-2">
                                        <div
                                            className="bg-white h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${calculatePercentage(candidate.nombreVotes)}%` }}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>


            {/* Message de mise à jour */}
            <div className="fixed bottom-4 right-4 bg-gray-900/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-gray-700">
                <p className="text-xs text-gray-300 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    Mise à jour toutes les 30s
                </p>
            </div>
        </div>
    )
}