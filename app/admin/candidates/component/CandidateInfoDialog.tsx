import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Candidate } from "@/types";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

interface CandidateInfoDialogProps {
    candidate: Candidate;
}

const CandidateInfoDialog = ({ candidate }: CandidateInfoDialogProps) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    size="sm"
                    variant="outline"
                    className="bg-white border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-black"
                >
                    <Eye className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-neutral-950">
                        Informations du candidat
                    </DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    {/* Section Image */}
                    <div className="flex flex-col items-center justify-start">
                        <div className="relative w-full max-w-sm aspect-square">
                            <Image
                                src={candidate.image}
                                alt={`${candidate.nom} ${candidate.prenom}`}
                                fill
                                className="rounded-lg object-cover border-4 border-yellow-500 shadow-lg"
                            />
                        </div>
                    </div>

                    {/* Section Informations */}
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <div className="border-b border-gray-200 pb-3">
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                                    Nom complet
                                </h3>
                                <p className="mt-1 text-lg font-medium text-neutral-950">
                                    {candidate.nom} {candidate.prenom}
                                </p>
                            </div>

                            <div className="border-b border-gray-200 pb-3">
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                                    Filière
                                </h3>
                                <p className="mt-1 text-lg text-gray-800">
                                    {candidate.filiere}
                                </p>
                            </div>

                            <div className="border-b border-gray-200 pb-3">
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                                    Nombre de votes
                                </h3>
                                <p className="mt-1 text-lg font-semibold text-yellow-600">
                                    {candidate.nombreVotes}
                                </p>
                            </div>

                            {candidate.description && (
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                                        Description
                                    </h3>
                                    <p className="mt-2 text-gray-700 leading-relaxed">
                                        {candidate.description}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CandidateInfoDialog;