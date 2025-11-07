"use client";
import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Edit } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { candidateSchema } from "@/lib/validations";
import UploadCandidate from "@/components/UploadCandidate";
import config from "@/lib/config";
import { toast } from "sonner";
import { Candidate } from "@/types";

interface EditCandidateDialogProps {
    candidate: Candidate;
    onCandidateUpdate?: () => void;
}

const editFormSchema = candidateSchema.omit({ evenementId: true, imagePreview: true });

type EditFormData = z.infer<typeof editFormSchema>;

const EditCandidateDialog = ({ candidate, onCandidateUpdate }: EditCandidateDialogProps) => {
    const [open, setOpen] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>(candidate.image);

    const form = useForm<EditFormData>({
        resolver: zodResolver(editFormSchema),
        defaultValues: {
            nom: candidate.nom,
            prenom: candidate.prenom,
            filiere: candidate.filiere,
            description: candidate.description || "",
            image: candidate.image,
            nombreVotes: candidate.nombreVotes,
        },
    });

    const {
        handleSubmit,
        formState: { isSubmitting },
        reset,
    } = form;

    // Réinitialiser le formulaire quand le dialogue s'ouvre
    useEffect(() => {
        if (open) {
            reset({
                nom: candidate.nom,
                prenom: candidate.prenom,
                filiere: candidate.filiere,
                description: candidate.description || "",
                image: candidate.image,
                nombreVotes: candidate.nombreVotes,
            });
            setImageUrl(candidate.image);
        }
    }, [open, candidate, reset]);

    const handleImageChange = (newImageUrl: string) => {
        setImageUrl(newImageUrl);
        form.setValue("image", newImageUrl);
    };

    const onSubmit = async (data: EditFormData) => {
        try {
            const response = await fetch(
                `${config.env.apiEndpoint}/api/candidates/updateCandidate/${candidate.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        ...data,
                        image: imageUrl,
                    }),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Erreur lors de la modification");
            }

            toast.success("Succès", {
                description: "Candidat modifié avec succès",
            });

            setOpen(false);

            // Appeler le callback pour rafraîchir la liste
            if (onCandidateUpdate) {
                onCandidateUpdate();
            }
        } catch (error) {
            console.error("Erreur lors de la modification:", error);
            toast.error("Erreur", {
                description: "Erreur lors de la modification du candidat",
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    size="sm"
                    variant="outline"
                    className="bg-white border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-black"
                >
                    <Edit className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-neutral-950">
                        Modifier le candidat
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="flex flex-col md:flex-row items-start gap-6">
                            {/* Section Image Upload */}
                            <div className="w-full md:w-1/3">
                                <UploadCandidate
                                    folder="candidates"
                                    placeholder="Télécharger l'image de la candidate"
                                    onFileChange={handleImageChange}
                                    value={imageUrl}
                                />
                            </div>

                            {/* Section Formulaire */}
                            <div className="w-full md:w-2/3">
                                <div className="space-y-4">
                                    {/* Nom et Prénom */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="nom"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Nom *</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Entrez le nom"
                                                            className="text-primary-foreground border-primary rounded-md [&:focus]:outline-none [&:focus]:ring-0 [&:focus]:border-primary py-6"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="prenom"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Prénom *</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Entrez le prénom"
                                                            className="text-primary-foreground border-primary rounded-md [&:focus]:outline-none [&:focus]:ring-0 [&:focus]:border-primary py-6"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {/* Filière */}
                                    <FormField
                                        control={form.control}
                                        name="filiere"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Filière *</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Entrez la filière"
                                                        className="text-primary-foreground border-primary rounded-md [&:focus]:outline-none [&:focus]:ring-0 [&:focus]:border-primary py-6"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Description */}
                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Description</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Entrez une description du candidat"
                                                        rows={3}
                                                        className="text-primary-foreground border-primary rounded-md [&:focus]:outline-none [&:focus]:ring-0 [&:focus]:border-primary py-6"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Informations supplémentaires sur le candidat (optionnel)
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Boutons d'action */}
                        <div className="flex justify-end gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                                disabled={isSubmitting}
                            >
                                Annuler
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Modification..." : "Modifier le candidat"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default EditCandidateDialog;