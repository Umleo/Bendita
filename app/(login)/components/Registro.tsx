import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { authClient } from "@/app/lib/auth-client";
import MensagemErro from "./MensagemErro";
import { useAuthCadastro } from "../store/cadastro";

const formSchema = z.object({
    name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
    email: z.email("Email invalido"),
    password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    error: "As senhas não coincidem",
    path: ["confirmPassword"],
});


type UserFormSchema = z.infer<typeof formSchema>


export default function Registro({ setVerificar }: { setVerificar: (value: boolean) => void }) {

    const { formData, setFormData } = useAuthCadastro()

    const { register, handleSubmit, formState: { errors } } = useForm<UserFormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            confirmPassword: formData.confirmPassword,
        }
    })

    async function registraUser(data: UserFormSchema) {

        const { name, email, password, confirmPassword } = data

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

        setFormData({ email, name, password, confirmPassword })
        setVerificar(true)
    }

    return (
        <>
            <form className="space-y-5 mt-8" onSubmit={handleSubmit(registraUser)} noValidate>
                <div className={`space-y-4 transition-all duration-500 overflow-hidden max-h-24 opacity-100`}>
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

                <div className={`space-y-4 transition-all duration-500 overflow-hidden max-h-24 opacity-100`}>
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

        </>
    )
}