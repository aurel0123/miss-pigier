import HeroSection from '@/components/HeroSection'
import CountdownSection from '@/components/CountdownSection'
import React from 'react'
import HowItWork from '@/components/HowItWork'
import Contact from '@/components/Contact'

const page = () => {
    return (
        <>
            <HeroSection/>
            <CountdownSection/>
            <HowItWork/>
            <Contact/>
        </>
    )
}

export default page