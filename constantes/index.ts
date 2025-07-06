import { ArrowLeft , Share2 } from "lucide-react"
export const navigationLink = [
    {
        href : "/", 
        label : "Accueil"
    }, 
    {
        href : "/candidates", 
        label : "Candidates"
    },
    {
        href : "/classement", 
        label : "Classement"
    },
]
export const navigationLink2 = [
    {
        href : "/candidates", 
        label : "Retour" , 
        icon:  ArrowLeft
    }, 
    {
        href : "/partager", 
        label : "Partager" , 
        icon:  Share2
    },
]
export const  Description = [
    {
        etape : 1, 
        titre : "Decouvrez" ,
        description : "Parcourez les profils des candidates et découvrez leurs histoires"
    } , 
    {
        etape : 2, 
        titre : "Votez" ,
        description : "Choisissez votre candidate favorite et achetez vos votes"
    } , 
    {
        etape : 3, 
        titre : "Suivez" , 
        description : "Consultez le classement en temps réel et partagez"
    } , 
]

export const Candidates = [
    {
        id: 1,
        fullName: "GERRINE SAHENOU",
        program: "Communication Digitale et web Marketing",
        description: "Étudiante en 1er année de Communication Digitale et Web Marketing",
        votes: 189,
        image: "/candidates/Candidate-1.jpg" , 
        evenementId : 1
    },
    {
        id: 2,
        fullName: "TOKOUETE BEYONCÉ",
        program: "Entrepreneuriat et Gestion de Projet",
        description: "Étudiante en 1er année en Entrepreneuriat et Gestion de Projet",
        votes: 200,
        image: "/candidates/Candidate-2.jpg" , 
        evenementId : 1
    },
    {
        id: 3,
        fullName: "DJOSSOU MERVEILLE",
        program: "Commerce International et Business",
        description: "Étudiante en 2ème année de Commerce International et Business",
        votes: 200,
        image: "/candidates/Candidate-3.jpg" , 
        evenementId : 1
    },
    {
        id: 4,
        fullName: "HADENOU MARIE-CECILE",
        program: "Réseau informatique Mobilité et Sécurité",
        description: "Étudiante en 1er année de Réseau informatique Mobilité et Sécurité",
        votes: 200,
        image: "/candidates/Candidate-4.jpg" , 
        evenementId : 1
    },
    {
        id: 5,
        fullName: "MOUSSE RIDILAH",
        program: "Réseau informatique Mobilité et Sécurité",
        description: "Étudiante en 1er année de Réseau informatique Mobilité et Sécurité",
        votes: 200,
        image: "/candidates/Candidate-5.jpg" , 
        evenementId : 1
    },
    {
        id: 6,
        fullName: "BESSAN MARIE-KENSA",
        program: "Droit des affaires et Carrières Judiciaires",
        description: "Étudiante en 1er année de Droit des affaires et Carrières Judiciaires",
        votes: 200,
        image: "/candidates/Candidate-6.jpg" , 
        evenementId : 1
    },
    {
        id: 7,
        fullName: "SEGOUN DAVIDIA",
        program: "Entrepreneuriat et Gestion de Projet",
        description: "Étudiante en 1er année de Entrepreneuriat et Gestion de Projet",
        votes: 200,
        image: "/candidates/Candidate-7.jpg" , 
        evenementId : 1
    },
    {
        id: 8,
        fullName: "DARENE MAYISSA",
        program: "Réseau informatique Mobilité et Sécurité",
        description: "Étudiante en 1er année de Réseau informatique Mobilité et Sécurité",
        votes: 200,
        image: "/candidates/Candidate-6.jpg" , 
        evenementId : 1
    },
]