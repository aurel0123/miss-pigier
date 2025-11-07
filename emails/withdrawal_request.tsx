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
  Tailwind,
  pixelBasedPreset,
  Button, // ✅ Ajout de Button ici
} from "@react-email/components";

export const WithdrawalRequestEmailStatic = () => {
  return (
    <Html>
      <Head />
      <Preview>Nouvelle demande de retrait à approuver</Preview>

      <Tailwind
        config={{
          presets: [pixelBasedPreset],
          theme: {
            extend: {
              colors: {
                brand: "#0ea5e9", // bleu clair (sky)
              },
            },
          },
        }}
      >
        <Body className="font-sans bg-gray-50 p-5">
          <Container className="bg-white rounded-lg p-6 max-w-xl mx-auto">
            <Heading className="text-brand text-xl mb-4">
              🔔 Nouvelle demande de retrait en attente
            </Heading>

            <Text className="text-gray-700 text-sm mb-2">
              Bonjour <strong>Jean Dupont</strong>,
            </Text>

            <Text className="text-gray-700 text-sm mb-4">
              Une nouvelle demande de retrait a été soumise et nécessite votre
              approbation. Voici les détails :
            </Text>

            <Section className="bg-gray-100 rounded-lg p-4 mb-5">
              <Text className="text-gray-900 text-sm mb-1">
                <strong>Montant :</strong> 50 000 FCFA
              </Text>
              <Text className="text-gray-900 text-sm mb-1">
                <strong>Téléphone :</strong> 770123456
              </Text>
              <Text className="text-gray-900 text-sm">
                <strong>Date de la demande :</strong> 06/11/2025
              </Text>
            </Section>

            <Text className="text-gray-700 text-sm mb-4">
              Veuillez vérifier les informations ci-dessus et approuver ou
              refuser la demande via votre tableau de bord administrateur.
            </Text>

            {/* ✅ Bouton bien défini et stylé */}
            <Button
              href="https://linear.app"
              className="bg-brand px-4 py-2 text-white text-sm font-medium rounded-md"
            >
              Vérifier les informations
            </Button>

            <Hr className="border-gray-200 my-6" />

            <Text className="text-gray-500 text-xs">
              Cordialement, <br />
              <strong>L’équipe de gestion des retraits</strong>
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default WithdrawalRequestEmailStatic;
