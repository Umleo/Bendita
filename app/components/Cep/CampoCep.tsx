'use client'

import { useFreteStore } from "@/app/store/carrinho"
import { useState } from "react"

export default function CampoCep() {

    const [valorCep, setValorCep] = useState<string>("")

    const { frete, cep, addFrete } = useFreteStore()

    const calculoFrete = () => {
        const valor = Math.floor(Math.random() * 2)
        const cep = valorCep
        addFrete(valor, cep)
    }


    return (
        <>
            <section className="w-full max-w-lg">
                <div className="flex flex-col w-full p-4 bg-white rounded-3xl shadow-lg gap-4">
                    <div className="flex flex-col sm:flex-row items-center justify-center w-full gap-2 sm:gap-0">
                        <input
                            type="text"
                            placeholder="Digite seu CEP"
                            onChange={(e) => { setValorCep(e.target.value) }}
                            className="w-full sm:grow p-3 text-base border-2 border-gray-200 rounded-xl sm:rounded-l-xl sm:rounded-r-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        />

                        <button onClick={calculoFrete} className="w-full sm:w-auto flex items-center justify-center p-3 px-6 bg-green-500 text-white font-bold rounded-xl sm:rounded-r-xl sm:rounded-l-none hover:bg-green-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            <span>Calcular</span>
                        </button>
                    </div>

                    {/* Resultado do Frete - Embaixo do input, mesmo card */}
                    {frete >= 0 && (
                        <div className="flex items-center justify-between w-full px-2 py-3 border-t border-gray-100 animate-fade-in-up">
                            <div className="flex items-center gap-2 text-gray-700">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H14a1 1 0 001-1v-2.31l-3-4.5H5.8A2.8 2.8 0 003 5.4V4zM16 8.5l3 4.5V15a1 1 0 01-1 1h-1.05a2.5 2.5 0 01-2.9-1.95V8.5H16z" />
                                </svg>
                                <span className="font-medium">Valor da entrega:</span>
                            </div>
                            <span className="font-bold text-lg text-green-600">{frete === 0 ? "Grátis" : `R$ ${frete.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}</span>
                        </div>
                    )}
                </div>
            </section>
        </>
    )
}