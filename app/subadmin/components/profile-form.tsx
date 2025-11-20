"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { type User } from "@/types";
import { toast } from "sonner";
import { adminProfileSchema } from "@/lib/validations";
type ProfileSchemaValues = z.infer<typeof adminProfileSchema>;


interface ProfileFormProps {
  infoUser: Partial<User>;
}
export default function ProfileForm({ infoUser }: ProfileFormProps) {
  const defaultValues: Partial<ProfileSchemaValues> = {
    username: infoUser.username,
    email: infoUser.email,
    password: "",
  };
  const form = useForm<ProfileSchemaValues>({
    resolver: zodResolver(adminProfileSchema),
    defaultValues,
  });

  const onSubmit = async (values: ProfileSchemaValues) => {
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        console.error(data.error);
        // ici tu peux ajouter un toast d’erreur si tu utilises sonner
        toast.error(data.error || "Erreur lors de la mise à jour");
        return;
      }

      toast.success("Profil mis à jour avec succès");
      console.log("Profil mis à jour");
    } catch (error) {
      console.error("Erreur réseau ou serveur:", error);
      toast.error("Erreur réseau ou serveur");
    }
  };
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-row items-center gap-4">
            <Avatar className="rounded-lg size-28">
              <AvatarImage
                src="https://github.com/shadcn.png"
                alt="@evilrabbit"
              />
              <AvatarFallback>ER</AvatarFallback>
            </Avatar>

            <div className="flex flex-col space-y-4">
              <div className="flex gap-4">
                <Button>Modifier l&apos;image</Button>
                <Button variant="destructive">Réinitialiser</Button>
              </div>
              <p className="text-md text-black/50">
                Formats acceptés : JPG, GIF ou PNG. Taille max : 800K.
              </p>
            </div>
          </div>

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom dutilisateur</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormDescription>
                  C&apos;est le nom affiché sur votre profil et dans les emails.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="johndoe@gmail.com" {...field} />
                </FormControl>
                <FormDescription>
                  C&apos;est l&apos;email utilisé pour votre profil.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mot de passe</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="*********" {...field} />
                </FormControl>
                <FormDescription>
                  Vous pouvez modifier votre mot de passe ici.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Mettre à jour</Button>
        </form>
      </Form>
    </div>
  );
}
