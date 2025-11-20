// app/api/admin/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { admins } from "@/database/schema";
import { eq, or } from "drizzle-orm";
import { auth } from "@/auth";
import { hash } from "bcryptjs";
import { Resend } from "resend";
import { CreateSubadminSchema } from "@/lib/validations"; // ajuste le path

const resend = new Resend(process.env.RESEND_API_KEY || "");

export async function POST(request: NextRequest) {
  try {
    // 1. Authentification + vérif role admin
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Non autorisé : veuillez vous connecter." },
        { status: 401 }
      );
    }

    const { role, is_active } = session.user as {
      role?: string;
      is_active?: boolean;
    };

    if (role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Accès interdit : rôle admin requis." },
        { status: 403 }
      );
    }

    if (is_active === false) {
      return NextResponse.json(
        { success: false, error: "Compte admin inactif." },
        { status: 403 }
      );
    }

    // 2. Récupération + validation du body
    const json = await request.json();
    const parsed = CreateSubadminSchema.parse(json);

    const { username, email, password } = parsed;

    // 3. Vérifier l'unicité username / email
    const existing = await db
      .select()
      .from(admins)
      .where(
        or(eq(admins.username, username), eq(admins.email, email))
      )
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { success: false, error: "Username ou email déjà utilisé." },
        { status: 400 }
      );
    }

    // 4. Hash du mot de passe
    const hashedPassword = await hash(password, 10);

    // 5. Insertion en base
    const [newUser] = await db
      .insert(admins)
      .values({
        username,
        email,
        password: hashedPassword,
        role: "subadmin",   // on force côté backend aussi
        is_active: true,
        is_staff: false,
      })
      .returning();

    // 6. Envoi de l'email avec les identifiants
    try {
      if (process.env.RESEND_API_KEY) {
        await resend.emails.send({
          from: "Ulmann Service <no-reply@foodplus.space>", // adapte le domaine
          to: email,
          subject: "Vos accès Subadmin - Ulmann Service",
          html: `
            <p>Bonjour ${username},</p>
            <p>Un compte subadmin vient d'être créé pour vous sur la plateforme Ulmann Service.</p>
            <p>Identifiants de connexion :</p>
            <ul>
              <li>Email (ID) : <strong>${email}</strong></li>
              <li>Mot de passe : <strong>${password}</strong></li>
            </ul>
            <p>Nous vous recommandons de changer votre mot de passe après votre première connexion.</p>
            <p>Cordialement,<br/>L'équipe Ulmann Service</p>
          `,
        });
      } else {
        console.warn("RESEND_API_KEY manquant : email non envoyé.");
      }
    } catch (emailError) {
      console.error("Erreur lors de l'envoi de l'email:", emailError);
      // On n'échoue pas la création pour une erreur d'email
    }

    return NextResponse.json(
      {
        success: true,
        message: "Subadmin créé avec succès.",
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
          is_active: newUser.is_active,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Erreur création subadmin:", error);
    return NextResponse.json(
      { success: false, error: error.message ?? "Erreur serveur" },
      { status: 500 }
    );
  }
}