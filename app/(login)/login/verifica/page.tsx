'use client'

import { authClient } from "@/app/lib/auth-client";
import { useState, useRef, KeyboardEvent, ClipboardEvent, useEffect } from "react";
import { useNoPassword } from "../../store/cadastro";
import { useRouter } from 'next/navigation'
import Link from "next/dist/client/link";

export default function Verifica() {
    const router = useRouter()

    const [code, setCode] = useState<string[]>(Array(6).fill(""));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // 60 segundos de espera por padrão
    const [timeLeft, setTimeLeft] = useState(180);

    //esqueceu senha
    const { noPassword, setNoPassword, clearEmail, password } = useNoPassword()


    //email para renderizar no html sem erro de Hydration
    const [emailHTML, setEmailHTML] = useState("");
    const emailUsuario = typeof window !== "undefined" ? localStorage.getItem("emailUser") || "" : "";
    useEffect(() => {

        setTimeout(() => {
            setEmailHTML(emailUsuario);
        }, 0);

    })

    // Verifica se o código expirou ao montar o componente
    useEffect(() => {

        const tempo = localStorage.getItem("codigoExpirado")

        if (tempo) {
            const restante = Math.ceil((Number(tempo) - Date.now()) / 1000)
            setTimeout(() => {
                setTimeLeft(restante);
            }, 0);
            return
        }

        const reenvio = Date.now() + 60 * 3000;
        localStorage.setItem("codigoExpirado", reenvio.toString());

    }, [])

    useEffect(() => {
        if (timeLeft <= 0) return;

        const timerId = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timerId);
    }, [timeLeft]);


    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;

        const newCode = [...code];
        // Pega apenas o último caractere, caso insira múltiplos acidentalmente
        newCode[index] = value.slice(-1);
        setCode(newCode);

        // Move o foco para o próximo input se inseriu algo e não é o último
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace') {
            if (!code[index] && index > 0) {
                // Move o foco para o anterior se o atual estiver vazio
                inputRefs.current[index - 1]?.focus();
            } else {
                // Limpa o input atual
                const newCode = [...code];
                newCode[index] = "";
                setCode(newCode);
            }
        } else if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        } else if (e.key === 'ArrowRight' && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text/plain").replace(/\D/g, "");
        if (!pastedData) return;

        const newCode = [...code];
        for (let i = 0; i < 6; i++) {
            if (pastedData[i]) {
                newCode[i] = pastedData[i];
            }
        }
        setCode(newCode);

        // Foca no input correspondente (último preenchido ou o próximo vazio)
        const focusIndex = Math.min(pastedData.length, 5);
        inputRefs.current[focusIndex]?.focus();
    };

    const validarEmail = async () => {

        const { data, error } = await authClient.emailOtp.verifyEmail({
            email: emailUsuario,
            otp: code.join(""),
        });
        if (error) {
            console.log("erro", error)
            alert("Código inválido/expirado!")
            return
        }
        if (data) {
            console.log("data", data)
        }

        localStorage.clear();

    };

    const renviarCodigo = async () => {
        if (timeLeft > 0) return;

        if (noPassword) {
            await authClient.emailOtp.sendVerificationOtp({
                email: emailUsuario,
                type: "forget-password",
            });
            console.log("resetando senha")
        } else {
            await authClient.emailOtp.sendVerificationOtp({
                email: emailUsuario,
                type: "email-verification",
            });
        }

        const reenvio = Date.now() + 60 * 3000;
        localStorage.setItem("codigoExpirado", reenvio.toString());
        setTimeLeft(180);
    };

    const resetSenha = async () => {
        const { data, error } = await authClient.emailOtp.resetPassword({
            email: emailUsuario,
            otp: code.join(""),
            password: password,
        })
        if (error) {
            console.log("erro", error)
            alert("Erro ao redefinir a senha")
            return
        }
        if (data) {
            console.log("data", data)
            clearEmail()
            setNoPassword(false)
        }

        localStorage.clear();
    }

    const retorno = async () => {
        localStorage.removeItem("codigoExpirado")

    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-white transition-colors duration-500">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] p-8 space-y-6 border border-neutral-100">
                <div className="flex flex-col items-center gap-6 w-full mx-auto">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-neutral-800 mb-2">Verificar Código</h1>
                        <p className="text-neutral-500 text-sm">
                            Insira o código de 6 dígitos que enviamos para <span className="font-bold text-blue-500 underline decoration-blue-600 underline-offset-3">{emailHTML}</span>.
                        </p>
                    </div>

                    <div className="flex gap-2 sm:gap-3 mt-4" dir="ltr">
                        {code.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => {
                                    inputRefs.current[index] = el;
                                }}
                                type="text"
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                onPaste={handlePaste}
                                className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-semibold border-2 border-neutral-200 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none transition-all text-black"
                            />
                        ))}
                    </div>
                    <button
                        onClick={renviarCodigo}
                        disabled={timeLeft > 0}
                        className="focus:outline-none mt-2"
                    >
                        <span className={`underline underline-offset-4 transition-colors ${timeLeft > 0 ? "text-neutral-400 decoration-neutral-400 cursor-not-allowed" : "text-black decoration-black hover:text-neutral-700 hover:decoration-neutral-700"}`}>
                            Reenviar Código {
                                timeLeft > 0 && `(${timeLeft}s)`}
                        </span>
                    </button>

                    <button
                        onClick={noPassword ? resetSenha : validarEmail}
                        disabled={code.some(digit => digit === "")}
                        className="mt-2 w-full py-3.5 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-500 disabled:bg-neutral-300 disabled:text-neutral-700 disabled:cursor-not-allowed transition-colors"
                    >
                        {noPassword ? "Redefinir Senha" : "Validar Código"}
                    </button>

                    <Link href={noPassword ? "/login" : "/registro"} onClick={() => { localStorage.removeItem("codigoExpirado") }}
                        className=" gap-1 w-full flex justify-center text-sm text-neutral-500 hover:text-neutral-700 transition-colors mt-4">
                        Email incorreto? Volte para {noPassword ?
                            <p className="underline underline-offset-3 text-blue-600 "> Login</p> :
                            <p className="underline underline-offset-3 text-blue-600 "> Registro</p>}
                    </Link>

                </div>
            </div>
        </div>
    );
}