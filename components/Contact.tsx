import React from 'react'
import { Mail, MapPin, Phone } from 'lucide-react'
import Link from 'next/link'


const Contact = () => {
    return (
        <section>
            <div className="container">
                <div>
                    <div className='info-footer'>
                        <div className='space-y-4 text-center md:text-left'>
                            <div className='flex justify-center md:justify-start'>
                                <Mail size={50} className="text-primary" />
                            </div>
                            <h2 className='text-2xl font-bold'>Email</h2>
                            <p className="text-gray-400 mb-4 leading-relaxed text-sm">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in ero.
                            </p>
                            <Link href="mailto:contact@pigier.com" className="text-primary hover:text-secondary transition-colors underline">
                                contact@pigier.com
                            </Link>
                        </div>
                        <div className='space-y-4 text-center md:text-left'>
                            <div className='flex justify-center md:justify-start'>
                                <Phone size={50} className="text-primary" />
                            </div>
                            <h2 className='text-2xl font-bold'>Téléphone</h2>
                            <p className="text-gray-400 mb-4 leading-relaxed text-sm">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in ero.
                            </p>
                            <Link href="tel:+2290190907890" className="text-primary hover:text-secondary transition-colors underline">
                                +229 01 90 90 87 56
                            </Link>
                        </div>
                        <div className='space-y-4 text-center md:text-left'>
                            <div className='flex justify-center md:justify-start'>
                                <MapPin size={50} className="text-primary" />
                            </div>
                            <h2 className='text-2xl font-bold'>Adresse</h2>
                            <p className="text-gray-400 mb-4 leading-relaxed text-sm">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in ero.
                            </p>
                            <address className="text-primary text-sm not-italic">
                                123 Rue de l&poas;Université, Paris, 75000 FR
                            </address>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Contact