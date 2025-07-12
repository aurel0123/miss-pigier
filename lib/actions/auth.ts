"use server"
import { signIn } from "@/auth";
import { AuthCredentials } from "@/types";


export const signInWithcredentials = async (params:AuthCredentials) => {
    const {email , password } = params 

    try {
        const result = await signIn("credentials", {
            email,
            password,
            redirect: false
        })
        console.log(result)
        if(result?.error) {
            return {success : false , error : result.error};
        }
        return {success : true };
    } catch (error) {
        console.log(error , "Erreur lors de la connexion de l'utilisateur");
        return {success : false , error : "Mots de passe ou email incorrect."};
    }
}