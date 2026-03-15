import { useState } from "react";
import { baseIngrediente } from "./ProdutoModal"
import { useItemSelecionado } from '@/app/store/pedido';


export default function ListaItems({ categoria, limite, conteudo, selecionadosParaPedido, setSelecionadosParaPedido, obrigatorio }: {
    categoria: string;
    obrigatorio: boolean;
    limite: number;
    conteudo: baseIngrediente[];
    selecionadosParaPedido: string[];
    setSelecionadosParaPedido: (selecionadosParaPedido: string[]) => void;
}) {

    // useItemSelecionado puxa do store (Zustand) a função 'itemSelecionado'.
    // Esta função será fundamental para integrar com a lógica de fechamento de pedido posteriormente.
    const { itemSelecionado } = useItemSelecionado();

    // 1. Filtramos o array global (selecionadosParaPedido) para contar APENAS os itens da categoria atual.
    // Isso nos permite ter limites independentes para cada Categoria (ex: 2 para Proteínas, 1 para Frutas).
    const itensDestaCategoria = selecionadosParaPedido.filter(itemId => itemId.startsWith(`${categoria}`));
    const limiteAtingido = itensDestaCategoria.length >= limite;

    const click = (id: string) => {

        // 2. Se a quantidade de itens destas categoria já chegou no limite estabelecido,
        // e o item clicado AINDA NÃO está selecionado, nós bloqueamos a ação (return).
        // Obs: Se o item já estiver selecionado, a execução continua para que o usuário possa desmarcá-lo.
        if (limiteAtingido && !selecionadosParaPedido.includes(id)) {
            return;
        }

        const novosSelecionados = selecionadosParaPedido.includes(id) // Se o id já estiver no array
            ? selecionadosParaPedido.filter((itemId) => itemId !== id) // Remove (filtra) o item
            : [...selecionadosParaPedido, id]; // Caso contrário, inclui o item no array

        // 4. Atualizamos o estado local (para refletir na interface do Modal)
        setSelecionadosParaPedido(novosSelecionados);
        console.log(id)

        // 5. Atualizamos o estado global no store Zustand (útil para o Checkout depois)
        itemSelecionado(id);
    }

    // Função para backdrop - seta e lógica
    // Componentes criados no mesmo arquivo devem ficar fora da função principal para não serem renderizados a todo momento
    const IconeSeta = ({ isOpen }: { isOpen: boolean }) => (
        <div className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m6 9 6 6 6-6" />
            </svg>
        </div>
    );

    const [isOpen, setIsOpen] = useState
        (true)

    const abrirCategoria = () => setIsOpen(!isOpen)

    {/* O texto na parte superior muda entre '*Obrigatório' e 'Opcional' */ }
    const statusTexto = obrigatorio ? "*Obrigatório" : "Opcional"
    {/* Cor difere também (Obrigatório é mais escuro, opcional mais claro) */ }
    const statusCor = obrigatorio ? "text-gray-800" : "text-gray-600"

    return (
        <>
            <div
                onClick={abrirCategoria}
                className="flex justify-between items-center gap-2 cursor-pointer select-none bg-gray-100 py-3 px-3 sm:px-4 rounded-xl hover:bg-gray-200 transition-colors mb-2"
            >
                <div className="flex items-baseline gap-1.5 sm:gap-2 shrink flex-wrap sm:flex-nowrap">
                    <h1 className="text-lg font-bold leading-tight">{categoria}</h1>
                    <span className="text-[11px] sm:text-xs font-normal text-gray-500 whitespace-nowrap shrink-0">
                        {limite === 1 ? '(Até 1 opção)' : `(Até ${limite} opções)`}
                    </span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
                    <span className={`text-[11px] sm:text-sm font-bold whitespace-nowrap ${statusCor}`}>
                        {statusTexto}
                    </span>
                    {/* Passamos para a setinha o conhecimento local: ela só vira se ESSE componente foi clicado */}
                    <IconeSeta isOpen={isOpen} />
                </div>
            </div>

            {isOpen && (
                <div>
                    {(conteudo as baseIngrediente[]).map((item) => {

                        const itemId = `${categoria}-${item.id}`;
                        const takesPart = selecionadosParaPedido.includes(itemId);
                        const isDisabled = limiteAtingido && !takesPart;
                        //console.log(selecionados)

                        // Formatação de Preço (ex: 10 -> R$10,00)
                        const precoFormatado = `R$${item.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

                        return (
                            //retorna um div para cada item do array

                            <div key={item.id} className={`flex flex-col py-2 border-b border-gray-300 transition-opacity duration-200 ${isDisabled ? 'opacity-40' : 'opacity-100'}`}>

                                {/* Container Clicável da Opção Inteira */}
                                <div
                                    onClick={() => click(itemId)}
                                    className={`flex justify-between items-center p-2 -mx-2 rounded-lg transition-colors
                                    ${takesPart ? 'bg-[#fafafa]' : 'bg-transparent'}
                                    ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'}`}
                                >
                                    <div className="flex flex-col">
                                        <span className={`text-xl leading-tight ${isDisabled ? 'text-gray-500' : 'text-black'}`}>{item.nome}</span>
                                        <span className={`text-sm mt-1 ${takesPart ? 'text-gray-700' : 'text-gray-400'}`}>
                                            {item.descricao}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <span className={`text-xl ${isDisabled ? 'text-gray-500' : 'text-black'}`}>{precoFormatado}</span>

                                        {/* Lógica Visual do Checkbox: */}
                                        {takesPart ? (
                                            <div className="text-2xl">
                                                ☑
                                            </div>
                                        ) : (
                                            <div className={`text-2xl ${isDisabled ? 'text-gray-400' : 'text-black'}`}>☐</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </>
    );
}