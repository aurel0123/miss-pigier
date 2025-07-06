"use client"
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Candidates } from '@/constantes'
import Image from 'next/image'
import { Candidate } from '@/types'
import { cn, getCodeFil } from '@/lib/utils'
import { Button } from '@/components/ui/button'
const Page = () => {
    const  [candidate , setCandidate] =useState<Candidate |null>(null)
    const params = useParams()
    const id = params.id 
    useEffect(()=> {
        const dataCandidate = () => {
            const response = Candidates.find((candidate) => candidate.id == Number(id))
            setCandidate(response || null) ;
        }
        dataCandidate()
    } ,[id])
    return (
        <div className="pt-24 pb-16 px-4 ">
            <div className='container lg:px-40 flex flex-col lg:flex-row  justify-center items-center gap-6'>
                {candidate && (
                    <>
                        <div className='w-fit'>
                            <Image
                                src={candidate.image}
                                alt={candidate.fullName}
                                width={500}
                                height={900}
                                className="rounded-sm"
                            />
                        </div>
                        <div className='flex flex-col space-y-4 items-start justify-center'>
                            <h1 className='font-bold text-primary lg:text-3xl md:text-2xl text-xl'>
                                {candidate.fullName}
                            </h1>
                            <h4 className='text-neutral-300'>
                                {candidate.program} <span className='font-semibold'>({getCodeFil(candidate.program)})</span>
                            </h4>
                            <p className='text-neutral-400 text-sm'>
                                Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                            </p>
                            <span className='font-semibold'>
                                VOTES ACTUELS : <span className='text-primary'>{candidate.votes}</span>
                            </span>
                            <div className='mt-2 sm:max-w-full'>
                                <Button className={cn('font-bold text-neutral-950 font-xl py-6')}>
                                    VOTER POUR {candidate.fullName}
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default Page