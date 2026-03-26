"use client";

import { authClient } from "@/app/lib/auth-client";
import { useState, useRef, KeyboardEvent, ClipboardEvent, useEffect } from "react";
import { useAuthCadastro, useNoPassword } from "../store/cadastro";

export default function Verificar({ setVerificar, setIsLogin }: {
    setVerificar: (value: boolean) => void,
    setIsLogin: (value: boolean) => void,
}) {
    const [code, setCode] = useState<string[]>(Array(6).fill(""));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    //dados do usuario
    const { formData, clearFormData } = useAuthCadastro()

    //esqueceu senha
    const { noPassword, setNoPassword, email, clearEmail, password } = useNoPassword()

    const [timeLeft, setTimeLeft] = useState(60); // 60 segundos de espera por padrão

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

    const handleValidar = async () => {

        const { data, error } = await authClient.emailOtp.verifyEmail({
            email: formData.email!,
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
        //limpando o formulário
        clearFormData()

        //retornando para página de login
        setVerificar(false)
        setIsLogin(true)

    };

    const renviarCodigo = async () => {
        if (timeLeft > 0) return;

        if (noPassword) {
            await authClient.emailOtp.sendVerificationOtp({
                email: email,
                type: "forget-password",
            });
            console.log("resetando senha")
        } else {
            await authClient.emailOtp.sendVerificationOtp({
                email: formData.email!,
                type: "email-verification",
            });
        }

        setTimeLeft(60);
    };

    const resetSenha = async () => {
        const { data, error } = await authClient.emailOtp.resetPassword({
            email: email,
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
            setVerificar(false)
            setIsLogin(true)
        }
    }

    return (
        <div className="flex flex-col items-center gap-6 p-4 w-full max-w-md mx-auto">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-neutral-800 mb-2">Verificar Código</h1>
                <p className="text-neutral-500 text-sm">
                    Insira o código de 6 dígitos que enviamos para <span className="font-bold text-blue-500 underline decoration-blue-600 underline-offset-3">{noPassword ? email : formData.email}</span>.
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
                <span className={`underline underline-offset-3 transition-colors ${timeLeft > 0 ? "text-neutral-400 decoration-neutral-400 cursor-not-allowed" : "text-black decoration-black hover:text-neutral-700 hover:decoration-neutral-700"}`}>
                    Reenviar Código {timeLeft > 0 && `(${timeLeft}s)`}
                </span>
            </button>

            <button
                onClick={noPassword ? resetSenha : handleValidar}
                disabled={code.some(digit => digit === "")}
                className="mt-2 w-full py-3.5 px-4 bg-black text-white font-medium rounded-lg hover:bg-neutral-800 disabled:bg-neutral-300 disabled:text-neutral-700 disabled:cursor-not-allowed transition-colors"
            >
                {noPassword ? "Redefinir Senha" : "Validar Código"}
            </button>
        </div>
    );
}
