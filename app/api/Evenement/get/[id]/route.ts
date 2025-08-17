import { db } from '@/database/drizzle'
import { evenements } from '@/database/schema'
import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params
    const evenement = await db
      .select()
      .from(evenements)
      .where(eq(evenements.id, id))
      .limit(1)
    
    if (evenement.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Événement non trouvé' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: evenement[0]
    });
  } catch (error) {
    console.error('Erreur lors de la récupération:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur interne du serveur lors de la récupération' 
      },
      { status: 500 }
    )
  }
} 