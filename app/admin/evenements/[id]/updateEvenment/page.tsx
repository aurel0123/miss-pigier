"use client";
import z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { EvenementSchema } from "@/lib/validations";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "@/components/imageUpload";
import { toast } from "sonner";
import config from "@/lib/config";
import { useParams, useRouter } from "next/navigation";
import { Ring2 } from "ldrs/react";

const EditEvenementPage = () => {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { id } = params;

  const form = useForm<z.infer<typeof EvenementSchema>>({
    resolver: zodResolver(EvenementSchema),
    defaultValues: {
      titre: "",
      description: "",
      image: "",
      prix_unitaire: 0,
      date_debut: new Date(),
      date_fin: new Date(),
      commissions: 0,
    },
  });

  // Charger les données de l'événement
  const loadEventData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${config.env.apiEndpoint}api/Evenement/get/${id}`
      );

      if (!response.ok) {
        throw new Error("Événement non trouvé");
      }

      const data = await response.json();
      if (data.success) {
        const event = data.data; // ⬅️ au lieu de data.data
        form.reset({
          titre: event.titre || "",
          description: event.description || "",
          image: event.image || "",
          prix_unitaire: event.prixUnitaireVote || 0,
          date_debut: event.dateDebut ? new Date(event.dateDebut) : new Date(),
          date_fin: event.dateFin ? new Date(event.dateFin) : new Date(),
          commissions: event.commissions ?? 0, // ⬅️ à ajouter
        });
      } else {
        throw new Error(data.error || "Erreur lors du chargement");
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors du chargement de l'événement");
      router.push("/admin/evenements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadEventData();
    }
  }, [id]);

  const onSubmit = async (values: z.infer<typeof EvenementSchema>) => {
    try {
      console.log(values);
      setSubmitting(true);
      const response = await fetch(
        `${config.env.apiEndpoint}api/Evenement/update/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        console.error("Erreur lors de la mise à jour:", data.error);
        toast.error(
          "Erreur lors de la mise à jour : " + (data.error || "Erreur inconnue")
        );
        return;
      }

      toast.success("Événement mis à jour avec succès !");
      router.push("/admin/evenements");
    } catch (error) {
      console.error("Erreur réseau ou serveur:", error);
      toast.error("Erreur réseau ou serveur lors de la mise à jour.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="mt-10 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Ring2
            size="40"
            stroke="5"
            strokeLength="0.25"
            bgOpacity="0.1"
            speed="0.8"
            color="black"
          />
          <p className="text-gray-600">Chargement de l&apos;événement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Modifier l&apos;événement
        </h1>
        <p className="text-gray-600">
          Modifiez les informations de votre événement
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full p-6 shadow-2xl bg-white rounded-xl"
        >
          <div className="flex flex-col space-y-4">
            <FormField
              control={form.control}
              name="titre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Titre de l'evenement"
                      {...field}
                      className="text-primary-foreground col-span-3 border-primary rounded-md [&:focus]:outline-none [&:focus]:ring-0 [&:focus]:border-primary py-6"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid items-center gap-3">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Description de l'evenement"
                        {...field}
                        className="text-primary-foreground col-span-3 border-primary rounded-md [&:focus]:outline-none [&:focus]:ring-0 [&:focus]:border-primary py-6"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-4 w-full">
              <FormField
                control={form.control}
                name="date_debut"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date Début</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        value={
                          field.value instanceof Date
                            ? field.value.toISOString().substring(0, 10)
                            : field.value
                        }
                        onChange={(e) =>
                          field.onChange(new Date(e.target.value))
                        }
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                        className="text-primary-foreground col-span-3 border-primary rounded-md [&:focus]:outline-none [&:focus]:ring-0 [&:focus]:border-primary py-6"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date_fin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date Fin</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        value={
                          field.value instanceof Date
                            ? field.value.toISOString().substring(0, 10)
                            : field.value
                        }
                        onChange={(e) =>
                          field.onChange(new Date(e.target.value))
                        }
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                        className="text-primary-foreground col-span-3 border-primary rounded-md [&:focus]:outline-none [&:focus]:ring-0 [&:focus]:border-primary py-6"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col space-y-4">
              <FormField
                control={form.control}
                name="prix_unitaire"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prix Unitaire</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Prix unitaire en FCFA"
                        value={field.value}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === "" ? "" : Number(e.target.value)
                          )
                        }
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                        className="text-primary-foreground col-span-3 border-primary rounded-md [&:focus]:outline-none [&:focus]:ring-0 [&:focus]:border-primary py-6"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col space-y-4">
              <FormField
                control={form.control}
                name="commissions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Commission en %</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Entrer le pourcentage de commission"
                        {...field}
                        className="text-primary-foreground col-span-3 border-primary rounded-md [&:focus]:outline-none [&:focus]:ring-0 [&:focus]:border-primary py-6"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <ImageUpload
                  accept="image/*"
                  placeholder="Telecharger une image"
                  folder="evenements"
                  onFileChange={field.onChange}
                  value={field.value}
                />
              )}
            />
            <div className="flex gap-4">
              <Button
                type="button"
                className="text-white bg-neutral-950 hover:bg-neutral-950"
                onClick={() => router.push("/admin/evenements")}
                disabled={submitting}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Mise à jour..." : "Mettre à jour l'événement"}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditEvenementPage;
