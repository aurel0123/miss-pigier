import {ContentSection} from "@/app/admin/settings/components/content-section";
import NotificationsPage from "@/app/admin/settings/components/notification-page";

export default function Page() {
    return (
        <ContentSection
            title='Notifications'
            desc="Listes des notifications que vous receverez"
        >
            <NotificationsPage/>
        </ContentSection>
    )
}