
import CandidatesSection from '@/components/CandidatesSection'
import { db } from '@/database/drizzle'
import { candidates } from '@/database/schema'
import config from '@/lib/config'
import { eq } from 'drizzle-orm'
export const dynamic = 'force-dynamic'; // force le rechargement à chaque requête

const Page = async () => {
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
    if (!evenement) {
        return <p>Impossible de charger les candidats : événement introuvable.</p>;
    }
    const listCandidates = await db
        .select()
        .from(candidates)
        .where(eq(candidates.evenementId, evenement.id))
    return (
        <CandidatesSection candidates={listCandidates} prixUnitaire={evenement.prixUnitaire} />
    )
}

export default Page