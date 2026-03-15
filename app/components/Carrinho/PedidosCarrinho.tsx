'use client'
import { useState } from "react";
import { useCarrinhoStore, useFreteStore } from "../../store/carrinho";
import EditProduto from "./EditProduto/EditProduto";

export default function PedidosCarrinho({ modalCarrinho }: { modalCarrinho: () => void }) {

    const { lista, dltCarrinho, limparCarrinho } = useCarrinhoStore();
    const { frete, cep, addFrete } = useFreteStore();

    const [editModal, setEditModal] = useState(false);
    const [itemIndex, setItemIndex] = useState<number>(0);

    const [inputFrete, setInputFrete] = useState<boolean>(false);
    const [editFrete, setEditFrete] = useState<boolean>(false);
    const [valorInput, setValorInput] = useState<string>("");

    const escolherEdit = (index: number) => {
        setItemIndex(index);
        setEditModal(true);
    }


    const deleteProduto = (index: number) => {
        dltCarrinho(index)
    }


    const showInputFrete = () => {
        setInputFrete(true)
        // const valor = Math.floor(Math.random() * 11)
        // addFrete(valor)
    }
    const calcularFrete = () => {
        const valor = Math.floor(Math.random() * 11)
        addFrete(valor, valorInput)

        editFrete && setEditFrete(false)
    }
    const editarFrete = () => {
        setEditFrete(true)
    }


    const finalizarPedido = () => {
        if (Number.isNaN(frete)) {
            alert("Calcule o frete")
            return
        }
        const valorTotalCarrinho = lista.reduce((acumulador, item) => acumulador + item.valorTotal, 0) + frete;
        //Post praa backend
        console.log(lista, valorTotalCarrinho)
        //
        modalCarrinho()
        limparCarrinho()
    }

    // Calcular o total geral do carrinho
    const subtotal = lista.reduce((acumulador, item) => acumulador + item.valorTotal, 0);
    const total = subtotal + frete

    return (
        //Fundo escuro/modal e alinhamento estilo aplicativo de delivery
        <div className="fixed inset-0 bg-gray-50/90 backdrop-blur-sm z-50 flex flex-col items-center overflow-hidden">
            {/* Modal Principal limitando largura como mobile */}
            <section className="flex flex-col h-dvh w-full max-w-lg bg-white relative shadow-2xl overflow-hidden">

                {/* 1. CABEÇALHO (com o nome da Loja) */}
                <header className="shrink-0 bg-white z-10 px-6 pt-4 pb-2 flex items-center justify-between border-b border-gray-200">
                    <h1 className="text-2xl font-bold text-black tracking-tight">Carrinho</h1>
                    {/* Botão de Fechar Apenas Visual por enquanto */}
                    <button
                        onClick={modalCarrinho}
                        className="text-gray-500 hover:text-black transition-colors rounded-full cursor-pointer"
                        aria-label="Fechar carrinho"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </header>

                <div className="flex-1 flex flex-col min-h-0">
                    {lista.length === 0 ? (
                        <div className="text-center py-20 text-gray-500">Seu carrinho está vazio</div>
                    ) : (
                        <>
                            {/* 2. INFORMAÇÕES DO ESTABELECIMENTO */}
                            <div className="px-6 py-2 flex items-center justify-between shrink-0">
                                <h2 className="text-[1.15rem] font-bold text-black">Bendita Salada</h2>
                                <span className="text-sm text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-md">
                                    Ativo
                                </span>
                            </div>

                            {/* 3. FAIXA CINZA COMPLETA DIVISORIA 1 */}
                            <div className="w-full h-px bg-[#f0f0f0] mb-2 shrink-0"></div>

                            {/* 4. MAP DOS ITENS ESCOLHIDOS */}
                            <div className="px-6 flex flex-col flex-1 overflow-y-auto min-h-0 pb-6">
                                {lista.map((item, index) => (
                                    <div key={index} className={`flex flex-col py-6 ${index === lista.length - 1 ? ("") : ("border-b border-gray-300 ")} gap-2 shrink-0`}>

                                        {/* Título e Valor Lado a Lado */}
                                        <div className="flex justify-between items-start mb-2">
                                            {/* Esquerda: Qtd, Título e Descrição */}
                                            <div className="flex flex-col gap-1 pr-4">
                                                <div className="flex items-start gap-3">
                                                    {/* Caixinha cinza da quantidade */}
                                                    <span className="bg-gray-100 text-gray-800 text-base font-bold px-3 py-1 rounded-md shrink-0">
                                                        {item.qtd}x
                                                    </span>
                                                    <span className="text-xl text-black font-bold leading-tight">{item.titulo}</span>
                                                </div>
                                                <span className="text-sm text-gray-500 pl-[3.2rem] leading-relaxed">
                                                    {item.ingredientes && item.ingredientes.length > 0
                                                        ? item.ingredientes.join(', ')
                                                        : 'Nenhum ingrediente'}
                                                </span>
                                            </div>

                                            {/* Direita: Preço e Imagem */}
                                            <div className="flex flex-col items-end gap-3 shrink-0">
                                                <span className="text-xl text-black font-bold">
                                                    R${item.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                </span>
                                                {/* Quadrado simulando imagem */}
                                                <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                                            </div>
                                        </div>

                                        {/* Botões Editar/Remover Lado a Lado em baixo, alinhados à direita ou esquerda */}
                                        <div className="flex justify-start items-center pl-[3.2rem]">
                                            <div className="flex gap-4">
                                                <button onClick={() => escolherEdit(index)} className="text-sm font-bold text-green-600 hover:text-green-700 cursor-pointer py-1">
                                                    Editar
                                                </button>
                                                <button onClick={() => deleteProduto(index)} className="text-sm font-bold text-red-600 hover:text-red-700 cursor-pointer py-1">
                                                    Remover
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* 5. BLOCO INFERIOR (Taxas, Subtotal e Botão Final) preso ao fim da section */}
                {lista.length > 0 && (
                    <div className="shrink-0 w-full max-w-lg bg-white z-50 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.08)] border-t border-gray-100 flex flex-col">

                        {/* FAIXA CINZA COMPLETA DIVISORIA 2 - TAXAS */}
                        <div className="w-full bg-[#f0f0f0] py-1 px-6 flex justify-between items-center rounded-t-3xl">
                            <p className="text-gray-800 text-[1.1rem] font-medium">
                                Taxa de Entrega
                            </p>

                            {/* Frete */}
                            <div className="flex items-center gap-2">
                                {frete >= 0 ?
                                    <>
                                        {/* Botão para editar frete */}
                                        {editFrete ?
                                            <>
                                                <input
                                                    type="text"
                                                    onChange={(e) => { setValorInput(e.target.value) }}
                                                    placeholder="CEP"
                                                    className="w-28 p-1.5 text-sm text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                                    maxLength={9}
                                                />
                                                <button
                                                    onClick={calcularFrete}
                                                    className="bg-green-500 hover:bg-green-600 text-white font-bold p-1.5 px-3 rounded-lg text-sm transition-colors cursor-pointer">
                                                    OK
                                                </button>
                                            </>
                                            :
                                            <>
                                                <span onClick={editarFrete} className="text-gray-800 underline underline-offset-2 font-extrabold text-[1.1rem]">{cep}</span>
                                                |
                                                <span className="text-green-600 font-bold text-[1.1rem]">
                                                    {frete === 0 ? "Grátis" : `R$ ${frete.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                                                </span>
                                            </>
                                        }



                                    </>
                                    :
                                    inputFrete ?
                                        <>
                                            <input
                                                type="text"
                                                onChange={(e) => { setValorInput(e.target.value) }}
                                                placeholder="CEP"
                                                className="w-28 p-1.5 text-sm text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                                maxLength={9}
                                            />
                                            <button
                                                onClick={calcularFrete}
                                                className="bg-green-500 hover:bg-green-600 text-white font-bold p-1.5 px-3 rounded-lg text-sm transition-colors cursor-pointer">
                                                OK
                                            </button>
                                        </>
                                        :
                                        <a onClick={showInputFrete} className="text-green-600 font-bold text-sm cursor-pointer underline underline-offset-2">
                                            Calcule o frete
                                        </a>
                                }
                            </div>
                        </div>

                        {/* Linha de Subtotal se Quiser */}
                        <div className="px-6 py-2 flex flex-col gap-2">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal pedidos</span>
                                <span>R${subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Taxa de entrega</span>
                                <span>{frete >= 0 ? `R$ ${frete.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : "A calcular"}</span>
                            </div>
                            {!total ?
                                <div className="flex justify-between text-black font-bold text-[1.15rem] mt-2 pt-2 border-t border-gray-200">
                                    <span>Total</span>
                                    <span>R${subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                </div>
                                :
                                <div className="flex justify-between text-black font-bold text-[1.15rem] mt-2 pt-2 border-t border-gray-200">
                                    <span>Total</span>
                                    <span>R${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                </div>
                            }
                        </div>

                        {/* 6. BOTÃO VERDE FINAL (Fixo embaixo, estilo iFood) */}
                        {lista.length > 0 && (
                            <div className="w-full bg-white p-2 pb-6 sm:p-5 sm:pb-8 z-50 border-t border-gray-100">
                                <button onClick={finalizarPedido} className="w-full flex items-center justify-between bg-green-500 hover:bg-green-600 transition-colors rounded-full px-6 py-4 shadow-sm cursor-pointer">
                                    <span className="text-[1.1rem] text-white font-bold">Fazer Pedido</span>
                                    {!total ?
                                        <span className="text-[1.1rem] text-white font-bold">
                                            {`R$${subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                                        </span>
                                        :
                                        <span className="text-[1.1rem] text-white font-bold">
                                            {`R$${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                                        </span>
                                    }
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </section>
            {editModal &&
                <EditProduto setEditModal={setEditModal} itemIndex={itemIndex} />
            }
        </div>
    );
}
