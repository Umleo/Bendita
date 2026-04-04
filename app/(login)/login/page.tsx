"use client";

import { useState } from "react";
import Logar from "../components/Logar";
import NoPassword from "../components/noPassword";
import Link from "next/dist/client/link";

export default function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [noPassword, setNoPassword] = useState(false);

    const returnLogin = () => {
        if(isLogin && noPassword) {
            setNoPassword(false)
        }
        setIsLogin(!isLogin)
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-200 transition-colors duration-500">

            <div className="max-w-md w-full bg-white/80 backdrop-blur-xl rounded-4xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] overflow-hidden p-8 space-y-6 relative z-10 border border-white/60 transition-all duration-300">

                {/* Header */}
                <div className="text-center space-y-2 mt-2">
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 transition-all">
                        {isLogin ?
                            "Bem-vindo de volta" : noPassword ? "Redefinir senha" : "Criar uma conta"
                        }
                    </h1>
                    <p className="text-sm text-slate-500 font-medium">
                        {isLogin
                            ? "Insira suas credenciais para acessar sua conta." : noPassword ? "Digite seu e-mail para redefinir sua senha." : "Preencha os detalhes abaixo para começar."
                        }
                    </p>
                </div>

                {/* Formulário */}
                {isLogin ?
                    <Logar setNoPassword={setNoPassword} setIsLogin={setIsLogin} /> : noPassword ?
                            <NoPassword/> : ""
                }

                <p className="text-center text-sm font-medium text-slate-500 pt-3 pb-1">
                    {isLogin ?
                        "Ainda não tem uma conta?" : noPassword ? "Lembrou a senha?" : "Já tem uma conta?"
                    }{" "}
                    <button
                        type="button"
                        onClick={returnLogin}
                        className="font-bold text-blue-600 hover:text-blue-500 hover:underline transition-colors focus:outline-none"
                    >
                        {isLogin ?
                            <Link href="/registro">Inscreva-se</Link> : "Volte aqui."
                        }
                    </button>
                </p>

            </div>
        </div >
    );
}