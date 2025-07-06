import { LucideIcon } from "lucide-react";
export interface Candidate{
    id: number , 
    fullName : string , 
    program: string;
    description: string;
    votes: number;
    image: string;
    evenementId : number
}


export interface NavigationLink {
    href: string;
    label: string;
    icon?: LucideIcon; // icon devient optionnel ici
}
