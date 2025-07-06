import {z} from 'zod'
export const loginSchema = z.object({
    username : z
        .string()
        .min(5 , "Le nom d'utilisateur ne doit contenir au moins 5 caractères")
        .max(50 , "Le nom d'utilisateur ne doit pas dépasser 50 caractères"), 
    password : z
        .string()
        .min(8, "Le mot de passe doit contenir au moins 8 caractères")
        .max(100, "Le mot de passe ne doit pas dépasser 100 caractères")
        .regex(
            /[A-Z]/,
            "Le mot de passe doit contenir au moins une majuscule"
        )
        .regex(
            /[a-z]/,
            "Le mot de passe doit contenir au moins une minuscule"
        )
        .regex(
            /[0-9]/,
            "Le mot de passe doit contenir au moins un chiffre"
        ) , 
    remember : z.boolean().optional()
})