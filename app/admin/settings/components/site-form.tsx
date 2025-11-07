"use client"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

const siteFormSchema = z.object({
    name: z.string(),
    commision: z.coerce.number(), //
})

type SiteFormValues = z.infer<typeof siteFormSchema>

const defaultValues: Partial<SiteFormValues> = {
    name: "Miss Pigier",
    commision: 20,
}

export default function SiteForm() {
    const form = useForm<SiteFormValues>({
        resolver: zodResolver(siteFormSchema),
        defaultValues,
    })

    const onSubmit = (data: SiteFormValues) => {
        console.log(data)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => ( // 👈 on récupère field ici
                        <FormItem>
                            <FormLabel>Nom du site</FormLabel>
                            <FormControl>
                                <Input placeholder="Le nom du site" {...field} />
                            </FormControl>
                            <FormDescription>
                                Ici vous pouvez modifier le nom du site.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="commision"
                    render={({ field }) => ( // 👈 pareil ici
                        <FormItem>
                            <FormLabel>Commission</FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    placeholder="Entrer la commission"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                Vous pouvez modifier la commission reçue pour chaque événement.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit">Mettre à jour</Button>
            </form>
        </Form>
    )
}
