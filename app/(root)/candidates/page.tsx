
import CandidatesSection from '@/components/CandidatesSection'
import { db } from '@/database/drizzle'
import { candidates } from '@/database/schema'
import config from '@/lib/config'
import { eq } from 'drizzle-orm'

const Page = async () => {
    const getCurrentEvent = async () => {
        try {
            const response = await fetch(`${config.env.apiEndpoint}/api/Evenement/get`)
            if (response.ok) {
                const data = await response.json()
                return data[0]?.id
            }
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'événement:', error)
            return null
        }
    }
    
    const evenementId = await getCurrentEvent()
    
    const listCandidates = await db
        .select()
        .from(candidates)
        .where(eq(candidates.evenementId, evenementId))
    return (
        <>
            <CandidatesSection 
                candidates={listCandidates}
            />
        </>
    )
}

export default Page