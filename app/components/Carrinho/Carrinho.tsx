'use client'

import { lazy, useEffect, useState } from "react";

import { useCarrinhoStore } from "../../store/carrinho";

export default function Carrinho(
    { carrinhoAberto, setCarrinhoAberto }: { carrinhoAberto: boolean, setCarrinhoAberto: React.Dispatch<React.SetStateAction<boolean>> }) {
    // Estado para controlar a animação inicial quando aparece na tela
    const [animateIn, setAnimateIn] = useState(false);

    const { lista } = useCarrinhoStore();

    const modalCarrinho = () => {
        setCarrinhoAberto(!carrinhoAberto);
    }

    useEffect(() => {
        // Dispara a animação logo após o componente ser montado
        setAnimateIn(true);
    }, []);

    // -------------------------------------------------------------
    // CONTROLES DE ANIMAÇÃO DO BOTÃO
    // Edite as classes do Tailwind abaixo para mudar o comportamento
    // -------------------------------------------------------------

    // 1. Ao passar o mouse por cima (HOVER)
    // hover:scale-105 -> aumenta o tamanho do botão em 5%
    // experimente: hover:scale-110, hover:scale-125, hover:-translate-y-2
    const animacaoHover = "hover:scale-110";

    // 2. Ao clicar no botão (ACTIVE)
    // active:scale-95 -> diminui o botão em 5% passando sensação de clique pressionado
    // experimente: active:scale-90, active:bg-gray-800
    const animacaoClique = "active:scale-95";

    // 3. Suavidade das transições (TRANSITION)
    // transition-transform duration-200 -> define que as mudanças de tamanho (scale) vão demorar 200ms
    // experimente: duration-500, duration-700 para deixar mais lento.
    // ease-out -> faz o fim da animação desacelerar suavemente
    const suavidadeAcoes = "transition-all duration-300 ease-out";

    // 4. Animação de Entrada Inicial (PULO ÚNICO MENOR)
    // animate-[bounce-small_1s_ease-in-out_1.5] -> Chama a animação 'bounce-small' que definimos no globals.css para pular menos.
    // experimente mudar animate-[bounce-small... para:
    // animate-pulse (para piscar) ou animate-[spin_1s_linear_1] (para girar uma vez)
    const animacaoEntrada = animateIn ? "animate-[bounce-small_1s_ease-in-out_2.5]" : "";


    return (
        <>
            <button
                onClick={modalCarrinho}
                className={`
                    fixed bottom-6 right-6 z-40 
                    flex items-center justify-center 
                    w-16 h-16 bg-black text-white rounded-full shadow-lg cursor-pointer 
                    ${animacaoHover} 
                    ${animacaoClique} 
                    ${suavidadeAcoes} 
                    ${animacaoEntrada}
                `}
                aria-label="Ver carrinho"
            >
                {/* Ícone de Sacola / Carrinho */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-8 h-8"
                >
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>

                {/* Badge de quantidade com número 0 (círculo vermelho no canto superior) */}
                <span className="absolute top-0 right-0 flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 rounded-full border-2 border-white transform translate-x-1/4 -translate-y-1/4">
                    {lista.length}
                </span>
            </button>
        </>
    );
}