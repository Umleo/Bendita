import { create } from 'zustand';

interface AuthCadastro {
    formData: {
        name?: string;
        email?: string;
        password?: string;
        confirmPassword?: string;
    };
    setFormData: (data: AuthCadastro['formData']) => void;
    clearFormData: () => void;
}

export const useAuthCadastro = create<AuthCadastro>((set) => ({
    formData: {},
    setFormData: (data) => set((state) => ({
        formData: { ...state.formData, ...data }
    })),
    clearFormData: () => set({ formData: {} }),
}))

export const useNoPassword = create<{ noPassword: boolean, setNoPassword: (value: boolean) => void, email: string, setEmail: (email: string) => void, clearEmail: () => void, password: string, setPassword: (password: string) => void }>((set) => ({
    //reset senha?
    noPassword: false,
    setNoPassword: (value) => set({ noPassword: value }),
    //email para resetar
    email: "",
    setEmail: (email) => set({ email }),
    clearEmail: () => set({ email: "", password: "" }),
    //senha para resetar
    password: "",
    setPassword: (password) => set({ password })
}))

