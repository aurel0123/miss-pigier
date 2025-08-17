"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Ring2 } from 'ldrs/react'
import 'ldrs/react/Ring2.css'
import config from "@/lib/config";
import { Candidate } from "@/types";
import Candidates from "@/components/admin/tableCandidates";
import Link from "next/link";

export default function Page() {
    const [loading, setLoading] = useState(true)
    const [candidates , setCandidates] = useState<Candidate[]>([])

    const getCandidates = async () => {
        try{
            setLoading(true)
            const response =  await fetch(`${config.env.apiEndpoint}/api/candidates/getCandidates`)
            if(!response.ok){
                throw('impossible de récupérer les candidates')
            }else{
                const data = await response.json()
                setCandidates(Array.isArray(data) ? data : [])
            }
        }catch(error){
            console.log(error)
        }finally {
            setLoading(false)
        }
    }
    
    useEffect(()=> {
        getCandidates()
    }, [])
    
    const handleCandidatesUpdate = () => {
        getCandidates();
    };
    
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
              <p className="text-gray-600">Chargement des candidates...</p>
            </div>
          </div>
        )
    }
  return (
    <div className="mt-10">
      <div className="flex flex-1 flex-row items-center space-x-2">
        <div className="flex items-center border border-dark-400 rounded-md px-2 w-full">
          <Search size={18} className="text-primary-foreground" />
          <Input
            type="search"
            placeholder="Rechercher..."
            className="text-primary-foreground border-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none shadow-none placeholder:text-primary-foreground"
          />
        </div>
        <Button>rechercher l&apos;évènement</Button>
      </div>
      <div className="mt-10">
        <Candidates
            candidates={candidates}
            onCandidatesUpdate={handleCandidatesUpdate}
        />
      </div>
      <div className="relative">
        <Link href={`/admin/evenements/${candidates[0]?.evenementId}/candidates`}>
            <div className="fixed bottom-4 right-4">
                <div className="bg-yellow-400 p-2 z-[100] rounded shadow-lg flex items-center gap-2 text-neutral-950 text-sm">
                    <Plus size={16} />
                    <span>Ajouter une candidate</span>
                </div>
            </div>
        </Link>
        
      </div>
    </div>
  );
}
