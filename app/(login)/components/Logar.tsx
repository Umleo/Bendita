import { authClient } from "@/app/lib/auth-client";
import { useForm } from "react-hook-form"
import "dotenv/config";
import { useNoPassword } from "../store/cadastro";


export default function Logar({ setNoPassword, setIsLogin }:
    {
        setNoPassword: (value: boolean) => void,
        setIsLogin: (value: boolean) => void
    }) 
    {
    
    const { setEmail } = useNoPassword()

    const { register, handleSubmit, formState: { errors }, getValues } = useForm()
    
    async function logarUser(data: any) {
        
        const { email, password } = data
        
        await authClient.signIn.email({
            email: email, // required
            password: password, // required
            rememberMe: true,
            callbackURL: process.env.NEXT_PUBLIC_URL_HOME
        });

    }

    function esqueciSenha() {

        const email = getValues("email");

        if (email) {
            setEmail(email)
        }
        setIsLogin(false)
        setNoPassword(true)
    }

    return (
        <>
            <form className="space-y-5 mt-8" onSubmit={handleSubmit(logarUser)}>
                <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-600 ml-1">E-mail</label>
                    <input
                        {...register("email")}
                        type="email"
                        placeholder="voce@exemplo.com"
                        className="w-full px-5 py-3.5 rounded-2xl border border-slate-200/60 bg-white/50 text-slate-800 placeholder:text-slate-400 focus:ring-4 focus:ring-blue-100 focus:border-blue-400 focus:bg-white outline-none transition-all duration-300 shadow-sm"
                    />
                </div>

                <div className="space-y-1.5">
                    <div className="flex items-center justify-between ml-1">
                        <label className="text-sm font-semibold text-slate-600">Senha</label>
                        <a
                            onClick={esqueciSenha}
                            className="text-xs font-semibold text-blue-500 hover:text-blue-700 hover:underline transition-colors">
                            Esqueceu a senha?
                        </a>
                    </div>
                    <input
                        {...register("password")}
                        type="password"
                        placeholder="••••••••"
                        className="w-full px-5 py-3.5 rounded-2xl border border-slate-200/60 bg-white/50 text-slate-800 placeholder:text-slate-400 focus:ring-4 focus:ring-blue-100 focus:border-blue-400 focus:bg-white outline-none transition-all duration-300 shadow-sm"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold tracking-wide py-3.5 px-4 rounded-2xl transition-all duration-300 shadow-[0_8px_20px_-6px_rgba(37,99,235,0.4)] hover:shadow-[0_12px_24px_-8px_rgba(37,99,235,0.6)] focus:ring-4 focus:ring-blue-200 hover:-translate-y-0.5 mt-4"
                >
                    Entrar na Conta
                </button>
            </form >
        </>
    )
}

