import { auth } from "@/auth";
import { db } from "@/database/drizzle";
import { admins, Notification, retray } from "@/database/schema";
import { retraySchema } from "@/lib/validations";
import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm"; // si ta version diffère, adapte cet import
import { Resend } from "resend";
import config from "@/lib/config";
import WithdrawalRequestEmail from "@/emails/withdrawal_request_email";

const resend = new Resend(config.env.resend.apiKey);

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Non autorisé." },
        { status: 401 }
      );
    }

    const { role } = session.user as any;
    if (role !== "admin" && role !== "subadmin") {
      return NextResponse.json(
        { success: false, error: "Accès refusé." },
        { status: 403 }
      );
    }

    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (id) {
      const item = await db
        .select()
        .from(retray)
        .where(eq(retray.id, Number(id)));
      if (!item || item.length === 0) {
        return NextResponse.json(
          { success: false, error: "Introuvable." },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { success: true, data: item[0] },
        { status: 200 }
      );
    }

    const items = await db.select().from(retray);
    return NextResponse.json({ success: true, data: items }, { status: 200 });
  } catch (err: any) {
    console.error("GET /api/retray:", err);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur serveur.",
        details: err?.message ?? String(err),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {

  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Non autorisé : veuillez vous connecter." },
        { status: 401 }
      );
    }

    const { role } = session.user as any;
    if (role !== "admin" && role !== "subadmin") {
      return NextResponse.json(
        { success: false, error: "Accès refusé : rôle insuffisant." },
        { status: 403 }
      );
    }

    const json = await request.json();

    let parsed;
    try {
      parsed = retraySchema.parse(json);
    } catch (err: any) {
      return NextResponse.json(
        {
          success: false,
          error: "Données invalides.",
          details: err?.errors ?? err?.message ?? String(err),
        },
        { status: 400 }
      );
    }

    const result = await db
      .insert(retray)
      .values({
        montant_retrait: parsed.montant_retrait,
        telephone: parsed.telephone,
        userId: parsed.userId,
      })
      .returning();

    const newRetrait = result[0];
    
    // Récupérer tous les admins principaux pour leur envoyer une notification
    const adminsList = await db
      .select()
      .from(admins)
      .where(eq(admins.role, "admin"));
    console.log(newRetrait)
    // Créer une notification pour chaque admin
    const notifications = adminsList.map((admin) => ({
      category: "payment" as const,
      type: "withdrawal_request" as const,
      title: "Nouvelle demande de retrait",
      message: `Une demande de retrait de ${parsed.montant_retrait} FCFA a été soumise.`,
      userId: admin.id,
      payment_id : newRetrait.id,
      isRead: false,
    }));

    if (notifications.length > 0) {
      await db.insert(Notification).values(notifications);
      try{
        await resend.emails.send({
            from : 'send@foodplus.space', 
            to : ['kodjogbeaurel5@gmail.com'] ,
            subject : "Demande de retraire", 
            react : WithdrawalRequestEmail({
              username: "Aurel",
              montant: newRetrait.montant_retrait ?? 0,
              telephone: newRetrait.telephone ?? 0, // Provide a default value if null
              dateDemande: newRetrait.date_creation,
            }),
        })  ; 
      }catch(err){
        console.error('Erreur' , err)
      }
    }
    
    return NextResponse.json(
      {
        success: true,
        data: newRetrait,
        message:
          "Demande de retrait créée avec succès. Les administrateurs ont été notifiés.",
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("POST /api/retray:", err);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur serveur.",
        details: err?.message ?? String(err),
      },
      { status: 500 }
    );
  }
}


const updateSchema = z.object({
  id: z.string().uuid(), // assure-toi que c'est un UUID valide
  action: z.enum(["en cour", "approuver", "completer", "rejecter"]),
});

