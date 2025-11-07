"use server"
import { signIn , auth} from "@/auth";
import { AuthCredentials } from "@/types";

export const signInWithcredentials = async (params:AuthCredentials) => {
    const {email , password } = params 

    try {
        const result = await signIn("credentials", {
            email,
            password,
            redirect: false
        })
        if(result?.error) {
            return {success : false , error : result.error};
        }
        const session = await auth()
        return {success : true , data:session?.user};
    } catch (error) {
        console.log(error , "Erreur lors de la connexion de l'utilisateur");
        return {success : false , error : "Mots de passe ou email incorrect. Ou votre compte est désactivé. Contacter l'administrateur"};
    }
}