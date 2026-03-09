"use client";
import { useState } from "react";

export default function Login() {
    // Estado para controlar a expansão do menu lado esquerdo
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="fixed top-4 left-4 z-50 flex flex-col gap-2">
            
            {/* O Botão / Painel Expansível que anima a largura e altura */}
            <div 
                className={`bg-white rounded-3xl shadow-lg border border-gray-100 transition-all duration-300 ease-in-out overflow-hidden flex flex-col relative
                ${isExpanded ? 'w-64 h-[260px] opacity-100' : 'w-14 h-14 items-center justify-center'}`}
            >
                {/* 
                    Adicionamos um container interno com largura e altura fixas.
                    Isso evita que o texto quebre linhas durante a animação e cause "saltinhos" na altura do painel.
                */}
                <div className={`absolute top-0 left-0 p-5 flex flex-col w-64 h-[260px] transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    
                    <div className="flex w-full justify-between items-center mb-4 mt-0">
                        <h2 className="text-lg font-bold text-gray-900 ml-1">
                            Sua Conta
                        </h2>
                        
                        {/* Botão de Fechar */}
                        <button
                            onClick={() => setIsExpanded(false)}
                            className="cursor-pointer text-gray-400 hover:text-gray-800 p-1 transition-colors active:scale-95"
                            aria-label="Fechar menu"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex flex-col gap-2.5">
                        <p className="text-gray-500 text-xs mb-1 px-1 leading-tight">
                            Faça login para salvar seus pedidos favoritos.
                        </p>
                        
                        <button className="w-full bg-black text-white font-medium text-base py-2.5 rounded-full shadow-sm hover:bg-gray-800 transition-colors active:scale-[0.98] cursor-pointer">
                            Fazer Login
                        </button>
                        
                        <button className="w-full bg-white text-black border-2 border-gray-200 font-medium text-base py-2.5 rounded-full hover:border-gray-300 hover:bg-gray-50 transition-colors active:scale-[0.98] cursor-pointer">
                            Registrar
                        </button>
                    </div>
                </div>

                {/* Ícone de Hamburger isolado, aparece apenas quando fechado */}
                <button
                    onClick={() => setIsExpanded(true)}
                    className={`absolute inset-0 flex flex-col justify-center items-center gap-[5px] cursor-pointer transition-opacity duration-300 hover:bg-gray-50
                    ${isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100 active:scale-95'}`}
                    aria-label="Abrir menu"
                >
                    <span className="w-5 h-[2px] bg-gray-500 rounded-full" />
                    <span className="w-5 h-[2px] bg-gray-500 rounded-full" />
                    <span className="w-5 h-[2px] bg-gray-500 rounded-full" />
                </button>
            </div>

            {/* Fundo escurecido apenas para dim/clique pra fora (opcional) */}
            {isExpanded && (
                <div 
                    className="fixed inset-0 bg-gray-900/10 backdrop-blur-[1px] -z-10 transition-opacity"
                    onClick={() => setIsExpanded(false)} // Fecha ao clicar fora
                    aria-hidden="true"
                />
            )}
        </div>
    );
}