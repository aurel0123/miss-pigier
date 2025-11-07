"use client"
import React from 'react'
import {Card, CardHeader, CardContent, CardTitle} from '@/components/ui/card'
import {Users, DollarSign, TrendingUp, Award, Trophy, Medal} from 'lucide-react'
import config from '@/lib/config'
import {Badge} from '@/components/ui/badge'

type StatItem = {
    candidateId: string;
    nom: string;
    prenom: string;
    nombreVotes: number;
    montantTotal: number;
    partSite: number;
    partOrganisateur: number;
}

const Page = () => {
    const [stats, setStats] = React.useState<StatItem[]>([])
    const [loading, setLoading] = React.useState(true)

    const getStats = async () => {
        try {
            const response = await fetch(`${config.env.apiEndpoint}/api/admin/stats/`)
            if (!response.ok) {
                throw new Error('Not Found')
            } else {
                const data = await response.json()
                setStats(Array.isArray(data) ? data : [])
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    React.useEffect(() => {
        getStats()
    }, [])

    const Total_votes = stats.reduce((sum, stat) => sum + stat.nombreVotes, 0)
    const Total_commission = stats.reduce((sum, stat) => sum + stat.partSite, 0)
    const Total_organisteur = stats.reduce((sum, stat) => sum + stat.partOrganisateur, 0)
    const Total_net = Total_organisteur + Total_commission

    // Trier les candidats par nombre de votes
    const sortedStats = [...stats].sort((a, b) => b.nombreVotes - a.nombreVotes)

    // Obtenir l'icône de rang
    const getRankIcon = (index: number) => {
        if (index === 0) return <Trophy className="w-5 h-5 text-yellow-500" />
        if (index === 1) return <Medal className="w-5 h-5 text-gray-400" />
        if (index === 2) return <Medal className="w-5 h-5 text-orange-400" />
        return <span className="w-5 h-5 flex items-center justify-center text-xs font-bold text-gray-500">{index + 1}</span>
    }

    // Calculer le pourcentage de votes
    const getVotePercentage = (votes: number) => {
        if (Total_votes === 0) return 0
        return ((votes / Total_votes) * 100).toFixed(1)
    }

    if (loading) {
        return (
            <div className="mt-8 flex items-center justify-center min-h-[400px]">
                <p className="text-gray-600">Chargement des statistiques...</p>
            </div>
        )
    }

    return (
        <section className="mt-8 space-y-6">
            {/* En-tête */}
            <div className="border-b-2 border-yellow-500 pb-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-1">Tableau de Bord</h1>
                <p className="text-gray-600">Vue d'ensemble des statistiques de la plateforme</p>
            </div>

            {/* Cartes de statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border border-yellow-200 shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Total Votes</CardTitle>
                        <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                            <Users className="h-5 w-5 text-white" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-900">{Total_votes.toLocaleString()}</div>
                        <p className="text-xs text-gray-500 mt-1">Votes enregistrés</p>
                    </CardContent>
                </Card>

                <Card className="border border-blue-200 shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Montant Total</CardTitle>
                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                            <DollarSign className="h-5 w-5 text-white" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-900">{Total_net.toLocaleString()}</div>
                        <p className="text-xs text-gray-500 mt-1">FCFA collectés</p>
                    </CardContent>
                </Card>

                <Card className="border border-green-200 shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Commission (20%)</CardTitle>
                        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                            <TrendingUp className="h-5 w-5 text-white" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-900">{Total_commission.toLocaleString()}</div>
                        <p className="text-xs text-gray-500 mt-1">FCFA plateforme</p>
                    </CardContent>
                </Card>

                <Card className="border border-purple-200 shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Montant Net</CardTitle>
                        <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                            <Award className="h-5 w-5 text-white" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-900">{Total_organisteur.toLocaleString()}</div>
                        <p className="text-xs text-gray-500 mt-1">FCFA à reverser</p>
                    </CardContent>
                </Card>
            </div>

            {/* Classement des candidats */}
            <Card className="border border-gray-200 shadow-lg">
                <CardHeader className="bg-yellow-500 rounded-t-lg">
                    <CardTitle className="text-white text-lg">Classement des Candidats</CardTitle>
                    <p className="text-yellow-50 text-sm">{stats.length} candidat(s) au total</p>
                </CardHeader>
                <CardContent className="p-0">
                    {sortedStats.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            Aucune donnée disponible
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {sortedStats.map((stat, index) => (
                                <div
                                    key={stat.candidateId}
                                    className={`p-6 hover:bg-yellow-50 transition-colors ${
                                        index < 3 ? 'bg-gray-50' : ''
                                    }`}
                                >
                                    <div className="flex items-center justify-between gap-4">
                                        {/* Rang et nom */}
                                        <div className="flex items-center gap-4 flex-1 min-w-0">
                                            <div className="flex-shrink-0">
                                                {getRankIcon(index)}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h3 className="font-semibold text-gray-900 text-lg truncate">
                                                    {stat.prenom} {stat.nom}
                                                </h3>
                                                <p className="text-sm text-gray-500">ID: {stat.candidateId}</p>
                                            </div>
                                        </div>

                                        {/* Statistiques */}
                                        <div className="flex items-center gap-8 flex-shrink-0">
                                            {/* Votes */}
                                            <div className="text-right">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Users className="w-4 h-4 text-yellow-500" />
                                                    <span className="text-2xl font-bold text-gray-900">
                                                        {stat.nombreVotes.toLocaleString()}
                                                    </span>
                                                </div>
                                                <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-none">
                                                    {getVotePercentage(stat.nombreVotes)}%
                                                </Badge>
                                            </div>

                                            {/* Montant */}
                                            <div className="text-right hidden md:block">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <DollarSign className="w-4 h-4 text-blue-500" />
                                                    <span className="text-xl font-semibold text-gray-900">
                                                        {stat.montantTotal.toLocaleString()}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-500">FCFA</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Barre de progression */}
                                    <div className="mt-4">
                                        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                                            <div
                                                className="bg-yellow-500 h-2.5 rounded-full transition-all duration-500"
                                                style={{width: `${getVotePercentage(stat.nombreVotes)}%`}}
                                            />
                                        </div>
                                    </div>

                                    {/* Détails supplémentaires (mobile) */}
                                    <div className="mt-3 flex items-center gap-4 md:hidden text-sm">
                                        <div className="flex items-center gap-1.5 text-gray-600">
                                            <DollarSign className="w-3.5 h-3.5" />
                                            <span className="font-medium">{stat.montantTotal.toLocaleString()} FCFA</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-gray-600">
                                            <TrendingUp className="w-3.5 h-3.5" />
                                            <span>Part org: {stat.partOrganisateur.toLocaleString()} FCFA</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Répartition des montants */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {sortedStats.slice(0, 3).map((stat, index) => (
                    <Card key={stat.candidateId} className="border border-gray-200 shadow-md">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base font-semibold text-gray-900 truncate">
                                    {stat.prenom} {stat.nom}
                                </CardTitle>
                                {getRankIcon(index)}
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                <span className="text-sm text-gray-600">Montant total</span>
                                <span className="font-semibold text-gray-900">{stat.montantTotal.toLocaleString()} FCFA</span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                <span className="text-sm text-gray-600">Commission site</span>
                                <span className="font-semibold text-green-600">{stat.partSite.toLocaleString()} FCFA</span>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="text-sm text-gray-600">Part organisateur</span>
                                <span className="font-semibold text-purple-600">{stat.partOrganisateur.toLocaleString()} FCFA</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    )
}

export default Page