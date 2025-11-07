"use client";
import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
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
import config from "@/lib/config";
import { toast } from "sonner";
import { Candidate } from "@/types";
import ImageUpload from "@/components/imageUpload";

interface EditCandidateDialogProps {
    candidate: Candidate;
    onCandidateUpdate?: () => void;
}

const editFormSchema = candidateSchema.omit({ evenementId: true, imagePreview: true });

type EditFormData = z.infer<typeof editFormSchema>;

const EditCandidateDialog = ({ candidate, onCandidateUpdate }: EditCandidateDialogProps) => {
    const [open, setOpen] = useState(false);
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
        }
    }, [open, candidate, reset]);


    const onSubmit = async (data: EditFormData) => {
        try {
            const response = await fetch(
                `${config.env.apiEndpoint}/api/candidates/updateCandidate/${candidate.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
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
            <DialogContent className="max-w-[95vw] w-full sm:max-w-[1200px] max-h-[90vh] overflow-y-auto p-6 text-black">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-neutral-950">
                        Modifier le candidat
                    </DialogTitle>
                    <DialogDescription>
                        Modifiez les informations du candidat ci-dessous
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
                        <div className="flex flex-col lg:flex-row items-start gap-8">
                            {/* Section Image Upload */}
                            <div className="w-full lg:w-[350px] flex-shrink-0">
                                <FormField
                                    control={form.control}
                                    name="image"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <ImageUpload
                                                    accept="image/*"
                                                    placeholder="Télécharger une image"
                                                    folder="candidates"
                                                    onFileChange={field.onChange}
                                                    value={field.value}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Section Formulaire */}
                            <div className="flex-1 w-full min-w-0">
                                <div className="space-y-5">
                                    {/* Nom et Prénom */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <FormField
                                            control={form.control}
                                            name="nom"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Nom *</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Entrez le nom"
                                                            className="h-12"
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
                                                            className="h-12"
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
                                                        className="h-12"
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
                                                        rows={4}
                                                        className="resize-none"
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
                        <div className="flex justify-end gap-3 pt-6 border-t">
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