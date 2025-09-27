"use client"
import CardEvenement from '@/components/admin/CardEvenement'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import config from '@/lib/config'
import { Evenement } from '@/types'
import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Ring2 } from 'ldrs/react'
import 'ldrs/react/Ring2.css'

const Page = () => {
  const router = useRouter()
  const [evenment, setEvenment] = useState<Evenement[]>([])
  const [loading, setLoading] = useState(true)

  const handleClik = () => {
    router.push('/admin/evenements/AddEvenement')
  }

  const getEvenment = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${config.env.apiEndpoint}api/Evenement/get`, {
        method: 'GET'
      })
      if (response.ok) {
        const data = await response.json()
        setEvenment(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getEvenment()
  }, [])

  if (loading) {
    return (
      <div className="mt-10 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Ring2
            size="40"
            stroke="5"
            strokeLength="0.25"
            bgOpacity="0.1"
            speed="0.8"
            color="black"
          />
          <p className="text-gray-600">Chargement des événements...</p>
        </div>
      </div>
    )
  }
  console.log(evenment);
  if(evenment.length < 0 ){
    return (
      <div className="mt-10 flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-gray-600 mb-4">Aucun événement disponible.</p> 
      </div>
    )
  }
  return (
    <div className="mt-10">
      <div className='flex flex-1 flex-row items-center space-x-2'>
        <div className='flex items-center border border-dark-400 rounded-md px-2 w-full'>
          <Search size={18} className="text-primary-foreground" />
          <Input type='search' placeholder='Rechercher...' className='text-primary-foreground border-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none shadow-none placeholder:text-primary-foreground' />
        </div>
        <Button onClick={handleClik}>
          Ajouter votre évènement
        </Button>
      </div>
      <div className='evenement'>
        {
          evenment.map((ev) => (
            <CardEvenement key={ev.id} {...ev} />
          ))
        }
      </div>
    </div>
  )
}

export default Page