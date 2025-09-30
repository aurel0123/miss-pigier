"use client"
import React from 'react'
import {Card , CardHeader , CardContent , CardTitle} from '@/components/ui/card'
import { Users , DollarSign , TrendingUp , Award } from 'lucide-react'
import  config from '@/lib/config'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
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
    const [stats , setStats ] = React.useState<StatItem[]>([])
    const getStats = async () => {
        const response = await  fetch(`${config.env.apiEndpoint}/api/admin/stats/`)
        if (!response.ok) {
            throw new Error('Not Found')
        }else {
            const data = await response.json()
            setStats(Array.isArray(data) ? data : [])
        }
    }

    React.useEffect(()=> {
        getStats()
    } , [])

    const Total_votes = stats.reduce((sum , stat) => sum + stat.nombreVotes, 0)
    const Total_commission = stats.reduce((sum, stat) => sum + stat.partSite, 0)
    const Total_organisteur = stats.reduce((sum , stat) => sum + stat.partOrganisateur , 0)
    const Total_net = Total_organisteur + Total_commission



    return (
        <section className="mt-8">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 <Card className="bg-white border-yellow-500 ">
                     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                         <CardTitle className="text-sm font-medium text-yellow-400">Total Votes</CardTitle>
                         <Users className="h-4 w-4 text-yellow-500" />
                     </CardHeader>
                     <CardContent>
                         <div className="text-2xl font-bold text-neutral-900">{Total_votes}</div>
                         <p className="text-xs text-gray-600">+12% ce mois</p>
                     </CardContent>
                 </Card>
                 <Card className="bg-white border-yellow-500">
                     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                         <CardTitle className="text-sm font-medium text-yellow-400">Montant Total</CardTitle>
                         <DollarSign className="h-4 w-4 text-yellow-500" />
                     </CardHeader>
                     <CardContent>
                         <div className="text-2xl font-bold text-neutral-900">{Total_net.toLocaleString()} FCFA</div>
                         <p className="text-xs text-gray-600">+8% ce mois</p>
                     </CardContent>
                 </Card>

                 <Card className="bg-white border-yellow-500">
                     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                         <CardTitle className="text-sm font-medium text-yellow-400">Commission (5%)</CardTitle>
                         <TrendingUp className="h-4 w-4 text-yellow-500" />
                     </CardHeader>
                     <CardContent>
                         <div className="text-2xl font-bold text-neutral-900">{Total_commission.toLocaleString()} FCFA</div>
                         <p className="text-xs text-gray-600">Plateforme</p>
                     </CardContent>
                 </Card>

                 <Card className="bg-white border-yellow-500">
                     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                         <CardTitle className="text-sm font-medium text-yellow-400">Montant Net</CardTitle>
                         <Award className="h-4 w-4 text-yellow-500" />
                     </CardHeader>
                     <CardContent>
                         <div className="text-2xl font-bold text-neutral-900">{Total_organisteur.toLocaleString()} FCFA</div>
                         <p className="text-xs text-gray-600">À reverser</p>
                     </CardContent>
                 </Card>
             </div>

            <div className="grid grid-cols-1 mt-4">
                <Card className="bg-white border-yellow-500">
                    <CardHeader>
                        <CardTitle className="text-yellow-400">Votes par Candidate</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={stats}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <YAxis tick={{ fill: '#9CA3AF' }} />
                                <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #FCD34D' }} />
                                <XAxis dataKey={(item) => `${item.nom}`} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                                <Bar dataKey="nombreVotes" fill="#FCD34D" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>


            </div>
        </section>
    )
}

export default Page