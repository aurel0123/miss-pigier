"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { retraySchema } from "@/lib/validations";
import z from "zod";

import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Clock,
  HandCoins,
  PiggyBank,
  WalletMinimal,
  BadgeInfo,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemTitle,
} from "@/components/ui/item";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
} from "@/components/ui/empty";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import config from "@/lib/config";
import { toast } from "sonner";

interface PageClientProps {
  userId: string;
}

export default function PageClient({ userId }: PageClientProps) {
  const [retray, setRetray] = React.useState<any[]>([]);
  const [open, setOpen] = React.useState(false);

  const form = useForm<z.infer<typeof retraySchema>>({
    resolver: zodResolver(retraySchema),
    defaultValues: {
        montant_retrait : 0, 
        telephone : "",
        userId 
    },
  });

  const getRetray = async () => {
    try {
      const res = await fetch(`${config.env.apiEndpoint}/api/retray/`);
      const result = await res.json();
      if (!result.success) return new Error("Erreur lors de la récupération");
      setRetray(result.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleRetray = async (values: z.infer<typeof retraySchema>) => {
    const res = await fetch(`${config.env.apiEndpoint}/api/retray/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const result = await res.json();
    if(result.success) {
      toast.success("Demande créer avec succès")
    }
    setOpen(false);
    form.reset();
    await getRetray();
  };

  useEffect(() => {
    getRetray();
  }, []);

  // Mapping des couleurs de badge selon le status
  const statusColor: Record<string, string> = {
    "en cour": "yellow",
    "approuver": "green",
    "completer": "blue",
    "rejecter" : "red"
  };

  return (
    <div>
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Balances</h1>
        <p className="text-base text-gray-600">Retirer votre montant à tout moment</p>
      </div>

      <Separator className="my-4" />

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border border-neutral-200 hover:shadow-xl transition-shadow bg-white">
          <CardHeader>
            <CardTitle>Transactions approuvées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <HandCoins size={56} strokeWidth={1} />
              <span className="text-xl">0 <strong>FCFA</strong></span>
              <p className="text-base font-semibold text-gray-600">(0) transaction approuvée</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-neutral-200 hover:shadow-xl transition-shadow bg-white">
          <CardHeader>
            <CardTitle className="text-purple-500">Solde disponible</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4 text-purple-500">
              <WalletMinimal size={56} strokeWidth={1} />
              <span className="text-xl">0 <strong>FCFA</strong></span>
              <p className="text-base font-semibold text-gray-600">Disponible(s)</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-neutral-200 hover:shadow-xl transition-shadow bg-white">
          <CardHeader>
            <CardTitle className="text-yellow-500">Demande en attente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4 text-yellow-500">
              <Clock size={56} strokeWidth={1} />
              <span className="text-xl">0 <strong>FCFA</strong></span>
              <p className="text-base font-semibold text-gray-600">(0) Demande en attente</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-neutral-200 hover:shadow-xl transition-shadow bg-white">
          <CardHeader>
            <CardTitle className="text-green-500">Demande validée</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2 text-green-500">
              <PiggyBank size={56} strokeWidth={1} />
              <span className="text-xl">0 <strong>FCFA</strong></span>
              <p className="text-base font-semibold text-gray-600">0 FCFA Montant total retiré</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bloc info avec Dialog */}
      <div>
        <Item variant="outline" className="mt-4">
          <ItemContent className="bg-yellow-100 p-2 rounded-md gap-4">
            <ItemTitle>
              <BadgeInfo className="size-5" />
              <p>
                Veuillez lancer la demande de retrait. Merci de patienter : une notification vous sera envoyée pour approbation.
              </p>
            </ItemTitle>
          </ItemContent>
          <ItemActions>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="lg">Demande de retrait</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-black">Nouvelle demande de retrait</DialogTitle>
                  <DialogDescription>
                    Saisissez le montant et le numéro de téléphone pour valider votre demande.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleRetray)} className="space-y-8">
                    <FormField
                      control={form.control}
                      name="montant_retrait"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black">Montant du retrait</FormLabel>
                          <FormControl>
                            <Input placeholder="Entrer le montant du retrait" {...field} className="text-black" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="telephone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black">Numéro de téléphone</FormLabel>
                          <FormControl>
                            <Input placeholder="01 90 90 76 00" {...field} className="text-black" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button type="submit" className="w-full">Envoyer la demande</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </ItemActions>
        </Item>
      </div>

      {/* Tableau */}
      <div className="mt-8">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>MONTANT</TableHead>
              <TableHead>STATUS</TableHead>
              <TableHead>VERS</TableHead>
              <TableHead>DATE DE CRÉATION</TableHead>
              <TableHead className="text-right">APPROUVÉ LE</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {retray.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia variant="icon"><PiggyBank /></EmptyMedia>
                      <EmptyDescription>Vous n&apos;avez encore aucune demande de retrait.</EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                      <Button onClick={() => setOpen(true)}>Demande de retrait</Button>
                    </EmptyContent>
                  </Empty>
                </TableCell>
              </TableRow>
            ) : (
              retray.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{item.montant_retrait} FCFA</TableCell>
                  <TableCell>
                    <Badge className={`bg-${statusColor[item.status] || "gray"}-400 text-${statusColor[item.status] || "gray"}-800`}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.telephone}</TableCell>
                  <TableCell >
                    {new Date(item.date_creation).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                    })}

                  </TableCell>
                  <TableCell className="text-right">
                    {new Date(item.date_aprobation).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                    })}

                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
