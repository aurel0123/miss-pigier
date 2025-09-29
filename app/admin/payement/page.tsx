"use client"

import {useState} from "react";
import {Ring2} from "ldrs/react";

export default function Page() {
    const [loading, setLoading] = useState(true);
    const [payement , setPayement] = useState([])


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
    return(
        <div>

        </div>
    )
}