export async function PATCH(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Non autorisé." }, { status: 401 });
    }

    const { role } = session.user as any;
    if (role !== "admin") {
      return NextResponse.json({ success: false, error: "Accès refusé." }, { status: 403 });
    }

    const json = await request.json();

    let parsed;
    try {
      parsed = updateSchema.parse(json);
    } catch (err: any) {
      return NextResponse.json(
        {
          success: false,
          error: "Données invalides.",
          details: err?.errors ?? err?.message ?? String(err),
        },
        { status: 400 }
      );
    }

    
    //Modifier de la notification
    const resultNotification = await db 
      .select()
      .from(Notification)
      .where(eq(Notification.id , parsed.id))
      .limit(1)
      if (!resultNotification || resultNotification.length === 0) {
      return NextResponse.json(
        { success: false, error: "Mise à jour impossible / introuvable." },
        { status: 404 }
      );
    }
    const notitificationData = resultNotification[0]; 

    //Recupérer la demande de retrait 
    
    const retrayResult = await db 
      .select()
      .from(retray)
      .where(eq(retray.id , notitificationData.payment_id!))
      .limit(1)
    if (!retrayResult.length) {
      return NextResponse.json(
        { success: false, error: "" },
        { status: 404 }
      );
    }
    const retraitData = retrayResult[0]
    // Récupérer les infos de l'utilisateur qui a fait la demande
    const userResult = await db
      .select()
      .from(admins)
      .where(eq(admins.id, retraitData.userId!))
      .limit(1);

    if (!userResult.length) {
      return NextResponse.json(
        { success: false, error: "Demande de retrait introuvable" },
        { status: 404 }
      );
    }
    const user = userResult[0]
    //const now = new Date();

    const newStatus = parsed.action === "approuver" ? "approuver" : "rejecter";

    const updated = await db
      .update(retray)
      .set({
        status: newStatus,
        date_aprobation: new Date().toISOString(),
      })
      .where(eq(retray.id, notitificationData.payment_id!))
      .returning();
    const updateData = updated[0]
    const notificationType = parsed.action === "approuver" 
      ? "withdrawal_approved" 
      : "withdrawal_rejected";
    
    const notificationMessage = retraitData.status === "approuver"
      ? `Votre demande de retrait de ${retraitData.montant_retrait} FCFA a été approuvée.`
      : `Votre demande de retrait de ${retraitData.montant_retrait} FCFA a été rejetée.`;


    await db.insert(Notification).values({
      category: "payment",
      type: notificationType,
      title: updateData.status === "approuver" ? "Retrait approuvé" : "Retrait rejeté",
      message: notificationMessage,
      userId: user.id,
      isRead: false,
    });
    
    if (!updated || updated.length === 0) {
      return NextResponse.json(
        { success: false, error: "Mise à jour impossible / introuvable." },
        { status: 404 }
      );
    }
    if (parsed.action === "approuver" && user.email) {
      try {
        await resend.emails.send({
          from: "notifications@foodplus.space", // Remplacez par votre email vérifié
          to: ['kodjogbeaurel4@gmail.com'] /* remplacer par  user.email l'email de la personne qui a fais la demande*/,
          subject: "Demande de retrait approuvée",
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
              <h2 style="color: #10b981;">Demande de retrait approuvée ✓</h2>
              <p>Bonjour <strong>${user.username}</strong>,</p>
              <p>Nous avons le plaisir de vous informer que votre demande de retrait a été approuvée.</p>
              <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 5px 0;"><strong>Montant:</strong> ${retraitData.montant_retrait} FCFA</p>
                <p style="margin: 5px 0;"><strong>Téléphone:</strong> ${retraitData.telephone}</p>
                <p style="margin: 5px 0;"><strong>Date d'approbation:</strong> ${new Date().toLocaleDateString('fr-FR')}</p>
              </div>
              <p>Le montant sera transféré sous peu sur le numéro indiqué.</p>
              <p>Cordialement,<br/>L'équipe</p>
            </div>
          `,
        });
      } catch (emailError) {
        console.error("Erreur lors de l'envoi de l'email:", emailError);
        // On continue même si l'email échoue
      }
    }
    return NextResponse.json({ success: true, data: updated[0] }, { status: 200 });
  } catch (err) {
    console.error("PATCH /api/retray:", err);
    return NextResponse.json(
      { success: false, error: "Erreur serveur." },
      { status: 500 }
    );
  }
}