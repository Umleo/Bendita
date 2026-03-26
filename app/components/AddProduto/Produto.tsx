'use client'

import { useState } from "react";
import ProdutoModal from "./ProdutoModal";
import { useCarrinhoStore } from "@/app/store/carrinho";
import IconeCarrinho from "../Carrinho/IconeCarrinho";

const SaladPlaceholder = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11l-1.06-1.06a1.5 1.5 0 010-2.12l.21-.21a1.5 1.5 0 012.12 0L12 8.586l.73-.73a1.5 1.5 0 012.12 0l.21.21a1.5 1.5 0 010 2.12L14 11m-4 0h4" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 7.5h16.5" />
    </svg>
);


export default function Produto() {

    const [produtoModal, setProdutoModal] = useState(false);

    const { lista } = useCarrinhoStore()

    return (
        <>
            <div onClick={() => setProdutoModal(true)} className="w-full max-w-lg bg-white rounded-3xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer">
                <div className="p-6 flex flex-col gap-4">
                    {/* Imagem do Produto */}
                    <div className="w-full h-30 bg-gray-50 rounded-2xl flex items-center justify-center">
                        <SaladPlaceholder />
                    </div>

                    <div className="flex items-start justify-between gap-4 mt-2">
                        <div className="flex flex-col">
                            <h2 className="text-2xl font-bold text-gray-900">Monte sua salada!</h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Escolha seus ingredientes favoritos.
                            </p>
                        </div>
                        {/* Preço */}
                        <div className="text-right shrink-0">
                            <span className="text-sm text-gray-500">A partir de</span>
                            <p className="text-2xl font-bold text-green-600">R$00,00</p>
                        </div>
                    </div>
                </div>
            </div>

            {produtoModal &&
                <ProdutoModal
                    setProdutoModal={setProdutoModal}
                />
            }

            {lista.length > 0 && produtoModal === false &&
                <IconeCarrinho />
            }

        </>
    )
}