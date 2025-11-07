"use client";

import { UsersProvider } from "@/app/admin/users/components/users-provider";
import { UsersPrimaryButtons } from './components/users-primary-buttons'
import { UsersTable } from "@/app/admin/users/components/users-table";
import {useUsers} from "@/hooks/use-users";
import {UsersDialogs} from "@/app/admin/users/components/users-dialogs";

export default function Page() {
    return (
        <UsersProvider>
            <UsersPageContent />
        </UsersProvider>
    );
}

function UsersPageContent() {
    const { users } = useUsers();
    return (
        <div className='flex flex-1 flex-col gap-4 sm:gap-6'>
            <div className='flex flex-wrap items-end justify-between gap-2'>
                <div>
                    <h2 className='text-2xl font-bold tracking-tight'>Liste des utilisateurs</h2>
                    <p className='text-muted-foreground'>
                        Gérez ici vos utilisateurs et leurs rôles.
                    </p>
                </div>
                <UsersPrimaryButtons />
            </div>
            <UsersTable data={users} />
            <UsersDialogs />
        </div>
    );
}
