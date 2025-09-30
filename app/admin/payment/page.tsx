"use client"

import {Table, TableHeader, TableRow, TableHead, TableBody, TableCell} from '@/components/ui/table'
import React, {useEffect, useState} from "react";
import {Ring2} from "ldrs/react";
import 'ldrs/react/Ring2.css'
import {Card, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import config from '@/lib/config'
import {Badge} from "@/components/ui/badge"
import {ChevronLeft, ChevronRight} from "lucide-react";

export default function Page() {
    const [loading, setLoading] = useState(true);
    const [payments, setPayements] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
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

    // Calcul de la pagination
    const totalPages = Math.ceil(payments.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentPayments = payments.slice(startIndex, endIndex);

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
                        color="black"
                    />
                    <p className="text-gray-600">Chargement des paiements...</p>
                </div>
            </div>
        )
    }

    if (payments.length === 0) {
        return (
            <div className="mt-10 flex items-center justify-center min-h-[400px]">
                <p className="text-gray-600">
                    Aucun paiement effectué
                </p>
            </div>
        )
    }

    return(
        <div className='mt-10'>
            <div>
                <Card className="bg-white border-yellow-500 shadow-sm">
                    <CardContent className="p-1">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-yellow-500 hover:bg-gray-100">
                                    <TableHead className="text-neutral-600 font-bold">Numéro Téléphone</TableHead>
                                    <TableHead className="text-neutral-600 font-bold">Montants(CFA)</TableHead>
                                    <TableHead className="text-neutral-600 font-bold">Nombre(s) de vote(s)</TableHead>
                                    <TableHead className="text-neutral-600 font-bold">Date</TableHead>
                                    <TableHead className="text-neutral-600 font-bold">Statut</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {
                                    currentPayments.map((payment) => (
                                        <TableRow key={payment.id} className="border-yellow-500/20 hover:bg-gray-100">
                                            <TableCell className="text-gray-900 font-bold">
                                                {payment.numeroTel}
                                            </TableCell>
                                            <TableCell className="text-gray-800">
                                                {payment.montant} CFA
                                            </TableCell>
                                            <TableCell className="text-gray-800">
                                                {payment.metadata.nombreVote}
                                            </TableCell>
                                            <TableCell className="text-gray-800">
                                                {new Date(payment.createdAt).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={payment.status === 'validated' ? 'bg-green-500' : 'bg-orange-500'}>
                                                    {payment.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between px-4 py-4 border-t border-yellow-500/20">
                                <div className="text-sm text-gray-600">
                                    Affichage de {startIndex + 1} à {Math.min(endIndex, payments.length)} sur {payments.length} paiements
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={goToPreviousPage}
                                        disabled={currentPage === 1}
                                        className="border-yellow-500"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                        Précédent
                                    </Button>

                                    <div className="flex gap-1">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                            <Button
                                                key={page}
                                                variant={currentPage === page ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => goToPage(page)}
                                                className={
                                                    currentPage === page
                                                        ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                                                        : "border-yellow-500"
                                                }
                                            >
                                                {page}
                                            </Button>
                                        ))}
                                    </div>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={goToNextPage}
                                        disabled={currentPage === totalPages}
                                        className="border-yellow-500"
                                    >
                                        Suivant
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}