import NextAuth, { User } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { db } from "./database/drizzle"
import { admins } from "./database/schema"
import { eq } from "drizzle-orm"
import { compare } from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session : {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        if(!credentials?.email || !credentials?.password) return null ; 

        // verifie si l'utisateur existe 
        const user = await db
        .select()
        .from(admins)
        .where(eq(admins.email , credentials.email.toString()))
        .limit(1); 
        if(user.length === 0) {
          return null;
        }

        //Verifier si l'utilisateur est active
         if(user[0].is_active === false) {
             return null;
         }

        const isPassword = await compare(credentials.password.toString() , user[0].password)
        // You should return a user object with at least an id and name or email
        if(!isPassword){
          return null
        }
        return {
          id : user[0].id, 
          name : user[0].username , 
          email : user[0].email,
          role : user[0].role,
          is_active : user[0].is_active
        }  as User & {role : string ; is_active : boolean};
      }
      
    })
  ],
  pages: {
    signIn: '/auth/admin',
  },
  callbacks : {
    async jwt({ token, user }) {
        if(user) {
          token.id = user.id;
          token.email = user.email;
          token.name = user.name;
          token.role = (user as any).role;
          token.is_active = (user as any).is_active;
        }
        return token;
      },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        (session.user as any).role = token.role;
        (session.user as any).is_active = token.is_active;
      }
      return session;
    }
  }
})