import { create } from "zustand";
import { Pedido } from "../components/AddProduto/ProdutoModal";

interface CarrinhoItem {
    titulo: "Salada Personalizada";
    ingredientes: string[];
    valorTotal: number;
    qtd: number;
}

interface Carrinho {
    lista: CarrinhoItem[];
    addCarrinho: (pedido: Pedido) => void;
    attCarrinho: (pedido: Pedido, index: number) => void;
    dltCarrinho: (index: number) => void;
    limparCarrinho: () => void;
}

export const useCarrinhoStore = create<Carrinho>((set) => ({
    lista: [],
    addCarrinho: (pedido: Pedido) => set((state) => ({
        lista: [...state.lista, {
            titulo: "Salada Personalizada",
            ingredientes: pedido.ingredientes,
            valorTotal: pedido.valorTotal,
            qtd: pedido.qtd
        }]
    })),

    // array.splice(inicio, quantidadeParaRemover, item1, item2, ...)
    // inicio: O índice onde a alteração começa.
    // quantidadeParaRemover (opcional): Quantos elementos deletar a partir dali.
    // item1, item2, ... (opcional): Elementos para inserir no lugar.
    attCarrinho: (pedido: Pedido, index: number) => set((state) => {
        // 1. Criamos uma cópia rasa do array para manter a imutabilidade do React/Zustand
        const novaLista = [...state.lista];

        // 2. Usamos o splice na cópia: a partir do 'index', removemos 1 item e passamos o novo item
        novaLista.splice(index, 1, {
            titulo: "Salada Personalizada",
            ingredientes: pedido.ingredientes,
            valorTotal: pedido.valorTotal,
            qtd: pedido.qtd
        });

        // 3. Retornamos a nova lista atualizada, definindo lista como novaLista
        return { lista: novaLista };
    }),

    dltCarrinho: (index: number) => set((state) => ({
        lista: state.lista.filter((_, i) => i !== index)
    })),

    limparCarrinho: () => set((state) => ({
        lista: []
    }))
}));