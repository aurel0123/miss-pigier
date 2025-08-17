
import { Evenement } from '@/types'
import { EllipsisVertical, Eye, Pencil, Plus, ReceiptText , Trash } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import ConfirmationDialog from './confirmation-dialog'
import EventDetailsDialog from './event-details-dialog'
import config from '@/lib/config'
import { toast } from 'sonner'

const CardEvenement = ({
    id,
    titre , 
    description, 
    image , 
    prixUnitaireVote , 
    dateDebut, 
    dateFin , 
    status, 
    createdAt
} : Evenement) => {

  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`${config.env.apiEndpoint}api/Evenement/delete/${id}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        toast.success("Succès" , {
          description : "Événement supprimé avec succès"
        })
        // Optionnel : recharger la page ou mettre à jour la liste
        window.location.reload()
      } else {
        const errorData = await response.json()
        toast.error("Erreur", {
          description: `Erreur lors de la suppression: ${errorData.error || 'Erreur inconnue'}`
        })
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast.error("Erreur", {
        description: "Erreur lors de la suppression"
      })
    } finally {
      setIsDeleting(false)
    }
  }

  // Créer l'objet événement pour passer au composant
  const eventData: Evenement = {
    id,
    titre,
    description,
    image,
    prixUnitaireVote,
    dateDebut,
    dateFin,
    status,
    createdAt
  }

  return (
    <div className='w-full shadow-2xs border-1 border-amber-200 bg-neutral-50 p-2 rounded-md'>
        <div className='relative w-full'>
            <div className='w-full'>
                <Image
                    src={image}
                    alt={titre}
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="w-full h-auto object-cover rounded-md"
                    style={{ objectFit: 'cover' }}
                />
            </div>
            <div className='absolute top-2 right-2 '>
                <Badge className='h-6 w-20 '>{status}</Badge>
            </div>
        </div>
        <div className='flex flex-col gap-2 items-center justify-center space-y-2 py-2'>
            <h1 className="text-2xl font-bold">{titre}</h1>
            <div className='flex gap-2'>
                <Link href={`/admin/evenements/${id}/candidates`}>
                    <Button className='flex flex-1'>
                        <Plus/>
                        Ajouter un Candidat
                    </Button>
                </Link>
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button className='bg-gray-200 hover:bg-transaparent'>
                        <EllipsisVertical/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-56 bg-neutral-100 text-gray-900 text-sm border-transparent'>
                    <DropdownMenuLabel className='text-md font-semibold'>Informations</DropdownMenuLabel>
                    <DropdownMenuSeparator className='sapce-y-4'/>
                    <Link href={`/admin/evenement/${id}`} className='flex items-center gap-2 hover:bg-neutral-200 p-2 rounded-md'>
                        <Eye size={20}/>
                        Afficher l&apos;événement
                    </Link>
                    <Link href={`/admin/evenements/${id}/updateEvenment`} className='flex items-center gap-2 hover:bg-neutral-200 p-2 rounded-md'>
                        <Pencil size={20}/>
                        Modifier l&apos;événement
                    </Link>
                    <EventDetailsDialog
                        event={eventData}
                        trigger={
                            <button className='flex items-center gap-2 hover:bg-neutral-200 p-2 rounded-md w-full'>
                                <ReceiptText size={20}/>
                                Details l&apos;événement
                            </button>
                        }
                    />
                    <ConfirmationDialog
                        trigger={
                            <button className='flex items-center gap-2 text-white bg-red-600 hover:bg-red-700 p-2 rounded-md mt-1 w-full'>
                                <Trash size={20}/>
                                Supprimer l&apos;événement
                            </button>
                        }
                        title="Êtes-vous sûr ?"
                        description={`Cette action ne peut pas être annulée. Cela supprimera définitivement l'événement "${titre}" et toutes ses données associées.`}
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
  )
}

export default CardEvenement