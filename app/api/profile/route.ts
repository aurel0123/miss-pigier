// app/api/profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/database/drizzle";
import { admins } from "@/database/schema";
import { eq, and, or, ne } from "drizzle-orm";
import { adminProfileSchema } from "@/lib/validations";
import { hash } from "bcryptjs";

export async function PATCH(req: NextRequest) {
  try {
    // 1. Vérifier que l'utilisateur est connecté
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Non autorisé" },
        { status: 401 }
      );
    }

    const userId = session.user.id as string;

    // 2. Récupérer et valider les données envoyées
    const json = await req.json();
    const parsed = adminProfileSchema.parse(json);
    const { username, email, password } = parsed;

    // 3. Vérifier que username / email ne sont pas déjà pris par un autre admin
    const existing = await db
      .select()
      .from(admins)
      .where(
        and(
          or(eq(admins.username, username), eq(admins.email, email)),
          ne(admins.id, userId)
        )
      );

    if (existing.length > 0) {
      return NextResponse.json(
        { success: false, error: "Username ou email déjà utilisé." },
        { status: 400 }
      );
    }

    // 4. Construire les données à mettre à jour
    const updateData: Partial<typeof admins.$inferInsert> = {
      username,
      email,
    };

    // Si un mot de passe non vide est envoyé, on le met à jour
    if (password && password.trim() !== "") {
      updateData.password = await hash(password.trim(), 10);
    }

    // 5. Mise à jour en base
    await db
      .update(admins)
      .set(updateData)
      .where(eq(admins.id, userId));

    return NextResponse.json({
      success: true,
      message: "Profil mis à jour avec succès.",
    });
  } catch (error: any) {
    console.error("Erreur update profil:", error);
    return NextResponse.json(
      { success: false, error: error.message ?? "Erreur serveur" },
      { status: 500 }
    );
  }
}