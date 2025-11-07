import { LucideIcon } from "lucide-react";
import {z} from 'zod'
import {adminSchema} from "@/lib/validations";

export interface Candidate{
    id: string , 
    nom : string , 
    prenom : string, 
    filiere: string;
    description: string | null;
    image: string;
    nombreVotes : number | null, 
    evenementId : string, 
    createdAt : Date | null , 
}


export interface NavigationLink {
    href: string;
    label: string;
    icon?: LucideIcon; // icon devient optionnel ici
}
export interface DataNavigationLink {
    title: string;
    isActive? : boolean,
    icon?: LucideIcon,
    items?: {
        title: string;
        icon? : LucideIcon;
        url : string ;
    }[]
}
export interface AuthCredentials {
    email : string , 
    password : string
}

export interface Evenement {
    id : string , 
    titre : string , 
    description: string ,
    image : string, 
    prixUnitaireVote : number , 
    dateDebut : Date ,
    dateFin : Date , 
    status : string ,
    publish? : boolean ,
    createdAt : Date | null , 
}

export interface Paiement {
  id: string;
  numeroTel: string;
  montant: number;
  evenementId: string;
  status: 'pending' | 'completed' | 'failed' | 'processing_error' | 'cancelled';
  moyenPaiement: 'mobile_money' | 'card';
  fedapayTransactionId?: string;
  createdAt: Date;
  completedAt?: Date;
  metadata?: {
    candidatId: string;
    nombreVotes: number;
    prix_par_vote: number;
    candidat_nom?: string;
    commission_plateforme?: number;
    montant_organisateur?: number;
    fedapay_response?: any;
    error?: string;
  };
}

export interface Vote {
  id: string;
  numeroTel: string;
  candidatId: string;
  paiementId: string;
  createdAt: Date;
}

export interface PaymentRequest {
  candidatId: string;
  evenementId: string;
  numeroTelephone: string;
  nombreVotes: number;
  montant: number;
  moyenPaiement: 'mobile_money' | 'card';
  metadata?: {
    candidat_nom: string;
    type: string;
    prix_par_vote: number;
  };
}

export interface PaymentResponse {
  success: boolean;
  transaction_id?: string;
  fedapay_transaction_id?: string;
  checkout_url?: string;
  montant?: number;
  message: string;
}

export interface WebhookPayload {
  entity: {
    id: string;
    entity: string;
    status: string;
    amount: number;
    currency: string;
    custom_metadata?: any;
    created_at: string;
    updated_at: string;
  };
  event_type: string;
}

export type User = z.infer<typeof adminSchema>

export interface Retray {
  id: string ;
  montant_retrait : string ; 
  status : string ; 
  telephone : number ; 
  userId: string ;
  date_creation : string ; 
  date_aprobation : string ; 
}