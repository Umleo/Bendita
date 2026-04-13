'use client';
import { authClient } from '@/app/lib/auth-client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface SessionType {
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export default function Login({ session }: { session: SessionType | null }) {
  // Estado para controlar a expansão do menu lado esquerdo
  const [isExpanded, setIsExpanded] = useState(false);

  const [logado, setLogado] = useState(false);

  useEffect(() => {
    if (session) {
      setTimeout(() => {
        setLogado(true);
      }, 0);
    }
  }, [session]);

  const handleSignOut = async () => {
    setLogado(false);
    await authClient.signOut();
    router.push('/');
  };

  const router = useRouter();

  return (
    <>
      <div className="fixed top-4 left-4 z-50 flex flex-col gap-2">
        {/* O Botão / Painel Expansível que anima a largura e altura */}
        <div
          className={`bg-white rounded-[28px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/80 transition-all duration-300 ease-in-out flex flex-col relative
                ${isExpanded ? `w-64 opacity-100 ${logado ? 'h-auto min-h-[220px]' : 'h-[200px]'}` : 'w-14 h-14 items-center justify-center overflow-hidden'}`}
        >
          {logado ? (
            <div
              className={`p-5 flex flex-col w-64 h-full transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none absolute'}`}
            >
              <div className="flex w-full justify-between items-center mb-1 mt-1">
                <h2 className="text-lg font-bold text-gray-900 ml-1">
                  Sua Conta
                </h2>
                {/* Botão de Fechar */}
                <button
                  onClick={() => setIsExpanded(false)}
                  className="cursor-pointer text-gray-400 hover:text-gray-800 p-1 transition-colors active:scale-95 rounded-full hover:bg-gray-100"
                  aria-label="Fechar menu"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="flex flex-col gap-4 flex-1 mt-2 mb-2">
                {/* User Profile Card */}
                <div className="flex items-center gap-3 p-2.5 bg-gray-50/80 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-base shadow-sm shrink-0">
                    {session?.user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="flex flex-col overflow-hidden pr-2">
                    <span className="font-semibold text-gray-800 text-sm truncate leading-tight">
                      {session?.user.name}
                    </span>
                    <span className="text-xs text-gray-500 truncate mt-0.5">
                      {session?.user.email}
                    </span>
                  </div>
                </div>

                {/* Container flexível para futuro conteúdo do usuário (ex: Meus Pedidos, Cupons, etc) */}
                <Link
                  href={`/you/${session?.user.id}`}
                  className="flex-1 flex flex-col gap-2 min-h-5"
                >
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 px-1">
                    Endereço cadastrado
                  </h3>

                  <div className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
                    <p className="text-sm font-semibold text-gray-800">
                      Endereço 1
                    </p>
                    <p className="mt-1 text-xs text-gray-600">
                      Rua das Palmeiras, 245
                    </p>
                  </div>
                </Link>

                <button
                  onClick={handleSignOut}
                  className="w-full mt-auto bg-white text-rose-600 border border-rose-100 hover:bg-rose-50 hover:border-rose-200 font-medium text-sm py-2.5 rounded-xl shadow-sm transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                    />
                  </svg>
                  Sair da Conta
                </button>
              </div>
            </div>
          ) : (
            <div
              className={`absolute top-0 left-0 p-5 flex flex-col w-64 transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            >
              <div className="flex w-full justify-between items-center mb-2 mt-4">
                <h2 className="text-lg font-bold text-gray-900 ml-1">
                  Sua Conta
                </h2>

                {/* Botão de Fechar */}
                <button
                  onClick={() => setIsExpanded(false)}
                  className="cursor-pointer text-gray-400 hover:text-gray-800 p-1 transition-colors active:scale-95"
                  aria-label="Fechar menu"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="flex flex-col gap-2.5">
                <p className="text-gray-500 text-xs mb-1 px-1 leading-tight">
                  Faça login para realizar seus pedidos.
                </p>

                <button
                  className="w-full mt-2 bg-black text-white font-medium text-base py-2.5 rounded-full shadow-sm hover:bg-gray-800 transition-colors active:scale-[0.98] cursor-pointer"
                  onClick={() => router.push('/login')}
                >
                  Fazer Login
                </button>
              </div>
            </div>
          )}
          {/* Ícone de Hamburger isolado, aparece apenas quando fechado */}
          <button
            onClick={() => setIsExpanded(true)}
            className={`absolute inset-0 flex flex-col justify-center items-center gap-1.25 cursor-pointer transition-opacity duration-300 hover:bg-gray-50
                    ${isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100 active:scale-95'}`}
            aria-label="Abrir menu"
          >
            <span className="w-5 h-0.5 bg-gray-500 rounded-full" />
            <span className="w-5 h-0.5 bg-gray-500 rounded-full" />
            <span className="w-5 h-0.5 bg-gray-500 rounded-full" />
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
    </>
  );
}
