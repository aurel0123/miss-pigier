"use client"
import config from '@/lib/config';
import React, { useRef, useState } from 'react'
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
        const response = await fetch(`${config.env.apiEndpoint}/api/upload-auth/`);
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
    const [file, setFile] = useState<{ filePath: string | null }>({
        filePath: value ?? null,
    });
    const [progress, setProgress] = useState(0);

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
        setFile(res);
        // Envoyez l'URL complète plutôt que juste le filePath
        onFileChange(res.url || `${urlEndpoint}/${res.filePath}`);
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

            <button
                className={cn("upload-btn", styles.button)}
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

                <p className={cn("text-base pl-1", styles.placeholder)}>{placeholder}</p>

                {file.filePath && (
                    <p className={cn("upload-filename", styles.text)}>{file.filePath}</p>
                )}
            </button>

            {progress > 0 && progress !== 100 && (
                <div className="w-full rounded-full bg-green-200">
                    <div className="progress" style={{ width: `${progress}%` }}>
                        {progress}%
                    </div>
                </div>
            )}

            {file.filePath && (
                <IKImage
                    alt={file.filePath ?? "uploaded image"}
                    path={file.filePath ?? undefined}
                    width={800}
                    height={300}
                    onError={() => {
                        toast.error("Image not found on server. Please upload again.");
                        setFile({ filePath: null });
                        onFileChange("");
                    }}
                />
            )}
        </ImageKitProvider>
    );
};

export default ImageUpload;