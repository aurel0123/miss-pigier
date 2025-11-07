"use client";

import { Evenement } from "@/types";
import {
    EllipsisVertical,
    Eye,
    Pencil,
    Globe,
    ReceiptText,
    Trash,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ConfirmationDialog from "./confirmation-dialog";
import EventDetailsDialog from "./event-details-dialog";
import config from "@/lib/config";
import { toast } from "sonner";

const CardEvenement = ({
                           id,
                           titre,
                           description,
                           image,
                           prixUnitaireVote,
                           dateDebut,
                           dateFin,
                           status,
                           publish,
                           createdAt,
                       }: Evenement) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const response = await fetch(
                `${config.env.apiEndpoint}api/Evenement/delete/${id}`,
                {
                    method: "DELETE",
                }
            );

            if (response.ok) {
                toast.success("Succès", {
                    description: "Événement supprimé avec succès",
                });
                window.location.reload();
            } else {
                const errorData = await response.json();
                toast.error("Erreur", {
                    description:
                        errorData.error || "Erreur lors de la suppression de l'événement",
                });
            }
        } catch (error) {
            console.error("Erreur:", error);
            toast.error("Erreur", {
                description: "Erreur lors de la suppression",
            });
        } finally {
            setIsDeleting(false);
        }
    };

    const handlePublish = async (eventId: string) => {
        setIsPublishing(true);
        try {
            const response = await fetch(
                `${config.env.apiEndpoint}api/Evenement/publish/${eventId}`,
                { method: "PUT" }
            );

            const data = await response.json();

            if (response.ok && data.success) {
                toast.success("Événement publié", {
                    description: `"${titre}" est maintenant publié.`,
                });
                window.location.reload();
            } else {
                toast.error("Erreur", {
                    description: data.error || "Impossible de publier l'événement",
                });
            }
        } catch (error) {
            console.error("Erreur lors de la publication:", error);
            toast.error("Erreur", {
                description: "Erreur serveur lors de la publication",
            });
        } finally {
            setIsPublishing(false);
        }
    };

    const eventData: Evenement = {
        id,
        titre,
        description,
        image,
        prixUnitaireVote,
        dateDebut,
        dateFin,
        status,
        publish,
        createdAt,
    };

    return (
        <div className="w-full shadow-2xs border border-amber-200 bg-neutral-50 p-2 rounded-md">
            <div className="relative w-full">
                <div className="w-full aspect-video bg-neutral-100 rounded-md overflow-hidden">
                    <Image
                        src={image}
                        alt={titre}
                        fill
                        className="object-contain"
                    />
                </div>
                <div className="absolute top-2 right-2 ">
                    <Badge className="h-6 w-20 ">{status}</Badge>
                </div>
            </div>

            <div className="flex flex-col gap-2 items-center justify-center space-y-2 py-2">
                <h1 className="text-2xl font-bold">{titre}</h1>
                <div className="flex gap-2">
                    {
                        publish ? (
                            <Button
                                className="flex flex-1"
                                variant={'ghost'}
                            >
                               Evènement en cours
                            </Button>
                        ) : (
                            <Button
                                className="flex flex-1"
                                onClick={() => handlePublish(id)}
                                disabled={isPublishing}
                            >
                                <Globe className="mr-2" />
                                {isPublishing ? "Publication..." : "Publier l'événement"}
                            </Button>
                        )
                    }


                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button className="bg-gray-200 hover:bg-transparent">
                                <EllipsisVertical />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56 bg-neutral-100 text-gray-900 text-sm border-transparent">
                            <DropdownMenuLabel className="text-md font-semibold">
                                Informations
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <Link
                                href={`/admin/evenement/${id}`}
                                className="flex items-center gap-2 hover:bg-neutral-200 p-2 rounded-md"
                            >
                                <Eye size={20} />
                                Afficher
                            </Link>
                            <Link
                                href={`/admin/evenements/${id}/updateEvenment`}
                                className="flex items-center gap-2 hover:bg-neutral-200 p-2 rounded-md"
                            >
                                <Pencil size={20} />
                                Modifier
                            </Link>
                            <EventDetailsDialog
                                event={eventData}
                                trigger={
                                    <button className="flex items-center gap-2 hover:bg-neutral-200 p-2 rounded-md w-full">
                                        <ReceiptText size={20} />
                                        Détails
                                    </button>
                                }
                            />
                            <ConfirmationDialog
                                trigger={
                                    <button className="flex items-center gap-2 text-white bg-red-600 hover:bg-red-700 p-2 rounded-md mt-1 w-full">
                                        <Trash size={20} />
                                        Supprimer
                                    </button>
                                }
                                title="Êtes-vous sûr ?"
                                description={`Cette action supprimera définitivement l'événement "${titre}".`}
                                confirmText="Supprimer"
                                cancelText="Annuler"
                                onConfirm={handleDelete}
                                isLoading={isDeleting}
                                loadingText="Suppression..."
                                variant="destructive"
                            />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    );
};

export default CardEvenement;
