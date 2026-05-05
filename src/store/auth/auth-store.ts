import { create } from "zustand";

type AuthAction = {
    isRolePublisher: () => boolean;
}

type AuthState = {
    actions: AuthAction
}

const checkRoleIsPublisher = () => {
    const userRole = localStorage.getItem('userRole');
    if (!userRole) return false;
    const normalizedRole = userRole.toLowerCase().trim();
    const isRolePublisher = normalizedRole === 'publisher' || normalizedRole.includes('publisher');

    return isRolePublisher;
};

const useAuthStore = create<AuthState>((set) => ({
    actions: {
        isRolePublisher: () => checkRoleIsPublisher()
    }
}));

export const useAuthActions = () => useAuthStore((state) => state.actions);
