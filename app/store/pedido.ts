import { create } from "zustand";


interface ItemSelecionadoState {
    selecionados: string[];
    itemSelecionado: (id: string) => void;
    limparSelecionados: () => void;
}

export const useItemSelecionado = create<ItemSelecionadoState>((set) => ({
    selecionados: [],
    itemSelecionado: (id: string) => {
        set((state) => ({
            selecionados: state.selecionados.includes(id)
                ? state.selecionados.filter((itemId) => itemId !== id)
                : [...state.selecionados, id]
        }));
    },
    limparSelecionados: () => set({ selecionados: [] })
}));