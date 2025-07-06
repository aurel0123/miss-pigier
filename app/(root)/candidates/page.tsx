import CandidatesSection from '@/components/CandidatesSection'
import { Candidates } from '@/constantes'
import React from 'react'

const page = () => {
    return (
        <>
            <CandidatesSection 
                candidates={Candidates}
            />
        </>
    )
}

export default page