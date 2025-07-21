import {z} from 'zod'
export const loginSchema = z.object({
  email: z
    .string()
    .email("Adresse email invalide")
    .min(5, "L'email doit contenir au moins 5 caractères")
    .max(100, "L'email ne doit pas dépasser 100 caractères"),
    
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .max(100, "Le mot de passe ne doit pas dépasser 100 caractères")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
    .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre"),
    
  remember: z.boolean().optional(),
});

export const EvenementSchema = z.object({
  titre : z
    .string()
    .min(3, "Le titre doit contenir au moins 3 caractères") , 
  description : z
    .string()
    .min(10, "La description doit contenir au moins 10 caractères")
    .max(500, "La description ne doit pas dépasser 500 caractères")
    .optional(),
  image : z
    .string()
    .refine(value => {
        // Accepte soit une URL valide, soit un chemin relatif commençant par /
        return value.startsWith('http') ? /^https?:\/\/.+/i.test(value) : value.startsWith('/');
      }, {
        message: "Doit être une URL valide ou un chemin relatif commençant par /"
      })
    .optional() , 
  prix_unitaire : z
    .number(), 
  date_debut : z
    .date()
    .refine(date => date > new Date(), "La date de début doit être dans le futur"),
  date_fin : z
    .date()
    .refine(date => date > new Date(), "La date de fin doit être dans le futur")
})