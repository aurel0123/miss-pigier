import { ContentSection } from "../components/content-section";
import NotificationsPage from "../components/notification-page";

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