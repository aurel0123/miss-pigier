"use client";
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
import { Plus, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { candidateSchema } from "@/lib/validations";
import UploadCandidate from "@/components/UploadCandidate";
import { useParams, useRouter } from "next/navigation";
import config from "@/lib/config";
import { toast } from "sonner";

const formSchema = z.object({
  students: z.array(candidateSchema).min(1, "Au moins un étudiant est requis"),
});

type FormData = z.infer<typeof formSchema>;

const Page = () => {
  const router = useRouter();
  const params = useParams();
  const getEvenementId = (): string => {
    if (!params.id) return "";
    return Array.isArray(params.id) ? params.id[0] : params.id;
  };
  const evenementId = getEvenementId();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      students: [
        {
          nom: "",
          prenom: "",
          filiere: "",
          description: "",
          image: "",
          nombreVotes : 0,
          evenementId: evenementId || "",
          imagePreview: null,
        },
      ],
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = form;
  const watchedStudents = form.watch("students");
  const { fields, append, remove } = useFieldArray({
    control,
    name: "students",
  });

  const [imageUrls, setImageUrls] = useState<{ [key: number]: string }>({});

  const addStudent = () => {
    append({
      nom: "",
      prenom: "",
      filiere: "",
      description: "",
      image: "",
      nombreVotes : 0, 
      evenementId: evenementId || "",
      imagePreview: null,
    });
  };

  const removeStudent = (index: number) => {
    if (fields.length > 1) {
      remove(index);
      const newImageUrls = { ...imageUrls };
      delete newImageUrls[index];
      setImageUrls(newImageUrls);
    }
  };

  const handleImageChange = (index: number, imageUrl: string) => {
    setImageUrls({ ...imageUrls, [index]: imageUrl });
    form.setValue(`students.${index}.image`, imageUrl);
  };

  const onSubmit = async (data: FormData) => {
    try {
      const candidates = data.students.map((student, index) => ({
        nom: student.nom,
        prenom: student.prenom,
        filiere: student.filiere,
        description: student.description || "",
        image: imageUrls[index] || student.image || "",
        nombreVotes : 0 , 
        evenementId: evenementId,
      }));
      const response = await fetch(`${config.env.apiEndpoint}/api/candidates/createdCandidates`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ students: candidates }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Erreur lors de l'enregistrement");
      }
      toast.success(`${result.candidates.length} candidat(s) enregistré(s) avec succès !`);
      form.reset();
      setImageUrls({});
      // Optionnel : Rediriger vers la liste des candidats
      router.push(`/admin/candidates`);
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      
    }
  };

  return (
    <div className="mt-10">
      {/* <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 mt-10 flex items-start">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div>
          <h3 className="font-medium text-blue-800 dark:text-blue-300">
            Ajouter des candidats à votre événement
          </h3>
          <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">
            Vous pouvez ajouter plusieurs candidats en une seule fois. Chaque
            candidat sera invité à participer à l&apos;événement.
          </p>
        </div>
      </div> */}
      <div className="flex justify-end">
        <Button onClick={addStudent} className="flex items-center gap-2 mb-10">
          <Plus size={16} />
          Ajouter une candidate
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex items-start gap-6 justify-center"
            >
              {/* Section Image Upload */}
              <div className="w-1/3">
                <div className="w-full">
                  <UploadCandidate
                    folder="candidates"
                    placeholder="Télécharger l'image de la candidate"
                    onFileChange={(imageUrl) =>
                      handleImageChange(index, imageUrl)
                    }
                    value={imageUrls[index]}
                  />
                </div>
              </div>

              {/* Section Formulaire */}
              <div className="w-2/3">
                <div className="p-6 border border-gray-200 rounded-lg shadow-sm bg-white">
                  {/* En-tête du candidat */}
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold">
                      Candidat n° {index + 1}{" "}
                      {watchedStudents?.[index]?.nom || ""}{" "}
                      {watchedStudents?.[index]?.prenom || ""}
                    </h3>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeStudent(index)}
                        className="flex items-center gap-1"
                      >
                        <Trash2 size={14} />
                        Supprimer
                      </Button>
                    )}
                  </div>

                  {/* Informations personnelles */}
                  <div className="space-y-4">
                    {/* Nom et Prénom */}
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={control}
                        name={`students.${index}.nom`}
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
                        control={control}
                        name={`students.${index}.prenom`}
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
                      control={control}
                      name={`students.${index}.filiere`}
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
                      control={control}
                      name={`students.${index}.description`}
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
                            Informations supplémentaires sur le candidat
                            (optionnel)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Bouton de soumission */}
          <div className="flex justify-start pt-6">
            <Button
              type="submit"
              size="lg"
              className="px-8"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Enregistrement..." : "Enregistrer les candidats"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Page;
