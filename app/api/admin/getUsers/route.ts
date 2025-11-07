import { NextResponse } from "next/server";
import {getUsers} from '@/lib/helpers/helpers'
import {auth} from "@/auth";

export async function GET() {
    try {

        const session = await auth();
        if (!session?.user) {
            return NextResponse.json(
                { success: false, error: "Non autorisé : veuillez vous connecter." },
                { status: 401 }
            );
        }

        const users = await getUsers()
        return NextResponse.json({
            success: true,
            data: users,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                success: false,
                error: "Impossible de récupérer les utilisateurs",
            },
            { status: 500 }
        );
    }
}
