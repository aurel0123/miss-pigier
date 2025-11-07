"use client"
import { ContentSection } from '../components/content-section'
import SiteForm from "@/app/admin/settings/components/site-form";

export default function Page() {
    return (
        <ContentSection
            title='Paramètre du site'
            desc="Gérer la commision de votre site. Vous povez changer egalment le nom du site "
        >
            <SiteForm />
        </ContentSection>
    )
}