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

const userRoleSchema = z.union([
    z.literal('admin'),
    z.literal('subadmin'),
    z.literal('responsable'),
])

export const adminSchema = z.object({
    username: z
        .string()
        .min(3 , "Votre username doit contenir au moins 3 caractères"),
    email : z
        .string()
        .email("Adresse email invalide"),
    password : z
        .string()
        .min(8, "Le mot de passe doit contenir au moins 8 caractères")
        .max(100, "Le mot de passe ne doit pas dépasser 100 caractères"),
    role : userRoleSchema ,
    is_active : z.boolean().default(true).optional(),
})

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
  date_debut: z.coerce.date(),
  date_fin: z.coerce.date().refine(date => date > new Date(), "La date de fin doit être dans le futur"),
  commissions : z.coerce.number().optional(),
})

export const candidateSchema = z.object({
  nom: z.string()
    .min(1, "Le nom est requis")
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(100, "Le nom ne peut pas dépasser 100 caractères"),
    
  prenom: z.string()
    .min(1, "Le prénom est requis")
    .min(2, "Le prénom doit contenir au moins 2 caractères")
    .max(100, "Le prénom ne peut pas dépasser 100 caractères"),
    
  filiere: z.string()
    .min(1, "La filière est requise")
    .min(2, "La filière doit contenir au moins 2 caractères")
    .max(255, "La filière ne peut pas dépasser 255 caractères"),
    
  description: z.string().optional(),
  
  image: z.string()
    .min(1, "L'image est requise")
    .max(512, "L'URL de l'image ne peut pas dépasser 512 caractères")
    .refine(value => {
      return value.startsWith('http') ? /^https?:\/\/.+/i.test(value) : value.startsWith('/');
    }, {
      message: "Doit être une URL valide ou un chemin relatif commençant par /"
    }),
  nombreVotes : z.number(),
  evenementId: z.string().uuid("L'ID de l'événement doit être un UUID valide"),
  imagePreview: z.string().optional().nullable(),
});

export const voteSchema = z.object({
  numero_tel: z
    .string()
    .min(8, "Le numéro de téléphone doit contenir au moins 8 chiffres")
    .max(15, "Le numéro de téléphone ne doit pas dépasser 15 chiffres")
    .regex(/^[0-9]+$/, "Le numéro de téléphone doit contenir uniquement des chiffres"),

  candidat_id: z
    .string()
    .min(1, "Le candidat est requis"),

  paiement_id: z
    .string()
    .uuid("L'ID du paiement doit être un UUID valide"),

  created_at: z
    .date()
    .default(() => new Date()), // si tu veux qu'il prenne auto la date
});


export const retraySchema = z.object({
  montant_retrait : z.coerce.number(), 
  telephone : z.string(),
  userId : z.string().uuid()
})

export const CreateSubadminSchema = z.object({
  username: z.string().min(1, "Username obligatoire"),
  email: z.string().email("Email invalide"),
  // tu peux réutiliser les règles de ton form côté client si tu veux
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
    .regex(/\d/, "Le mot de passe doit contenir au moins un chiffre"),
  // on force ici le rôle à 'subadmin' par sécurité
  role: z.literal("subadmin").default("subadmin"),
});

export const AdminUpdatePasswordSchema = z.object({
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
    .regex(/\d/, "Le mot de passe doit contenir au moins un chiffre"),
});


export const adminProfileSchema = z.object({
  username: z.string().min(1, "Le nom d'utilisateur est obligatoire"),
  email: z.string().email("Email invalide"),
  // password optionnel : vide = pas de changement
  password: z
    .string()
    .optional()
    .or(z.literal("")) // permet "" sans erreur
    .refine(
      (val) => !val || val.length >= 8,
      { message: "Le mot de passe doit contenir au moins 8 caractères" }
    ),
});