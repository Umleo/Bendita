'use client'
import { useState } from "react";
import Produto from "./components/Produto";
import ProdutoModal from "./components/ProdutoModal";

// Using custom SVG components for more elegant placeholders
const CoverPlaceholder = () => (
  <svg className="w-16 h-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const ProfilePlaceholder = () => (
  <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

export default function Home() {
  
  const [lojaAberta,setLojaAberta] = useState(false);
  const [produtoModal, setProdutoModal] = useState(false);

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 bg-gray-50 text-gray-800">
      
      {/* Increased gap for better section separation */}
      <div className="flex flex-col items-center w-full gap-8">

        {/* 1. SEÇÃO DO CABEÇALHO (Perfil da Loja) */}
        {/* Softer shadow, no harsh borders, more vertical padding */}
        <section className="w-full max-w-lg bg-white rounded-3xl shadow-lg overflow-hidden flex flex-col items-center text-center">
          
          {/* Imagem de Capa - using a lighter gray background */}
          <div className="w-full h-36 bg-gray-100 flex items-center justify-center relative">
            <CoverPlaceholder />
          </div>

          {/* Foto de Perfil - smaller, softer border, adjusted overlap */}
          <div className="w-28 h-28 rounded-full bg-white border-4 border-white -mt-16 flex items-center justify-center z-10 relative shadow-md">
            <div className="w-full h-full rounded-full bg-gray-50 flex items-center justify-center">
                <ProfilePlaceholder /> 
            </div>
          </div>

          {/* Informações da Loja - increased spacing */}
          <div className="p-6 flex flex-col items-center gap-2">
            <h1 className="text-3xl font-bold text-gray-900">Bendita Salada</h1>
            
            <div className="flex items-center text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">Curitiba - PR</span>
            </div>

            {/* Status de Funcionamento - slightly smaller text, badge-like style */}
            {lojaAberta ? 
            <div className="mt-2 flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                  <p className="text-green-600 font-bold text-base">Aberto</p>
              </div>
              :
              <div className="mt-2 flex items-center gap-1">
                  <span className="relative flex h-3 w-3">
                      <span className=" absolute inline-flex h-full w-full rounded-full bg-red-800"></span>
                  </span>
                  <p className="text-red-600 font-bold text-base">Fechado</p>
              </div>
            }
            
            {/* Horário - more readable gray */}
            <p className="text-sm text-gray-500 mt-1">
              Atendimento das 14h às 22h
            </p>
          </div>
        </section>
        
        {/* 2. SEÇÃO DE CÁLCULO DE FRETE */}
        {/* Engaging and clear call-to-action */}
        {/* 2. SEÇÃO DE CÁLCULO DE FRETE */}
        <section className="w-full max-w-lg">
            <div className="flex flex-col sm:flex-row items-center justify-center w-full p-4 bg-white rounded-3xl shadow-lg gap-2 sm:gap-0">
                <input 
                    type="text" 
                    placeholder="Digite seu CEP" 
                    className="w-full sm:grow p-3 text-base border-2 border-gray-200 rounded-xl sm:rounded-l-xl sm:rounded-r-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
                <button className="w-full sm:w-auto flex items-center justify-center p-3 px-6 bg-green-500 text-white font-bold rounded-xl sm:rounded-r-xl sm:rounded-l-none hover:bg-green-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span>Calcular</span>
                </button>
            </div>
        </section>

        {/* 3. SEÇÃO DO PRODUTO (Card "Monte sua salada") */}
        {/* Added hover effect, softer shadow, consistent styling */}
        <section >
          <Produto 
            setProdutoModal={setProdutoModal}
          />  
        </section>

        {produtoModal &&
          <ProdutoModal 
            setProdutoModal={setProdutoModal}
          />
        }
        
      </div>
    </main>
  );
}
