import { db } from '@/database/drizzle'
import { evenements } from '@/database/schema'
import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    // Récupération de l'événement par ID
    const evenement = await db
      .select()
      .from(evenements)
      .where(eq(evenements.id, id))
      .limit(1)
    
    if (evenement.length === 0) {
      return NextResponse.json(
        { error: 'Événement non trouvé' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(evenement[0], { status: 200 })
  } catch (error) {
    console.error('Erreur lors de la récupération:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de l\'événement' },
      { status: 500 }
    )
  }
} 