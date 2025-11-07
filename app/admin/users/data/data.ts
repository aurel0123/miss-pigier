import {Shield, UserCheck, Users} from "lucide-react";

export const roles = [
    {
        label: 'Admin',
        value: 'superadmin',
        icon: Shield,
    },
    {
        label: 'Subadmin',
        value: 'subadmin',
        icon: UserCheck,
    },
    {
        label: 'Responsable',
        value: 'responsable',
        icon: Users,
    },
] as const

export const callTypes ={
    true : 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200',
    false :  'bg-neutral-300/40 border-neutral-300'
}

