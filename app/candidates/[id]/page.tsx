import Image from 'next/image'
import { cn, getCodeFil } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { candidates } from '@/database/schema'
import { db } from '@/database/drizzle'
import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'

interface PageProps {
    params: {
        id: string
    }
}

const Page = async ({ params }: PageProps) => {
    const { id } = params
    
    const candidateResult = await db
        .select()
        .from(candidates)
        .where(eq(candidates.id, id))
        .limit(1)

    if (!candidateResult || candidateResult.length === 0) {
        notFound() // Redirige vers 404
    }

    const candidate = candidateResult[0]

    return (
        <div className="pt-24 pb-16 px-4">
            <div className='lg:px-40 flex flex-col lg:flex-row justify-center items-center gap-6'>
                <div className='w-fit'>
                    <Image
                        src={candidate.image}
                        alt={`${candidate.nom} ${candidate.prenom}`}
                        width={500}
                        height={900}
                        className="rounded-sm"
                    />
                </div>
                <div className='flex flex-col space-y-4 items-start justify-center'>
                    <h1 className='font-bold text-primary lg:text-3xl md:text-2xl text-xl'>
                        {candidate.nom} {candidate.prenom}
                    </h1>
                    <h4 className='text-neutral-300'>
                        {candidate.filiere} <span className='font-semibold'>({getCodeFil(candidate.filiere)})</span>
                    </h4>
                    <p className='text-neutral-400 text-sm'>
                        {candidate.description || 'Aucune description disponible'}
                    </p>
                    <span className='font-semibold'>
                        VOTES ACTUELS : <span className='text-primary'>{candidate.nombreVotes || 0}</span>
                    </span>
                    <div className='mt-2 sm:max-w-full'>
                        <Button className={cn('font-bold text-neutral-950 font-xl py-6')}>
                            VOTER POUR {candidate.nom} {candidate.prenom}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page