import { db } from '@/database/drizzle'
import { candidates } from '@/database/schema'
import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params
    await db
      .delete(candidates)
      .where(eq(candidates.id, id))
    
    return NextResponse.json(
      { message: 'Candidates supprimé avec succès' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Erreur lors de la suppression:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du candidates' },
      { status: 500 }
    )
  }
} 