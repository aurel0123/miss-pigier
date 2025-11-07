import {UsersContext} from '@/app/admin/users/components/users-provider'
import React from "react";

export const useUsers = () => {
    const context = React.useContext(UsersContext);
    if (!context) {
        throw new Error("useUsers must be used within a UsersProvider");
    }
    return context;
};