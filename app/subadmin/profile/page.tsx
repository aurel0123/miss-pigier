import {ContentSection} from "../components/content-section";
import ProfileForm from "../components/profile-form";
import {auth} from '@/auth'
import {redirect} from "next/navigation";
import {admins} from "@/database/schema";
import { db } from '@/database/drizzle'
import { eq } from 'drizzle-orm'


export default async  function Page() {
    const session = await auth() ;
    if(!session?.user || !session.user.id) redirect('/auth/admin')
    const user = await db
        .select()
        .from(admins)
        .where(eq(admins.id, session.user.id))
        .limit(1)

    const safeUser = {
        id: user[0].id,
        username: user[0].username,
        email: user[0].email ?? undefined,
    };
    return (
        <ContentSection
            title='Profile'
            desc="Mettez à jour les paramètres de votre compte. "
        >
            <ProfileForm infoUser = {safeUser}/>
        </ContentSection>
    )
}