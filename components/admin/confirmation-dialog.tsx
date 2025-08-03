"use client"

import React from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from '../ui/button'

interface ConfirmationDialogProps {
    trigger: React.ReactNode
    title: string
    description: string
    confirmText?: string
    cancelText?: string
    onConfirm: () => void | Promise<void>
    isLoading?: boolean
    loadingText?: string
    variant?: 'default' | 'destructive'
    disabled?: boolean
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
    trigger,
    title,
    description,
    confirmText = "Confirmer",
    cancelText = "Annuler",
    onConfirm,
    isLoading = false,
    loadingText = "Chargement...",
    variant = 'default',
    disabled = false
}) => {
    const handleConfirm = async () => {
        if (!disabled && !isLoading) {
            await onConfirm()
        }
    }

    const getButtonVariant = () => {
        if (variant === 'destructive') {
            return "bg-red-600 hover:bg-red-700 text-white"
        }
        return "bg-blue-600 hover:bg-blue-700 text-white"
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {trigger}
            </AlertDialogTrigger>
            <AlertDialogContent className='bg-neutral-100 text-gray-900 border-transparent'>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isLoading} className=' text-gray-900 bg-neutral-200 hover:bg-neutral-200 hover:text-gray-900 p-2 rounded-md border-transparent'>
                        {cancelText}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleConfirm}
                        disabled={disabled || isLoading}
                        className={getButtonVariant()}
                    >
                        {isLoading ? loadingText : confirmText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default ConfirmationDialog 