"use client"
import {Table, TableHeader, TableRow, TableHead, TableBody, TableCell} from '@/components/ui/table'
import React, {useEffect, useState} from "react";
import {Ring2} from "ldrs/react";
import 'ldrs/react/Ring2.css'
import {Card, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import config from '@/lib/config'
import {Badge} from "@/components/ui/badge"
import {
    ChevronLeft,
    ChevronRight,
    Download,
    Search,
    Calendar,
    Filter,
    TrendingUp,
    DollarSign,
    Vote,
    CheckCircle2,
    Clock,
    XCircle,
    Phone
} from "lucide-react";

export default function Page() {
    const [loading, setLoading] = useState(true);
    const [payments, setPayements] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const itemsPerPage = 8;

    const getPayements = async () => {
        try {
            const response = await fetch(`${config.env.apiEndpoint}/api/paiement/get`)
            if(!response.ok) {
                throw new Error("Error fetching paiement");
            }else {
                const data = await response.json()
                setPayements(Array.isArray(data) ? data : [])
            }
        }catch (e) {
            console.error(e)
        }finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getPayements()
    }, []);

    // Filtrage des paiements
    const filteredPayments = payments.filter(payment =>
        payment.numeroTel?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.status?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calcul de la pagination
    const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentPayments = filteredPayments.slice(startIndex, endIndex);

    // Calcul des statistiques
    const totalAmount = payments.reduce((sum, p) => sum + (p.montant || 0), 0);
    const validatedPayments = payments.filter(p => p.status === 'validated').length;
    const totalVotes = payments.reduce(
        (sum, p) => sum + Number(p.metadata?.nombreVote || 0),
        0
    );

    const goToPage = (page) => {
        setCurrentPage(page);
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Fonction pour obtenir le badge de statut
    const getStatusBadge = (status) => {
        if (status === 'validated') {
            return (
                <Badge className="bg-green-600 hover:bg-green-700 text-white border-none px-3 py-1.5 flex items-center gap-1.5 w-fit">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Validé
                </Badge>
            );
        } else if (status === 'cancelled') {
            return (
                <Badge className="bg-red-600 hover:bg-red-700 text-white border-none px-3 py-1.5 flex items-center gap-1.5 w-fit">
                    <XCircle className="w-3.5 h-3.5" />
                    Annulé
                </Badge>
            );
        } else {
            return (
                <Badge className="bg-orange-500 hover:bg-orange-600 text-white border-none px-3 py-1.5 flex items-center gap-1.5 w-fit">
                    <Clock className="w-3.5 h-3.5" />
                    En attente
                </Badge>
            );
        }
    };

    if (loading) {
        return (
            <div className="mt-10 flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <Ring2
                        size="40"
                        stroke="5"
                        strokeLength="0.25"
                        bgOpacity="0.1"
                        speed="0.8"
                        color="#eab308"
                    />
                    <p className="text-gray-600 font-medium">Chargement des paiements...</p>
                </div>
            </div>
        )
    }

    if (payments.length === 0) {
        return (
            <div className="mt-10 flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <Calendar className="w-10 h-10 text-yellow-600" />
                    </div>
                    <p className="text-gray-900 font-bold text-xl mb-2">
                        Aucun paiement effectué
                    </p>
                    <p className="text-gray-500 text-sm max-w-md">
                        Les transactions apparaîtront ici une fois effectuées sur la plateforme
                    </p>
                </div>
            </div>
        )
    }

    return(
        <div className='mt-10 space-y-6 px-4 md:px-0'>
            {/* En-tête */}
            <div className='flex flex-col md:flex-row md:justify-between md:items-center gap-4 pb-6 border-b-2 border-yellow-500'>
                <div>
                    <h1 className='text-4xl font-bold text-gray-900 mb-2'>
                        Gestion des Transactions
                    </h1>
                    <p className='text-base text-gray-600 flex items-center gap-2'>
                        <TrendingUp className="w-4 h-4 text-yellow-500" />
                        Suivez et analysez toutes les transactions en temps réel
                    </p>
                </div>
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg hover:shadow-xl transition-all gap-2 px-6">
                    <Download className="w-5 h-5" />
                    Exporter les données
                </Button>
            </div>

            {/* Cartes de statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border border-yellow-200 shadow-lg hover:shadow-xl transition-shadow bg-white">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-14 h-14 bg-yellow-500 rounded-xl flex items-center justify-center shadow-md">
                                <DollarSign className="w-7 h-7 text-white" />
                            </div>
                            <Badge className="bg-yellow-100 text-yellow-700 border-none">Total</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-1 font-medium">Montant Total</p>
                        <p className="text-3xl font-bold text-gray-900">
                            {totalAmount.toLocaleString()}
                            <span className="text-lg text-gray-600 ml-2">CFA</span>
                        </p>
                        <div className="mt-3 pt-3 border-t border-gray-200">
                            <p className="text-xs text-gray-500">Toutes transactions confondues</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border border-blue-200 shadow-lg hover:shadow-xl transition-shadow bg-white">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-14 h-14 bg-blue-500 rounded-xl flex items-center justify-center shadow-md">
                                <Vote className="w-7 h-7 text-white" />
                            </div>
                            <Badge className="bg-blue-100 text-blue-700 border-none">Votes</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-1 font-medium">Total des Votes</p>
                        <p className="text-3xl font-bold text-gray-900">{totalVotes.toLocaleString()}</p>
                        <div className="mt-3 pt-3 border-t border-gray-200">
                            <p className="text-xs text-gray-500">Nombre de votes enregistrés</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border border-green-200 shadow-lg hover:shadow-xl transition-shadow bg-white">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-14 h-14 bg-green-500 rounded-xl flex items-center justify-center shadow-md">
                                <CheckCircle2 className="w-7 h-7 text-white" />
                            </div>
                            <Badge className="bg-green-100 text-green-700 border-none">Validés</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-1 font-medium">Paiements Validés</p>
                        <p className="text-3xl font-bold text-gray-900">
                            {validatedPayments}
                            <span className="text-lg text-gray-600 ml-2">/ {payments.length}</span>
                        </p>
                        <div className="mt-3 pt-3 border-t border-gray-200">
                            <p className="text-xs text-gray-500">
                                Taux: {payments.length > 0 ? ((validatedPayments / payments.length) * 100).toFixed(0) : 0}%
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Barre de recherche */}
            <Card className="border border-gray-200 shadow-md">
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input
                                placeholder="Rechercher par numéro de téléphone ou statut..."
                                className="pl-12 pr-4 py-6 border-gray-300 rounded-xl focus:border-yellow-500 focus:ring-yellow-500 text-base"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>
                        <Button variant="outline" className="gap-2 border-gray-300 hover:bg-gray-50 px-6 py-6 rounded-xl">
                            <Filter className="w-5 h-5" />
                            Filtres
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Tableau */}
            <Card className="border border-gray-200 shadow-lg overflow-hidden">
                <div className="bg-yellow-500 px-6 py-4">
                    <h2 className="text-white font-bold text-lg">Liste des Transactions</h2>
                    <p className="text-yellow-50 text-sm">{filteredPayments.length} transaction(s) au total</p>
                </div>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50 border-b-2 border-yellow-400 hover:bg-gray-50">
                                    <TableHead className="text-gray-700 font-bold text-sm py-4">Numéro Téléphone</TableHead>
                                    <TableHead className="text-gray-700 font-bold text-sm">Montant</TableHead>
                                    <TableHead className="text-gray-700 font-bold text-sm text-center">Votes</TableHead>
                                    <TableHead className="text-gray-700 font-bold text-sm">Date & Heure</TableHead>
                                    <TableHead className="text-gray-700 font-bold text-sm">Statut</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {
                                    currentPayments.map((payment, index) => (
                                        <TableRow
                                            key={payment.id}
                                            className={`border-gray-100 hover:bg-yellow-50 transition-all cursor-pointer ${
                                                index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                            }`}
                                        >
                                            <TableCell className="py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                                        <Phone className="w-5 h-5 text-gray-600" />
                                                    </div>
                                                    <span className="text-gray-900 font-semibold">{payment.numeroTel}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="text-yellow-600 font-bold text-lg">{payment.montant?.toLocaleString()}</span>
                                                    <span className="text-gray-500 text-xs">CFA</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-500 text-white rounded-xl font-bold text-lg shadow-md">
                                                    {payment.metadata?.nombreVote == null ? "0": payment.metadata?.nombreVote }
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="text-gray-900 font-medium">
                                                        {new Date(payment.createdAt).toLocaleDateString('fr-FR', {
                                                            day: '2-digit',
                                                            month: 'short',
                                                            year: 'numeric'
                                                        })}
                                                    </span>
                                                    <span className="text-gray-500 text-xs">
                                                        {new Date(payment.createdAt).toLocaleTimeString('fr-FR', {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {getStatusBadge(payment.status)}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex flex-col md:flex-row items-center justify-between px-6 py-5 border-t-2 border-gray-100 bg-gray-50 gap-4">
                            <div className="text-sm text-gray-600">
                                Affichage de <span className="font-bold text-gray-900">{startIndex + 1}</span> à{' '}
                                <span className="font-bold text-gray-900">{Math.min(endIndex, filteredPayments.length)}</span> sur{' '}
                                <span className="font-bold text-gray-900">{filteredPayments.length}</span> paiements
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={goToPreviousPage}
                                    disabled={currentPage === 1}
                                    className="border-gray-300 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed px-4 py-2"
                                >
                                    <ChevronLeft className="h-4 w-4 mr-1" />
                                    Précédent
                                </Button>

                                <div className="flex gap-1">
                                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                        let page;
                                        if (totalPages <= 5) {
                                            page = i + 1;
                                        } else if (currentPage <= 3) {
                                            page = i + 1;
                                        } else if (currentPage >= totalPages - 2) {
                                            page = totalPages - 4 + i;
                                        } else {
                                            page = currentPage - 2 + i;
                                        }
                                        return (
                                            <Button
                                                key={page}
                                                variant={currentPage === page ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => goToPage(page)}
                                                className={`min-w-10 ${
                                                    currentPage === page
                                                        ? "bg-yellow-500 hover:bg-yellow-600 text-white shadow-md"
                                                        : "border-gray-300 hover:bg-gray-100 text-gray-700"
                                                }`}
                                            >
                                                {page}
                                            </Button>
                                        );
                                    })}
                                </div>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={goToNextPage}
                                    disabled={currentPage === totalPages}
                                    className="border-gray-300 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed px-4 py-2"
                                >
                                    Suivant
                                    <ChevronRight className="h-4 w-4 ml-1" />
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}