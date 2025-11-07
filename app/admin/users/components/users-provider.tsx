"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import useDialogState from "@/hooks/use-dialog-state";
import { type User } from "@/types";
import { toast } from "sonner";

type UsersDialogType = "invite" | "add" | "edit" | "delete";

type UsersContextType = {
    open: UsersDialogType | null;
    setOpen: (str: UsersDialogType | null) => void;
    currentRow: User | null;
    setCurrentRow: React.Dispatch<React.SetStateAction<User | null>>;
    users: User[];
    refreshUsers: () => Promise<void>;
};

export const UsersContext = React.createContext<UsersContextType | null>(null);

export function UsersProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useDialogState<UsersDialogType>(null);
    const [currentRow, setCurrentRow] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>([]);

    const refreshUsers = useCallback(async () => {
        try {
            const res = await fetch("/api/admin/getUsers");
            const data = await res.json();
            if(!data.success) throw  new Error(data.error)
            setUsers(data.data)
        } catch (err) {
            toast.error("Problème réseau lors de la récupération");
        }
    }, []);

    useEffect(() => {
        refreshUsers();
    }, [refreshUsers]);

    const values = useMemo(
        () => ({
            open,
            setOpen,
            currentRow,
            setCurrentRow,
            users,
            refreshUsers,
        }),
        [open, setOpen, currentRow, setCurrentRow, users, refreshUsers]
    );

    return <UsersContext.Provider value={values}>{children}</UsersContext.Provider>;
}


