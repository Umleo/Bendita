import { authClient } from "@/app/lib/auth-client";
import Verificar from "./Verificar";
import z from "zod";
import { useNoPassword } from "../store/cadastro";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import MensagemErro from "./MensagemErro";


const schemaResetSenha = z.object({
    email: z.email("Email invalido"),
    password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
    confirmPassword: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
}).refine((data) => data.password === data.confirmPassword, {
    error: "As senhas não coincidem",
    path: ["confirmPassword"],
})

type SchemaResetSenha = z.infer<typeof schemaResetSenha>

export default function NoPassword({ setVerificar, setIsLogin, verificar }:
    {
        setVerificar: (value: boolean) => void,
        setIsLogin: (value: boolean) => void,
        verificar: boolean
    }) {

    const { register, handleSubmit, formState: { errors } } = useForm<SchemaResetSenha>({
        resolver: zodResolver(schemaResetSenha),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
        }
    })

    //store para reset senha
    const { setNoPassword, setEmail, setPassword } = useNoPassword()

    async function enviarEmail(data: SchemaResetSenha) {

        await authClient.emailOtp.sendVerificationOtp({
            email: data.email,
            type: "forget-password",
        });

        setEmail(data.email)
        setPassword(data.password)
        setNoPassword(true)

        setVerificar(true)

    }

    return (
        <>
            {!verificar ? (
                <form onSubmit={handleSubmit(enviarEmail)} noValidate>
                    <div className="space-y-4">
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
                            <label className="text-sm font-semibold text-slate-600 ml-1">Nova Senha</label>
                            <input
                                type="password"
                                {...register("password")}
                                placeholder="••••••••"
                                className="w-full px-5 py-3.5 rounded-2xl border border-slate-200/60 bg-white/50 text-slate-800 placeholder:text-slate-400 focus:ring-4 focus:ring-blue-100 focus:border-blue-400 focus:bg-white outline-none transition-all duration-300 shadow-sm"
                            />
                            <MensagemErro error={errors.password?.message} />
                        </div>
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
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold tracking-wide py-3.5 px-4 rounded-2xl transition-all duration-300 shadow-[0_8px_20px_-6px_rgba(37,99,235,0.4)] hover:shadow-[0_12px_24px_-8px_rgba(37,99,235,0.6)] focus:ring-4 focus:ring-blue-200 hover:-translate-y-0.5 mt-2">
                        Enviar
                    </button>
                </form>
            ) : (
                <Verificar setVerificar={setVerificar} setIsLogin={setIsLogin} />
            )}
        </>
    )
}