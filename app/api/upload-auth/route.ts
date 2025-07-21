import ImageKit from "imagekit";
import config from "@/lib/config";
import { NextResponse } from "next/server";

const {
  env: {
    imageKit: { publicKey, privateKey, urlEndpoint },
  },
} = config;

// Ajoutez une vérification des variables d'environnement
if (!publicKey || !privateKey || !urlEndpoint) {
  console.error("Missing ImageKit configuration:", {
    publicKey: !!publicKey,
    privateKey: !!privateKey,
    urlEndpoint: !!urlEndpoint,
  });
}

const imagekit = new ImageKit({
  publicKey,
  privateKey,
  urlEndpoint,
});

export async function GET() {
  try {
    const authParams = imagekit.getAuthenticationParameters();
    return NextResponse.json(authParams);
  } catch (error) {
    console.error("ImageKit authentication error:", error);
    return NextResponse.json(
      { error: "Failed to generate authentication parameters" },
      { status: 500 }
    );
  }
}