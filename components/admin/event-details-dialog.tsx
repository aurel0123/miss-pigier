"use client"

import React from 'react'
import { Evenement } from '@/types'
import Image from 'next/image'
import { Calendar, Clock, DollarSign, FileText, X } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from '@/components/ui/badge'
import {format} from 'date-fns'
import { fr } from 'date-fns/locale'

interface EventDetailsDialogProps {
    event: Evenement
    trigger: React.ReactNode
}

const EventDetailsDialog: React.FC<EventDetailsDialogProps> = ({
    event,
    trigger
}) => {
    const formatDate = (date: string | Date) => {
        try {
            const dateObj = typeof date === 'string' ? new Date(date) : date
            return format(dateObj, 'dd MMMM yyyy à HH:mm', { locale: fr })
        } catch {
            return 'Date invalide'
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'EN COURS':
                return 'bg-green-100 text-green-800'
            case 'A VENIR':
                return 'bg-blue-100 text-blue-800'
            case 'TERMINER':
                return 'bg-gray-100 text-gray-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center">
                        Détails de l&apos;événement
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        Informations complètes sur l&apos;événement
                    </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6">
                    {/* Image de l'événement */}
                    <div className="relative">
                        <Image
                            src={event.image}
                            alt={event.titre}
                            width={0}
                            height={0}
                            sizes="100vw"
                            className="w-full h-64 object-cover rounded-lg"
                            style={{ objectFit: 'cover' }}
                        />
                        <Badge className={`absolute top-4 right-4 ${getStatusColor(event.status)}`}>
                            {event.satus}
                        </Badge>
                    </div>

                    {/* Titre et description */}
                    <div className="space-y-4">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                {event.titre}
                            </h2>
                            <p className="text-gray-600 leading-relaxed">
                                {event.description}
                            </p>
                        </div>

                        {/* Informations détaillées */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Dates */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-5 w-5 text-blue-600" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Date de début</p>
                                        <p className="text-gray-900">{formatDate(event.dateDebut)}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-3">
                                    <Clock className="h-5 w-5 text-red-600" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Date de fin</p>
                                        <p className="text-gray-900">{formatDate(event.dateFin)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Prix et statut */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <DollarSign className="h-5 w-5 text-green-600" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Prix unitaire de vote</p>
                                        <p className="text-gray-900">{event.prixUnitaireVote} FCFA</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-3">
                                    <FileText className="h-5 w-5 text-purple-600" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Statut</p>
                                        <Badge className={getStatusColor(event.status)}>
                                            {event.status}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Informations supplémentaires */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold mb-3 text-gray-900">
                                Informations supplémentaires
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-500">ID de l&apos;événement</p>
                                    <p className="font-mono text-gray-900">{event.id}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Créé le</p>
                                    <p className="text-gray-900">{formatDate(event.createdAt)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default EventDetailsDialog 