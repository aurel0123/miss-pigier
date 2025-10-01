import { db } from '@/database/drizzle';
import { candidates } from '@/database/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import CandidatePageClient from '@/app/candidates/Client/Client';
import config from "@/lib/config";

interface PageProps {
    params: {
        id: string;
    };
}

const Page = async ({ params }: PageProps) => {
    const { id } = params;

    const candidateResult = await db
        .select()
        .from(candidates)
        .where(eq(candidates.id, id))
        .limit(1);

    if (!candidateResult || candidateResult.length === 0) {
        notFound();
    }

    const getCurrentEvent = async () => {
        try {
            const response = await fetch(`${config.env.apiEndpoint}/api/Evenement/get`)
            if (response.ok) {
                const data = await response.json()
                const event = data[0]
                return {
                    id : event?.id,
                    prixUnitaire : event?.prixUnitaireVote
                }
            }
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'événement:', error)
            return null
        }
    }
    const evenement = await getCurrentEvent()

    const candidate = candidateResult[0];

    return <CandidatePageClient candidate={candidate} prixUnitaire={evenement?.prixUnitaire} />;
};

export default Page;
