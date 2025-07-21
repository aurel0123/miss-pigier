"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

const Page = () => {
  const router = useRouter()
  const handleClik = () => {
    router.push('/admin/evenements/AddEvenement')
  }
  return (
    <div className ="mt-10">
        <div className='flex flex-1 flex-row items-center space-x-2'>
            <div className='flex items-center border border-dark-400 rounded-md px-2 w-full'>
              <Search size={18} className ="text-primary-foreground" />
              <Input type='search' placeholder='Rechercher...' className='text-primary-foreground border-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none shadow-none placeholder:text-primary-foreground' />
            </div>
            <Button onClick={handleClik}>
              Ajouter votre évènement 
            </Button>
        </div>
    </div>
  )
}

export default Page