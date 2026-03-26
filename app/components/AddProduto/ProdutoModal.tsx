'use client';
import { useEffect, useState } from 'react';
import { useCarrinhoStore } from '@/app/store/carrinho';
import ListaItems from './ListaItems';
import { useItemSelecionado } from '@/app/store/pedido';

// Tipagem de exemplo para os ingredientes

export type baseIngrediente = {
  id: number;
  nome: string;
  categoria: string;
  descricao: string;
  preco: number;
}

export type Ingrediente = {
  Proteínas: { opções: baseIngrediente[], obrigatorio: boolean, minimo?: number, maximo?: number },
  Acompanhamento: { opções: baseIngrediente[], obrigatorio: boolean, minimo?: number, maximo?: number },
  Frutas: { opções: baseIngrediente[], obrigatorio: boolean, minimo?: number, maximo?: number }
}

export type Pedido = {
  valorTotal: number;
  qtd: number
  ingredientes: string[];
}

// Dados mockados para iterar e gerar os itens interativos
export const INGREDIENTES_MOCK: Ingrediente[] = [{
  Proteínas: {
    opções: [
      { id: 1, nome: 'carrne', categoria: 'Proteínas', descricao: 'Item para a salada', preco: 10 },
      { id: 2, nome: 'frango', categoria: 'Proteínas', descricao: 'Item para a salada', preco: 5 },
      { id: 3, nome: 'frango 2', categoria: 'Proteínas', descricao: 'Item para a salada', preco: 2 },
      { id: 4, nome: 'frango 3', categoria: 'Proteínas', descricao: 'Item para a salada', preco: 1 },
    ], obrigatorio: true, minimo: 2, maximo: 3
  },
  Acompanhamento: {
    opções: [
      { id: 1, nome: 'arroz', categoria: 'Acompanhamento', descricao: 'Item para a salada', preco: 10 },
      { id: 2, nome: 'feijao', categoria: 'Acompanhamento', descricao: 'Item para a salada', preco: 5 },
      { id: 3, nome: 'feijao 2', categoria: 'Acompanhamento', descricao: 'Item para a salada', preco: 2 },
      { id: 4, nome: 'tomate', categoria: 'Acompanhamento', descricao: 'Item para a salada', preco: 1 },
    ], obrigatorio: true, minimo: 1, maximo: 2
  },
  Frutas: {
    opções: [
      { id: 1, nome: 'uva', categoria: 'Frutas', descricao: 'Item para a salada', preco: 10 },
      { id: 2, nome: 'maca', categoria: 'Frutas', descricao: 'Item para a salada', preco: 5 },
      { id: 3, nome: 'abacate', categoria: 'Frutas', descricao: 'Item para a salada', preco: 2 },
      { id: 4, nome: 'coco', categoria: 'Frutas', descricao: 'Item para a salada', preco: 1 },
    ], obrigatorio: false
  },
}];



export default function ProdutoModal({ setProdutoModal }: { setProdutoModal: React.Dispatch<React.SetStateAction<boolean>> }) {

  // store carrinho
  const { addCarrinho } = useCarrinhoStore();

  //gerais do pedido: qtd e valor
  const [pedido, setPedido] = useState<Pedido>();

  const [selecionadosParaPedido, setSelecionadosParaPedido] = useState<string[]>([]);

  const { selecionados, limparSelecionados } = useItemSelecionado();


  // Função para adicionar o pedido ao carrinho
  const adicionaCarrinho = () => {

    // 1. Array para guardar os alertas das categorias que não atingiram o mínimo
    const alertas: string[] = [];

    // 2. Iterar sobre todas as categorias obrigatórias
    //pega um objeto e separa em dois, chave e valor. No caso categoria como string, e valor como um objeto com as opções.
    Object.entries(INGREDIENTES_MOCK[0]).forEach(([categoria, itens]) => {
      if (itens.obrigatorio) {
        // Encontra quantos itens dessa categoria estão no pedido
        const qtdSelecionada = pedido?.ingredientes.filter(ingrediente =>
          ingrediente.startsWith(`${categoria} - `)
        ).length || 0;

        const minimoRequerido = itens.minimo || 1;

        // Se selecionou menos que o mínimo, adiciona à lista de alertas
        if (qtdSelecionada < minimoRequerido) {
          alertas.push(`- ${categoria} (mínimo de ${minimoRequerido} opç${minimoRequerido > 1 ? 'ões' : 'ão'})`);
        }
      }
    });

    // 3. Se houver alguma categoria faltando ou incompleta, exibe o alerta e barra
    if (alertas.length > 0) {
      return alert(`Por favor, complete as seguintes opções obrigatórias:\n\n${alertas.join('\n')}`);
    }

    addCarrinho!(pedido!)

    // Para limpar o pedido de fato, precisamos limpar os estados que formam o pedido
    limparSelecionados();       // Limpa o store do Zustand
    setSelecionadosParaPedido([]);   // Limpa o array local
    setMult(1);                 // Reseta o multiplicador

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
    const item = (INGREDIENTES_MOCK[0] as any)[categoria]?.opções?.find((i: baseIngrediente) => i.id === id);
    return total + (item ? item.preco : 0);
  }, 0);


  // Lidando com os pedidos
  const [mult, setMult] = useState<number>(1);

  const somar = () => { setMult(mult + 1); }

  const subtrair = () => { setMult(mult - 1); }

  // Este useEffect "assiste" as variáveis `mult` (multiplicador) e `valorfinal`.
  // LÓGICA DE RESET: Quando o multiplicador (`mult`) chega a 0 (via botão "subtrair"),
  // o sistema entende que o usuário desistiu das seleções atuais e limpa o formulário inteiro.
  useEffect(() => {
    if (mult <= 0) {
      limparSelecionados();       // 1. Limpa o array global da Store Zustand
      setSelecionadosParaPedido([]);   // 2. Limpa o array local do Modal
      setMult(1);                 // 3. Reseta o multiplicador de volta pra 1 (evita mostrar quantidade zero no UI)
    }
    const pedido: Pedido = {
      //precisamos passar ! para indicar ao TS que o valor retornado não sera undefined.
      ingredientes: selecionadosParaPedido.map((selId) => {
        const [categoria, idStr] = selId.split('-');
        const id = parseInt(idStr, 10);
        const item = (INGREDIENTES_MOCK[0] as any)[categoria]?.opções?.find((i: baseIngrediente) => i.id === id);
        return item ? `${item.categoria} - ${item.nome}` : '';
      }).filter(Boolean),
      qtd: mult,
      valorTotal: valorfinal * mult
    }

    setPedido(pedido);
    console.log(pedido)
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
              Selecione seus ingredientes abaixo
            </p>
          </div>

          {/* Container da Lista de Opções/Ingredientes */}
          <div className="px-6 flex flex-col pt-2 pb-6">
            {/* Iterando sobre as categorias do mock */}
            {Object.entries(INGREDIENTES_MOCK[0]).map(([categoria, itens]) => (
              <div key={categoria} className="mb-6">

                <h1 className="text-2xl font-bold text-black mt-4 pb-2 ">
                  <ListaItems
                    key={categoria}
                    obrigatorio={itens.obrigatorio}
                    categoria={categoria}
                    limite={itens.maximo || itens.opções.length} // Passando limite dinâmico de acordo com a categoria
                    conteudo={itens.opções}
                    selecionadosParaPedido={selecionadosParaPedido}
                    setSelecionadosParaPedido={setSelecionadosParaPedido}
                  />
                </h1>

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
