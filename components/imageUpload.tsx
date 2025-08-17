"use client"
import config from '@/lib/config';
import React, { useRef, useState, useEffect } from 'react'
import { IKImage, ImageKitProvider, IKUpload } from "imagekitio-next";
import { toast } from 'sonner';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const {
  env: {
    imageKit: { publicKey, urlEndpoint },
  },
} = config;

const authenticator = async () => {
    try {
        const response = await fetch(`${config.env.apiEndpoint}api/upload-auth/`);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Request failed with status ${response.status}: ${errorText}`);
        }
        const data = await response.json();
    
        
        const { signature, expire, token } = data;
        return { signature, expire, token };
    } catch (error) {
        console.error("Authentication error:", error);
        throw new Error("Authentication request failed");
    }
};

interface Props {
    accept?: string;
    placeholder?: string;
    folder: string;
    onFileChange: (filePath: string) => void;
    value?: string;
}

const ImageUpload = ({
    accept = "image/*",
    placeholder = "Télécharger une image",
    folder,
    onFileChange,
    value,
}: Props) => {
    
    const ikUploadRef = useRef(null);
    const [file, setFile] = useState<{ filePath: string | null; url?: string }>({
        filePath: null,
        url: undefined,
    });
    const [progress, setProgress] = useState(0);

    // Effet pour gérer la valeur initiale et les changements
    useEffect(() => {
        if (value) {
            // Si la valeur est une URL complète ImageKit
            if (value.includes(urlEndpoint)) {
                const filePath = value.replace(urlEndpoint + '/', '');
                setFile({ filePath, url: value });
            } 
            // Si c'est juste un filePath
            else if (value.startsWith('/')) {
                setFile({ filePath: value, url: value });
            }
            // Si c'est une URL complète d'une autre source
            else if (value.startsWith('http')) {
                setFile({ filePath: value, url: value });
            }
            // Si c'est juste un nom de fichier
            else {
                setFile({ filePath: value, url: `${urlEndpoint}/${value}` });
            }
        } else {
            setFile({ filePath: null });
        }
    }, [value, urlEndpoint]);

    const styles = {
        button: "bg-neutral-100 border-gray-100 border",
        placeholder: "text-slate-500",
        text: "text-dark-400",
    };

    const onError = (error: unknown) => {
        console.error("Upload error details:", error);
        toast.error("Échec du téléchargement d'image", {
            description: "Votre image n'a pas pu être téléchargée. Veuillez réessayer.",
        });
    };

    const onSuccess = (res: { filePath: string, url: string }) => {
        const newFile = {
            filePath: res.filePath,
            url: res.url || `${urlEndpoint}/${res.filePath}`
        };
        setFile(newFile);
        // Envoyez l'URL complète
        onFileChange(newFile.url);
        toast.success("Image téléchargée avec succès");
    };

    const onValidate = (file: File) => {
        // Vérifier si c'est bien une image
        if (!file.type.startsWith('image/')) {
            toast.error("Type de fichier non valide", {
                description: "Veuillez sélectionner un fichier image valide.",
            });
            return false;
        }

        // Vérifier la taille (limite à 20Mo)
        if (file.size > 20 * 1024 * 1024) {
            toast.error("Le fichier téléchargé est trop grand", {
                description: "Téléchargez un fichier de moins de 20Mo",
            });
            return false;
        }

        return true;
    };

    const handleRemoveImage = () => {
        setFile({ filePath: null });
        onFileChange("");
        toast.success("Image supprimée");
    };

    // Vérifiez si les variables requises sont disponibles
    if (!publicKey || !urlEndpoint) {
        return (
            <div className="p-4 border-2 border-red-200 rounded-lg bg-red-50">
                <p className="text-red-600">
                    Configuration ImageKit manquante. Vérifiez vos variables d&apos;environnement.
                </p>
            </div>
        );
    }

    return (
        <ImageKitProvider
            publicKey={publicKey}
            urlEndpoint={urlEndpoint}
            authenticator={authenticator}
        >
            <div className="space-y-4">
                <IKUpload
                    ref={ikUploadRef}
                    onError={onError}
                    onSuccess={onSuccess}
                    useUniqueFileName={true}
                    validateFile={onValidate}
                    onUploadStart={() => setProgress(0)}
                    onUploadProgress={({ loaded, total }) => {
                        const percent = Math.round((loaded / total) * 100);
                        setProgress(percent);
                    }}
                    folder={folder}
                    accept={accept}
                    className="hidden"
                />

                {/* Bouton d'upload */}
                <button
                    type="button"
                    className={cn("upload-btn p-4 rounded-lg border-2 border-dashed w-full flex flex-col items-center gap-2", styles.button)}
                    onClick={(e) => {
                        e.preventDefault();
                        if (ikUploadRef.current) {
                            // @ts-expect-error: IKUpload ref type does not include click(), but it is available at runtime
                            ikUploadRef.current?.click();
                        }
                    }}
                >
                    <Image
                        src="/admin/upload.svg"
                        alt="upload-icon"
                        width={20}
                        height={20}
                        className="object-contain"
                    />

                    <p className={cn("text-base", styles.placeholder)}>
                        {file.filePath ? 'Changer l\'image' : placeholder}
                    </p>

                    {file.filePath && (
                        <p className={cn("upload-filename text-sm", styles.text)}>
                            {file.filePath.length > 50 ? '...' + file.filePath.slice(-50) : file.filePath}
                        </p>
                    )}
                </button>

                {/* Barre de progression */}
                {progress > 0 && progress !== 100 && (
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300 flex items-center justify-center text-xs text-white" 
                            style={{ width: `${progress}%` }}
                        >
                            {progress > 20 && `${progress}%`}
                        </div>
                    </div>
                )}

                {/* Affichage de l'image */}
                {file.filePath && (
                    <div className="relative border rounded-lg overflow-hidden">
                        {/* Pour les URLs ImageKit */}
                        {file.filePath && !file.filePath.startsWith('http') ? (
                            <IKImage
                                alt={file.filePath ?? "uploaded image"}
                                path={file.filePath ?? undefined}
                                width={800}
                                height={300}
                                className="w-full h-48 object-cover"
                                onError={() => {
                                    toast.error("Image not found on server. Please upload again.");
                                    setFile({ filePath: null });
                                    onFileChange("");
                                }}
                            />
                        ) : (
                            /* Pour les URLs complètes */
                            <Image
                                src={file.url || file.filePath || ''}
                                alt="Image téléchargée"
                                className="w-full h-48 object-cover"
                                onError={() => {
                                    toast.error("Image not found. Please upload again.");
                                    setFile({ filePath: null });
                                    onFileChange("");
                                }}
                            />
                        )}
                        
                        {/* Bouton de suppression */}
                        <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        </ImageKitProvider>
    );
};

export default ImageUpload;