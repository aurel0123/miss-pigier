import { NextResponse } from "next/server";
import { setPublishEvent } from "@/lib/helpers/helpers";

export async function PUT(
    _req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const updatedEvent = await setPublishEvent(params.id);
        return NextResponse.json({ success: true, evenement: updatedEvent });
    } catch (error: any) {
        console.error("Erreur lors de la publication:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Erreur interne du serveur" },
            { status: 500 }
        );
    }
}
