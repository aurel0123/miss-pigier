import { auth } from "@/auth";
import { db } from "@/database/drizzle";
import { candidates } from "@/database/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // 1. Authentification
  const session = await auth();

  // Vérification stricte de la session
  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, error: "Non autorisé : veuillez vous connecter." },
      { status: 401 }
    );
  }

  // Typage plus sûr (évitez le 'as any' si possible, mais pour l'exemple on sécurise l'accès)
  const { role, is_active } = session.user as {
    role?: string;
    is_active?: boolean;
  };

  // 2. Autorisation (RBAC - Role Based Access Control)
  // Pour voir des données financières, il faut impérativement être ADMIN.
  if (role !== "admin") {
    return NextResponse.json(
      { success: false, error: "Interdit : Droits d'administrateur requis." },
      { status: 403 }
    );
  }

  // Vérification du statut du compte
  if (is_active === false) {
    return NextResponse.json(
      { success: false, error: "Compte inactif : accès refusé." },
      { status: 403 }
    );
  }
  try {
    const { id } = await params;
    await db.delete(candidates).where(eq(candidates.id, id));

    return NextResponse.json(
      { message: "Candidates supprimé avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la suppression:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression du candidates" },
      { status: 500 }
    );
  }
}
