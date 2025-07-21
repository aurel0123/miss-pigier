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
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { EvenementSchema } from "@/lib/validations";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "@/components/imageUpload";
import { toast } from "sonner";
import config from "@/lib/config";
const Page = () => {
  const form = useForm<z.infer<typeof EvenementSchema>>({
    resolver: zodResolver(EvenementSchema),
    defaultValues: {
      titre: "",
      description: "",
      image: "",
      prix_unitaire: 0,
      date_debut: new Date(),
      date_fin: new Date(),
    },
  });

  const onSubmit = async (values: z.infer<typeof EvenementSchema>) => {
    try {
      const response = await fetch(`${config.env.apiEndpoint}/api/Evenement/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        console.error('Erreur lors de la création de l\'événement:', data.error);
        alert('Erreur lors de la création de l\'événement : ' + (data.error || 'Erreur inconnue'));
        return;
      }

      toast.success('Événement créé avec succès !');
      form.reset();
    } catch (error) {
      console.error('Erreur réseau ou serveur:', error);
      alert('Erreur réseau ou serveur lors de la création de l\'événement.');
    }
  };
  

  return (
    <div className="mt-10">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full p-6 border-2 bg-white rounded-xl"
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
                        placeholder="Prix unitaire en €"
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
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <ImageUpload
                  accept="image/*"
                  placeholder="Telecharger une image"
                  folder="evenements"
                  onFileChange={field.onChange}
                />
              )}
            />
            <Button type="submit" onClick={() => console.log("Button clicked")}>Add Event</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Page;
