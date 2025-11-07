"use client"
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Candidate } from "@/types";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import { Trash2, Share2 } from "lucide-react";
import { Button } from "../ui/button";
import ConfirmationDialog from "./confirmation-dialog";
import { toast } from "sonner";
import config from "@/lib/config";
import CandidateInfoDialog from "./CandidateInfoDialog";
import EditCandidateDialog from "./EditCandidateDialog";

interface Props {
    candidates: Candidate[];
    onCandidatesUpdate?: () => void;
}

const Candidates = ({ candidates, onCandidatesUpdate }: Props) => {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async (id: string) => {
        setIsDeleting(true);
        try {
            const response = await fetch(
                `${config.env.apiEndpoint}/api/candidates/deleteCanditates/${id}`,
                {
                    method: "DELETE",
                }
            );

            if (response.ok) {
                toast.success("Succès", {
                    description: "Candidat supprimé avec succès",
                });
                setIsDeleting(false)
                // Call the callback to refresh the parent component
                if (onCandidatesUpdate) {
                    onCandidatesUpdate();
                }
            } else {
                const errorData = await response.json();
                toast.error("Erreur", {
                    description: `Erreur lors de la suppression: ${
                        errorData.error || "Erreur inconnue"
                    }`,
                });
            }
        } catch (error) {
            console.error("Erreur:", error);
            toast.error("Erreur", {
                description: "Erreur lors de la suppression",
            });
        }
    };

    return (
        <div>
            <Card className="bg-white border-yellow-500 shadow-sm">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-yellow-500 hover:bg-gray-100">
                                <TableHead className="text-neutral-600 font-bold">PHOTO</TableHead>
                                <TableHead className="text-neutral-600 font-bold">NOM COMPLET</TableHead>
                                <TableHead className="text-neutral-600 font-bold">FILIERE</TableHead>
                                <TableHead className="text-neutral-600 font-bold">VOTES</TableHead>
                                <TableHead className="text-neutral-600 font-bold">ACTIONS</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {candidates.map((candidate) => (
                                <TableRow
                                    key={candidate.id}
                                    className="border-yellow-500/20 hover:bg-gray-100"
                                >
                                    <TableCell>
                                        <Image
                                            src={candidate.image}
                                            alt={candidate.nom}
                                            width={60}
                                            height={60}
                                            className="rounded-full object-cover border-2 border-yellow-500"
                                        />
                                    </TableCell>
                                    <TableCell className="text-neutral-950 font-medium">
                                        {candidate.nom} {candidate.prenom}
                                    </TableCell>
                                    <TableCell className="text-gray-800">
                                        {candidate.filiere}
                                    </TableCell>
                                    <TableCell className="text-gray-700">
                                        {candidate.nombreVotes}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-2">
                                            {/* Bouton Voir les informations */}
                                            <CandidateInfoDialog candidate={candidate} />

                                            {/* Bouton Modifier */}
                                            <EditCandidateDialog
                                                candidate={candidate}
                                                onCandidateUpdate={onCandidatesUpdate}
                                            />

                                            {/* Bouton Partager */}
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="bg-white border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-black"
                                                onClick={() => {
                                                    const voteLink = `${config.env.apiEndpoint}/candidates/${candidate.id}`;
                                                    navigator.clipboard.writeText(voteLink);
                                                    toast.success("Lien copié !", {
                                                        description:
                                                            "Le lien de vote a été copié dans le presse-papier.",
                                                    });
                                                }}
                                            >
                                                <Share2 className="h-4 w-4" />
                                            </Button>

                                            {/* Bouton Supprimer */}
                                            <ConfirmationDialog

                                                trigger={
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="bg-red-500 border-red-500 text-white hover:bg-red-500 hover:text-white"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                }
                                                title="Êtes-vous sûr ?"
                                                description={`Cette action ne peut pas être annulée. Cela supprimera définitivement le candidate "${
                                                    candidate.nom + " " + candidate.prenom
                                                }"`}
                                                confirmText="Supprimer"
                                                cancelText="Annuler"
                                                onConfirm={() => handleDelete(candidate.id)}
                                                isLoading={isDeleting}
                                                loadingText="Suppression..."
                                                variant="destructive"
                                            />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default Candidates;