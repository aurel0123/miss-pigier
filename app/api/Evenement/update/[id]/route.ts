"use server"
import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { EvenementSchema } from '@/lib/validations';
import { db } from '@/database/drizzle';
import { evenements } from '@/database/schema';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }>} 
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID de l\'événement requis' },
        { status: 400 }
      );
    }
    const body = await request.json();
    
    const validationResult = EvenementSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Données invalides',
          details: validationResult.error.errors
        },
        { status: 400 }
      );
    }

    const validatedData = validationResult.data;
    const existingEvent = await db
      .select()
      .from(evenements)
      .where(eq(evenements.id, id))
      .limit(1);

    if (existingEvent.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Événement non trouvé' },
        { status: 404 }
      );
    }

    const updatedEvent = await db
      .update(evenements)
      .set({
        titre: validatedData.titre,
        description: validatedData.description,
        image: validatedData.image,
        prixUnitaireVote: validatedData.prix_unitaire,
        dateDebut: validatedData.date_debut,
        dateFin: validatedData.date_fin,
        createdAt: new Date(), // Si vous avez ce champ
      })
      .where(eq(evenements.id, id))
      .returning();

    return NextResponse.json({
      success: true,
      message: 'Événement mis à jour avec succès',
      data: updatedEvent[0]
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'événement:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur interne du serveur lors de la mise à jour' 
      },
      { status: 500 }
    );
  }
}