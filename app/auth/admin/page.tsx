"use client" ;
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { loginSchema } from '@/lib/validations'
import z from 'zod'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import PasswordInput from '@/components/password-input'
import { Checkbox } from '@/components/ui/checkbox';

const Page = () => {
    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: "",
            password : ""
        },
    })
    function onSubmit(values: z.infer<typeof loginSchema>) {
        console.log(values)
    }
    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black flex items-center justify-center p-4">
            {/* Background Effect */}
            <div className="absolute inset-0">
                <div className="absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-full blur-sm animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-16 h-16 bg-secondary/15 rounded-full blur-sm animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-yellow-300/10 rounded-full blur-sm animate-pulse delay-500"></div>
            </div>
            <Card className='w-full max-w-md bg-neutral-900 border-primary/30 backdrop-blur-sm'>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-secondary">Espace Administrateur</CardTitle>
                    <CardDescription className="text-gray-300">
                        Connectez-vous pour accéder au dashboard admin
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input 
                                            placeholder="username" {...field} 
                                            className="border-input placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                            />
                            <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <PasswordInput placeholder="*********" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                            />
                            <FormField
                            control={form.control}
                            name="remember"
                            render={({ field }) => (
                                <FormItem className='flex flex-row items-center gap-2 justify-end '>
                                    <FormControl>
                                        <Checkbox 
                                            checked={field.value ?? false}
                                            onCheckedChange={field.onChange}
                                            id="remember"
                                        />
                                    </FormControl>
                                    <FormLabel className='text-sm text-gray-300'>Se rappeler de moi</FormLabel>
                                    <FormMessage />
                                </FormItem>
                            )}
                            />
                            <Button type="submit">Submit</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}

export default Page