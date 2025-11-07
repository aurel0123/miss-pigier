import * as React from "react";
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Text,
  Heading,
  Section,
  Hr,
} from "@react-email/components";

interface WithdrawalRequestEmailProps {
  username: string;
  montant: number;
  telephone: number ;
  dateDemande: string | null ;
}

export const WithdrawalRequestEmail = ({
  username,
  montant,
  telephone,
  dateDemande,
}: WithdrawalRequestEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Nouvelle demande de retrait à approuver</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Heading style={styles.title}>
            🔔 Nouvelle demande de retrait en attente
          </Heading>

          <Text style={styles.text}>
            Bonjour <strong>{username}</strong>,
          </Text>

          <Text style={styles.text}>
            Une nouvelle demande de retrait a été soumise et nécessite votre
            approbation. Voici les détails :
          </Text>

          <Section style={styles.box}>
            <Text style={styles.detail}>
              <strong>Montant :</strong> {montant.toLocaleString("fr-FR")} FCFA
            </Text>
            <Text style={styles.detail}>
              <strong>Téléphone :</strong> {telephone}
            </Text>
            <Text style={styles.detail}>
              <strong>Date de la demande :</strong> {dateDemande}
            </Text>
          </Section>

          <Text style={styles.text}>
            Veuillez vérifier les informations ci-dessus et approuver ou refuser
            la demande via votre tableau de bord administrateur.
          </Text>

          <Hr style={styles.hr} />

          <Text style={styles.footer}>
            Cordialement, <br />
            <strong>L’équipe de gestion des retraits</strong>
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

// ✅ Styles inline (React Email recommande les styles objets)
const styles = {
  body: {
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f9fafb",
    padding: "20px",
  },
  container: {
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    padding: "24px",
    maxWidth: "600px",
    margin: "0 auto",
  },
  title: {
    color: "#0ea5e9",
    fontSize: "22px",
    marginBottom: "16px",
  },
  text: {
    color: "#374151",
    fontSize: "15px",
    lineHeight: "1.5",
    margin: "8px 0",
  },
  box: {
    backgroundColor: "#f3f4f6",
    borderRadius: "8px",
    padding: "16px",
    margin: "20px 0",
  },
  detail: {
    margin: "4px 0",
    fontSize: "14px",
    color: "#111827",
  },
  hr: {
    borderColor: "#e5e7eb",
    margin: "24px 0",
  },
  footer: {
    fontSize: "13px",
    color: "#6b7280",
  },
} as const;

export default WithdrawalRequestEmail;
