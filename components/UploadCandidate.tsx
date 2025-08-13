"use client"
import config from '@/lib/config';
import React, { useRef, useState } from 'react'
import { IKImage, ImageKitProvider, IKUpload } from "imagekitio-next";
import { toast } from 'sonner';
import { ImageDown } from 'lucide-react';

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

const UploadCandidate = ({
    accept = "image/*",
    placeholder = "Cliquer pour téléverser l'image de la candidate",
    folder,
    onFileChange,
    value,
}: Props) => {
    
    const ikUploadRef = useRef(null);
    const [file, setFile] = useState<{ filePath: string | null }>({
        filePath: value ?? null,
    });
    const [progress, setProgress] = useState(0);

    const onError = (error: unknown) => {
        console.error("Upload error details:", error);
        toast.error("Échec du téléchargement d'image", {
            description: "Votre image n'a pas pu être téléchargée. Veuillez réessayer.",
        });
    };

    const onSuccess = (res: { filePath: string, url: string }) => {
        setFile(res);
        // Envoyez l'URL complète plutôt que juste le filePath
        onFileChange(res.url || `${urlEndpoint}/${res.filePath}`);
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

            <div className="space-y-2">
                {/* Zone d'upload */}
                <div
                    className="outline-2 outline-dashed outline-gray-300 w-full p-4 flex flex-col justify-center gap-2 items-center min-h-76 cursor-pointer hover:bg-gray-50 transition-colors relative bg-white rounded-lg"
                    onClick={(e) => {
                        e.preventDefault();
                        if (ikUploadRef.current) {
                            // @ts-expect-error: IKUpload ref type does not include click(), but it is available at runtime
                            ikUploadRef.current?.click();
                        }
                    }}
                >
                    {file.filePath ? (
                        <IKImage
                            alt={file.filePath ?? "uploaded image"}
                            path={file.filePath ?? undefined}
                            width={400}
                            height={300}
                            className="max-w-full max-h-48 object-cover rounded"
                            onError={() => {
                                toast.error("Image not found on server. Please upload again.");
                                setFile({ filePath: null });
                                onFileChange("");
                            }}
                        />
                    ) : (
                        <>
                            <ImageDown size={60} className="text-gray-400" />
                            <p className="text-sm font-light mt-4 text-center text-gray-600">
                                {placeholder}
                            </p>
                        </>
                    )}
                </div>

                {/* Barre de progression */}
                {progress > 0 && progress !== 100 && (
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300 flex items-center justify-center"
                            style={{ width: `${progress}%` }}
                        >
                            <span className="text-xs text-white font-medium">
                                {progress}%
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </ImageKitProvider>
    );
};

export default UploadCandidate;