import { db } from '@/database/drizzle'
import { evenements } from '@/database/schema'
import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'
import {auth} from '@/auth';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {

  try {
      // Vérifie si l’utilisateur est connecté
      const session = await auth();
      if (!session?.user) {
          return NextResponse.json(
              { success: false, error: "Non autorisé : veuillez vous connecter." },
              { status: 401 }
          );
      }
    const { id } = params
    await db
      .delete(evenements)
      .where(eq(evenements.id, id))
    
    return NextResponse.json(
      { message: 'Événement supprimé avec succès' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Erreur lors de la suppression:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de l\'événement' },
      { status: 500 }
    )
  }
} 