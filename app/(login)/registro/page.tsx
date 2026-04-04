'use client'

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { authClient } from "@/app/lib/auth-client";
import MensagemErro from "../components/MensagemErro";
import { useRouter } from 'next/navigation'
import Link from "next/link";
import { useEffect } from "react";

const formSchema = z.object({
    name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
    email: z.email("Email inválido"),
    password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    error: "As senhas não coincidem",
    path: ["confirmPassword"],
});


type UserFormSchema = z.infer<typeof formSchema>

export default function Registro() {

    const router = useRouter();


    const { register, handleSubmit, reset, formState: { errors } } = useForm<UserFormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        }
    })

    //resgatando dados do usuario para cad
    useEffect(() => {
        // // Pega a string do localStorage
        const dadosUSer = localStorage.getItem('dados')
        if (dadosUSer) {
            const data = JSON.parse(dadosUSer)

            reset({
                name: data.name,
                email: data.email,
                password: data.password,
                confirmPassword: data.confirmPassword,
            })
        }
    }, [])

    async function registraUser(data: UserFormSchema) {

        const { name, email, password } = data

        const { error: errorSignUp } = await authClient.signUp.email({
            name,
            email,
            password,
        })
        if (errorSignUp) {
            console.log("errorSignUp", errorSignUp)
            return
        }

        await authClient.emailOtp.sendVerificationOtp({
            email: email,
            type: "email-verification",
        });

        router.push("/login/verifica")

        //localstorage
        localStorage.setItem("dados", JSON.stringify(data));

        //salvar email em /verifica
        localStorage.setItem("emailUser", data.email.toString());

    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-200 transition-colors duration-500">
            <div className="max-w-md w-full bg-white/80 backdrop-blur-xl rounded-4xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] overflow-hidden p-8 space-y-6 relative z-10 border border-white/60 transition-all duration-300">
                <div className="text-center space-y-2 mt-2">
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 transition-all">
                        Criar uma conta
                    </h1>
                    <p className="text-sm text-slate-500 font-medium">
                        Preencha os detalhes abaixo para começar.
                    </p>
                </div>

                <form className="space-y-5 mt-6" onSubmit={handleSubmit(registraUser)} noValidate>
                    <div className="space-y-4 transition-all duration-500 overflow-hidden max-h-24 opacity-100">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-600 ml-1">Nome</label>
                            <input
                                type="text"
                                {...register("name")}
                                placeholder="Seu nome completo"
                                className="w-full px-5 py-3.5 rounded-2xl border border-slate-200/60 bg-white/50 text-slate-800 placeholder:text-slate-400 focus:ring-4 focus:ring-blue-100 focus:border-blue-400 focus:bg-white outline-none transition-all duration-300 shadow-sm"
                            />
                            <MensagemErro error={errors.name?.message} />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-600 ml-1">E-mail</label>
                        <input
                            type="email"
                            {...register("email")}
                            placeholder="voce@exemplo.com"
                            className="w-full px-5 py-3.5 rounded-2xl border border-slate-200/60 bg-white/50 text-slate-800 placeholder:text-slate-400 focus:ring-4 focus:ring-blue-100 focus:border-blue-400 focus:bg-white outline-none transition-all duration-300 shadow-sm"
                        />
                        <MensagemErro error={errors.email?.message} />
                    </div>

                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between ml-1">
                            <label className="text-sm font-semibold text-slate-600">Senha</label>
                        </div>
                        <input
                            type="password"
                            {...register("password")}
                            placeholder="••••••••"
                            className="w-full px-5 py-3.5 rounded-2xl border border-slate-200/60 bg-white/50 text-slate-800 placeholder:text-slate-400 focus:ring-4 focus:ring-blue-100 focus:border-blue-400 focus:bg-white outline-none transition-all duration-300 shadow-sm"
                        />
                        <MensagemErro error={errors.password?.message} />
                    </div>

                    <div className="space-y-4 transition-all duration-500 overflow-hidden max-h-24 opacity-100">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-600 ml-1">Confirmar Senha</label>
                            <input
                                type="password"
                                {...register("confirmPassword")}
                                placeholder="••••••••"
                                className="w-full px-5 py-3.5 rounded-2xl border border-slate-200/60 bg-white/50 text-slate-800 placeholder:text-slate-400 focus:ring-4 focus:ring-blue-100 focus:border-blue-400 focus:bg-white outline-none transition-all duration-300 shadow-sm"
                            />
                            <MensagemErro error={errors.confirmPassword?.message} />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold tracking-wide py-3.5 px-4 rounded-2xl transition-all duration-300 shadow-[0_8px_20px_-6px_rgba(37,99,235,0.4)] hover:shadow-[0_12px_24px_-8px_rgba(37,99,235,0.6)] focus:ring-4 focus:ring-blue-200 hover:-translate-y-0.5 mt-4"
                    >
                        Criar Conta Agora
                    </button>
                </form>

                <p className="text-center text-sm font-medium text-slate-500 pt-1 pb-1">
                    Já tem uma conta?{" "}
                    <Link
                        onClick={() => { localStorage.removeItem("dados"); localStorage.removeItem("emailUser") }}
                        href="/login"
                        className="font-bold text-blue-600 hover:text-blue-500 hover:underline transition-colors focus:outline-none"
                    >
                        Volte aqui.
                    </Link>
                </p>
            </div>
        </div>
    )
}