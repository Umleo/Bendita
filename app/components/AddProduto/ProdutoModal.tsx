'use client';
import { useEffect, useState } from 'react';
import { useCarrinhoStore } from '@/app/store/carrinho';

// Tipagem de exemplo para os ingredientes

type baseIngrediente = {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  obrigatorio: boolean;
}

type Ingrediente = {
  Proteinas: baseIngrediente[],
  Acompanhamentos: baseIngrediente[],
  Frutas: baseIngrediente[]
};

export type Pedido = {
  valorTotal: number;
  qtd: number
  ingredientes: string[];
}

// Criar função do botao adicionar ao carrinho
// Criar variavel que assume interface carrinho
// definiir ingredientes igual na função addIngredientes
// definir demais valores atraves de pedido.[valor].


// Dados mockados para iterar e gerar os itens interativos
const INGREDIENTES_MOCK: Ingrediente[] = [{
  Proteinas: [
    { id: 1, nome: 'Proteínas', descricao: 'Item para a salada', preco: 10, obrigatorio: true },
    { id: 2, nome: 'preotirnas', descricao: 'Item para a salada', preco: 5, obrigatorio: false },
    { id: 3, nome: 'Proteinas 2', descricao: 'Item para a salada', preco: 2, obrigatorio: false },
    { id: 4, nome: 'preteina 3', descricao: 'Item para a salada', preco: 1, obrigatorio: false },
  ],
  Acompanhamentos: [
    { id: 1, nome: 'Acompanha', descricao: 'Item para a salada', preco: 10, obrigatorio: true },
    { id: 2, nome: 'Acompanhamento', descricao: 'Item para a salada', preco: 5, obrigatorio: false },
    { id: 3, nome: 'Acompanhando', descricao: 'Item para a salada', preco: 2, obrigatorio: false },
    { id: 4, nome: 'Acompanhou', descricao: 'Item para a salada', preco: 1, obrigatorio: false },
  ],
  Frutas: [
    { id: 1, nome: 'Fruta', descricao: 'Item para a salada', preco: 10, obrigatorio: true },
    { id: 2, nome: 'Frutas', descricao: 'Item para a salada', preco: 5, obrigatorio: false },
    { id: 3, nome: 'frutindo', descricao: 'Item para a salada', preco: 2, obrigatorio: false },
    { id: 4, nome: 'frutando', descricao: 'Item para a salada', preco: 1, obrigatorio: false },
  ]
}];


