import { create } from 'zustand';

export const useNoPassword = create<{
    noPassword: boolean, setNoPassword: (value: boolean) => void,
    email: string, setEmail: (email: string) => void, clearEmail: () => void,
    password: string, setPassword: (password: string) => void
}>((set) => (
    {
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
    }
))

