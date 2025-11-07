"use client"

import { z } from "zod"
import { adminSchema } from "@/lib/validations"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {auth} from '@/auth'
import { type User} from '@/types'
type ProfileSchemaValues = z.infer<typeof adminSchema>
interface ProfileFormProps {
    infoUser: Partial<User>
}
export default function ProfileForm({infoUser} : ProfileFormProps) {
    const defaultValues : Partial<ProfileSchemaValues> = {
        username: infoUser.username,
        email: infoUser.email,
        password: "",
    }
    const form = useForm<ProfileSchemaValues>({
        resolver: zodResolver(adminSchema),
        defaultValues
    })

    const onSubmit = (values: ProfileSchemaValues) => {
        console.log(values)
    }
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
                                <Button>Modifier l'image</Button>
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
                                <FormLabel>Nom d'utilisateur</FormLabel>
                                <FormControl>
                                    <Input placeholder="John Doe" {...field} />
                                </FormControl>
                                <FormDescription>
                                    C'est le nom affiché sur votre profil et dans les emails.
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
                                    C'est l'email utilisé pour votre profil.
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
    )
}
