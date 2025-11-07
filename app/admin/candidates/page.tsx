"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Ring2 } from 'ldrs/react'
import 'ldrs/react/Ring2.css'
import config from "@/lib/config";
import { Candidate } from "@/types";
import Candidates from "@/components/admin/tableCandidates";
import Link from "next/link";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty"


export default function Page() {
    const [loading, setLoading] = useState(true)
    const [candidates , setCandidates] = useState<Candidate[]>([])
    const [idEvenement, setIdEvenement] = useState<string>('')
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const getCandidates = async () => {
        try{
            setLoading(true)
            const response =  await fetch(`${config.env.apiEndpoint}/api/candidates/getCandidates`)
            if(!response.ok){
                throw ('impossible de récupérer les candidates')
            }else{
                const data = await response.json()
                setCandidates(Array.isArray(data) ? data : [])
            }
        }catch(error){
            console.log(error)
        }finally {
            setLoading(false)
        }
    }
    const getEvenementId = async () => {
        try {
            const response = await fetch(`${config.env.apiEndpoint}/api/Evenement/current/`);
            const data = await response.json()
            if(data.success){
               setIdEvenement(data.evenement.id)
            }
        }catch(error){
            console.log(error)
        }
    }
    useEffect(()=> {
        getCandidates()
        getEvenementId()
    }, [])

    const handleCandidatesUpdate = () => {
        getCandidates();
    };

    const filteredCandidates = candidates.filter((c) =>
        `${c.nom} ${c.prenom} ${c.filiere}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );


    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentCandidates = filteredCandidates.slice(startIndex, endIndex);

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
                    <p className="text-gray-600">Chargement des candidates...</p>
                </div>
            </div>
        )
    }
    return (
        <div className="">
            <div>
                <h1 className={'text-2xl font-bold mb-2'}>
                    Gérer la liste des candidates
                </h1>
            </div>
            <div className="flex flex-1 flex-row items-center space-x-2">
                <div className="flex items-center border border-dark-400 rounded-md px-2 w-full">
                    <Search size={18} className="text-primary-foreground" />
                    <Input
                        type="search"
                        placeholder="Rechercher..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="text-primary-foreground border-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none shadow-none placeholder:text-primary-foreground"
                    />
                </div>
                <Button>rechercher une candidate</Button>
            </div>
            <div className="mt-10">
                {
                    candidates.length === 0 ? (
                    <div className={'flex items-center justify-center w-full h-full'}>
                        <Empty>
                            <EmptyHeader>
                                <EmptyMedia className="bg-neutral-300 p-2 rounded">
                                    <Users size={45} className=" text-neutral-900" />
                                </EmptyMedia>
                                <EmptyTitle>Aucun candidat enregistré</EmptyTitle>
                                <EmptyDescription>
                                    Vous n’avez pas encore ajouté de candidat.
                                    Cliquez sur “Ajouter un candidat” pour commencer à créer la première fiche.
                                </EmptyDescription>
                            </EmptyHeader>
                            <EmptyContent>
                                <div className="flex gap-2 w-full">
                                    <Button  asChild>
                                        <Link href={`/admin/evenements/${idEvenement}/candidates`}>
                                            Ajouter un candidat
                                        </Link>
                                    </Button>
                                    <Button variant="ghost">Retour à la page d&apos;accueil</Button>
                                </div>
                            </EmptyContent>
                        </Empty>
                    </div>
                    ) :
                    (
                        <>
                            <Candidates
                                candidates={currentCandidates}
                                onCandidatesUpdate={handleCandidatesUpdate}
                            />
                            {filteredCandidates.length > itemsPerPage && (
                                <div className="flex justify-center items-center gap-4 mt-6">
                                    <Button
                                        variant="outline"
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage((prev) => prev - 1)}
                                    >
                                        Précédent
                                    </Button>

                                    <span className="text-gray-700">
                                      Page {currentPage} / {Math.ceil(filteredCandidates.length / itemsPerPage)}
                                    </span>

                                    <Button
                                        variant="outline"
                                        disabled={currentPage === Math.ceil(filteredCandidates.length / itemsPerPage)}
                                        onClick={() => setCurrentPage((prev) => prev + 1)}
                                    >
                                        Suivant
                                    </Button>
                                </div>
                            )}

                        </>
                    )
                }
            </div>
            {
                candidates.length > 0 && (
                    <div className="relative">
                        <Link href={`/admin/candidates/${idEvenement}`}>
                            <div className="fixed bottom-4 right-4">
                                <div className="bg-yellow-400 p-2 z-[100] rounded shadow-lg flex items-center gap-2 text-neutral-950 text-sm">
                                    <Plus size={16} />
                                    <span>Ajouter un candidat</span>
                                </div>
                            </div>
                        </Link>
                    </div>
                )
            }
        </div>
    );
}
