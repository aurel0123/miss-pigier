import { NextResponse } from "next/server";
import { getUsers } from "@/lib/helpers/helpers";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  const { role , is_active } = session?.user as any ;
  if (!session?.user) {
    return NextResponse.json(
      { success: false, error: "Non autorisé : veuillez vous connecter." },
      { status: 401 }
    );
  }
  if(!is_active && role !== "admin") {
    return NextResponse.json({
      success: false, error: "Compte inactif : accès refusé.",
    }, { status: 403
    })
  }
  try {
    const users = await getUsers();
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
