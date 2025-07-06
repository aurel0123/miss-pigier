import React from 'react'
import {Description} from '@/constantes/index'
const HowItWork = () => {
    return (
        <div className="py-20 px-10 flex flex-col items-center text-center">
            <div>
                <h2 className="lg:text-5xl text-xl md:text-3xl font-bold text-primary">
                    Comment participer ?
                </h2>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mt-16 w-full'>
                {
                    Description.map((description) => (
                        <div className='space-y-8' key={description.etape}>
                            <div className='h-16 w-16 rounded-full bg-secondary flex justify-center items-center mx-auto'>
                                <span className='text-lg font-medium text-neutral-900'>{description.etape}</span>
                            </div>
                            <h3 className="text-xl font-semibold leading-0.5 text-center">{description.titre}</h3>
                            <p className="text-gray-600">{description.description}</p>
                        </div>
                    )) 
                }
            </div>
        </div>
    )
}

export default HowItWork