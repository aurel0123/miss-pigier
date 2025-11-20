import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
    try {
        const { name, email, subject, message } = await req.json();

        // Validation
        if (!name || !email || !subject || !message) {
            return NextResponse.json(
                { error: 'Tous les champs sont requis' },
                { status: 400 }
            );
        }

        // Envoi de l'email
        const { data, error } = await resend.emails.send({
            from: `MissPigier <no-reply@foodplus.space>`,
            to: [process.env.RESEND_TO_EMAIL! , "kodjogbeaurel4@gmail.com"],
            replyTo: email,
            subject: `[MissPigier Contact] ${subject}`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); color: #000; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                        .info-row { margin: 15px 0; padding: 10px; background: white; border-left: 4px solid #FFD700; }
                        .label { font-weight: bold; color: #666; }
                        .message-box { background: white; padding: 20px; border-radius: 8px; margin-top: 20px; }
                        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1 style="margin: 0;">✉️ Nouveau Message</h1>
                            <p style="margin: 10px 0 0 0;">MissPigier Contact</p>
                        </div>
                        <div class="content">
                            <div class="info-row">
                                <span class="label">👤 Nom :</span> ${name}
                            </div>
                            <div class="info-row">
                                <span class="label">📧 Email :</span> ${email}
                            </div>
                            <div class="info-row">
                                <span class="label">📋 Sujet :</span> ${subject}
                            </div>
                            <div class="message-box">
                                <p class="label">💬 Message :</p>
                                <p style="white-space: pre-wrap;">${message}</p>
                            </div>
                            <div class="footer">
                                <p>Ce message a été envoyé depuis le formulaire de contact MissPigier</p>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
            `,
        });

        if (error) {
            console.error('Erreur Resend:', error);
            return NextResponse.json(
                { error: 'Erreur lors de l\'envoi de l\'email' },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { success: true, messageId: data?.id },
            { status: 200 }
        );

    } catch (error) {
        console.error('Erreur serveur:', error);
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}