export default function ProdutoModal({ setProdutoModal }: { setProdutoModal: React.Dispatch<React.SetStateAction<boolean>> }) {

  // store carrinho
  const { lista, addCarrinho } = useCarrinhoStore();

  //gerais do pedido: qtd e valor
  const [pedido, setPedido] = useState<Pedido>();

  // Estado para armazenar os IDs dos itens selecionados (agora com categoria-id)
  const [selecionados, setSelecionados] = useState<string[]>([]);


  // Função para lidar com o clique em um item
  const itemSelecionado = (id: string) => {
    setSelecionados((prev) =>
      prev.includes(id) //se id estiver incluso no array retorna true
        ? prev.filter((itemId) => itemId !== id) // Se "true", filtra do array
        //filter vai criar um novo array com tudo que retornar true de sua condição.
        //neste caso, tudo que for "!==" diferente do nosso id, será (true)incluido nesse novo array.
        : [...prev, id] // Se "false", adiciona ao array
    );
  };


  // Função para adicionar o pedido ao carrinho
  const adicionaCarrinho = () => {
    addCarrinho!(pedido!)
    setProdutoModal(false)
  }


  // array.reduce((acumulador, itemAtual) => novoValor, valorInicial)
  // reduce() serve para tranformar o array em um unico valor
  // total → acumulador da soma
  // id → item atual do array
  // 0 → valor inicial
  const valorfinal = selecionados.reduce((total, selId) => {
    const [categoria, idStr] = selId.split('-');
    const id = parseInt(idStr, 10);
    const item = (INGREDIENTES_MOCK[0] as any)[categoria]?.find((i: baseIngrediente) => i.id === id);
    return total + (item ? item.preco : 0);
  }, 0);

  // Lidando com os pedidos
  const [mult, setMult] = useState<number>(1);

  const somar = () => { setMult(mult + 1); }

  const subtrair = () => { setMult(mult - 1); }

  useEffect(() => {
    if (mult <= 0) {
      setSelecionados([]);
      setMult(1);
    }
    const pedido: Pedido = {
      //precisamos passar ! para indicar ao TS que o valor retornado não sera undefined.
      ingredientes: selecionados.map((selId) => {
        const [categoria, idStr] = selId.split('-');
        const id = parseInt(idStr, 10);
        const item = (INGREDIENTES_MOCK[0] as any)[categoria]?.find((i: baseIngrediente) => i.id === id);
        return item ? item.nome : '';
      }).filter(Boolean),
      qtd: mult,
      valorTotal: valorfinal * mult
    }
    setPedido(pedido);

  }, [mult, valorfinal]);


  return (
    // Fundo fixo do modal cobrindo a tela toda com rolagem vertical
    // Centralizado para simular perfeitamente um mobile view de app de delivery
    <div className="fixed inset-0 bg-gray-50 z-50 overflow-y-auto flex flex-col items-center">

      {/* Container limitador estilo mobile (max-w-lg) compatível com o layout da main */}
      <section className="flex flex-col min-h-screen w-full max-w-lg bg-white relative shadow-2xl">

        {/* Botão de Fechar 
            Posicionado acima de tudo com um blur leve no fundo para garantir leitura sobre a imagem */}
        <button
          onClick={() => setProdutoModal(false)}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 transition-colors z-20 bg-white/70 backdrop-blur-md rounded-full p-1 cursor-pointer"
          aria-label="Fechar modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Topo: Espaço da Imagem (fundo cinza claro que preenche o topo) */}
        <div className="w-full h-72 bg-[#f0f0f0] flex items-center justify-center text-gray-500 shrink-0">
          <span className="text-sm font-medium">img</span>
        </div>

        {/* Área de Conteúdo do Card (fundo branco)
            Com margem negativa (-mt-8) e cantos arredondados extensos para saltar sobre a foto */}
        <div className="bg-white rounded-t-[2.5rem] grow -mt-8 pt-8 pb-12 flex flex-col relative z-10 w-full">

          {/* Título e Descrição 
              Fonte pesada no título e um pouco espaçada na descrição */}
          <div className="px-6 text-center space-y-2 mb-6">
            <h1 className="text-3xl sm:text-[2.2rem] font-bold text-black tracking-tight leading-tight">
              Salada Personalizada
            </h1>
            <p className="text-gray-800 text-lg sm:text-[1.15rem]">
              Descrição - tamanho - serve uma pessoa
            </p>
          </div>

          {/* Faixa Cinza com Instrução de Escolha
              Caixa inteiriça e com fundo cinza discreto para separar seções */}
          <div className="w-full bg-[#f0f0f0] py-4 px-6 mb-2">
            <p className="text-center text-gray-800 text-[1.15rem]">
              Escolha x quantidade de opções
            </p>
          </div>

          {/* Container da Lista de Opções/Ingredientes */}
          <div className="px-6 flex flex-col pt-2 pb-6">
            {/* Iterando sobre as categorias do mock */}
            {Object.entries(INGREDIENTES_MOCK[0]).map(([categoria, itens]) => (
              <div key={categoria} className="mb-6">
                <h1 className="text-2xl font-bold text-black mt-4 pb-2 ">{categoria}</h1>
                {(itens as baseIngrediente[]).map((item) => {
                  const itemId = `${categoria}-${item.id}`;
                  const takesPart = selecionados.includes(itemId);

                  // O texto na parte superior muda entre '*Obrigatório' e 'Opcional'
                  const statusTexto = item.obrigatorio ? "*Obrigatório" : "Opcional";
                  // Cor difere também (Obrigatório é mais escuro, opcional mais claro)
                  const statusCor = item.obrigatorio ? "text-gray-800" : "text-gray-600";

                  // Formatação de Preço (ex: 10 -> R$10,00)
                  const precoFormatado = `R$${item.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

                  return (
                    //retorna um div para cada item do array
                    <div key={item.id} className={`flex flex-col py-2 border-b border-gray-300`}>
                      <span className={`text-xs text-right mb-1 leading-none ${statusCor}`}>
                        {statusTexto}
                      </span>

                      {/* Container Clicável da Opção Inteira */}
                      <div
                        onClick={() => itemSelecionado(itemId)}
                        className={`flex justify-between items-center p-2 -mx-2 rounded-lg cursor-pointer transition-colors
                          ${takesPart ? 'bg-[#fafafa]' : 'bg-transparent hover:bg-gray-50'}`}
                      >
                        <div className="flex flex-col">
                          <span className="text-xl text-black leading-tight">{item.nome}</span>
                          <span className={`text-sm mt-1 ${takesPart ? 'text-gray-700' : 'text-gray-400'}`}>
                            {item.descricao}
                          </span>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="text-xl text-black">{precoFormatado}</span>

                          {/* Lógica Visual do Checkbox: */}
                          {takesPart ? (
                            <div className="text-2xl">
                              ☑
                            </div>
                          ) : (
                            <div className="text-2xl">☐</div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}

            {selecionados.length > 0 && (
              <div className="fixed bottom-2 left-1/2 -translate-x-1/2 w-[calc(100%-1rem)] max-w-lg bg-[#f0f0f0] p-3 pb-3 sm:p-5 sm:pb-5 z-50 rounded-3xl sm:rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
                <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
                  {/* Seletor de quantidade */}
                  <div className="flex items-center justify-between bg-white rounded-full px-3 py-2 sm:px-4 sm:py-3 min-w-[100px] sm:min-w-[130px] shadow-sm shrink-0">
                    <button onClick={subtrair} className="text-black shrink-0 flex items-center justify-center hover:opacity-80 transition-opacity">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 sm:w-7 sm:h-7" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="8" y1="12" x2="16" y2="12" />
                      </svg>
                    </button>
                    <span className="text-lg sm:text-xl font-medium text-black">{pedido?.qtd == null ? 1 : pedido?.qtd}</span>
                    <button onClick={somar} className="text-black shrink-0 flex items-center justify-center hover:opacity-80 transition-opacity">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 sm:w-7 sm:h-7" viewBox="0 0 24 24" fill="black">
                        <circle cx="12" cy="12" r="11" />
                        <path d="M12 7v10M7 12h10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>

                  {/* Botão Adicionar */}
                  <button onClick={adicionaCarrinho} className="flex-1 flex items-center justify-between bg-white rounded-full px-4 py-2 sm:px-6 sm:py-4 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors min-w-0">
                    <span className="text-[0.95rem] sm:text-[1.1rem] text-black font-medium truncate mr-2">Adicionar</span>
                    <span className="text-[0.95rem] sm:text-[1.1rem] text-black font-medium shrink-0">{`R$${pedido?.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

      </section>
    </div>
  );
}
