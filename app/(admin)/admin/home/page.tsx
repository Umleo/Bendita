type ItemPedido = {
    nome: string;
    ingredientes: string[];
    quantidade: number;
};

type Pedido = {
    nomeCliente: string;
    endereco: string;
    valorTotal: number;
    itens: ItemPedido[];
};

const pedidosFalsos: Record<string, Pedido> = {
    PEDIDO_001: {
        nomeCliente: "Ana Souza",
        endereco: "Rua das Flores, 120 - Centro",
        valorTotal: 89.9,
        itens: [
            {
                nome: "Pizza Marguerita",
                ingredientes: ["Molho de tomate", "Mussarela", "Manjericão"],
                quantidade: 1,
            },
            {
                nome: "Refrigerante 2L",
                ingredientes: ["Bebida gaseificada"],
                quantidade: 1,
            },
        ],
    },
    PEDIDO_002: {
        nomeCliente: "Carlos Lima",
        endereco: "Av. Brasil, 455 - Jardim América",
        valorTotal: 124.5,
        itens: [
            {
                nome: "Hambúrguer Artesanal",
                ingredientes: ["Pão brioche", "Carne 180g", "Queijo cheddar", "Bacon"],
                quantidade: 2,
            },
            {
                nome: "Batata Frita Grande",
                ingredientes: ["Batata", "Sal", "Molho especial"],
                quantidade: 1,
            },
        ],
    },
    PEDIDO_003: {
        nomeCliente: "Mariana Costa",
        endereco: "Rua do Sol, 78 - Vila Nova",
        valorTotal: 67,
        itens: [
            {
                nome: "Açaí 500ml",
                ingredientes: ["Açaí", "Granola", "Banana", "Leite em pó"],
                quantidade: 2,
            },
        ],
    },
};

export default function HomeAdmin() {
    return (
        <main className="min-h-screen bg-white p-8 text-black">
            <h1 className="mb-6 text-3xl font-bold">Pedidos</h1>

            <div className="space-y-6">
                {Object.entries(pedidosFalsos).map(([codigoPedido, pedido]) => (
                    <section key={codigoPedido} className="rounded-lg border border-gray-200 p-5 shadow-sm">
                        <h2 className="text-xl font-semibold">{codigoPedido}</h2>
                        <p className="mt-2"><strong>Nome do cliente:</strong> {pedido.nomeCliente}</p>
                        <p><strong>Endereço:</strong> {pedido.endereco}</p>
                        <p><strong>Valor total do pedido:</strong> R$ {pedido.valorTotal.toFixed(2)}</p>

                        <div className="mt-3">
                            <h3 className="font-semibold">Itens do pedido:</h3>
                            <ul className="mt-2 list-disc space-y-2 pl-5">
                                {pedido.itens.map((item) => (
                                    <li key={`${codigoPedido}-${item.nome}`}>
                                        <p><strong>Item:</strong> {item.nome}</p>
                                        <p><strong>Quantidade:</strong> {item.quantidade}</p>
                                        <p><strong>Ingredientes:</strong> {item.ingredientes.join(", ")}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>
                ))}
            </div>
        </main>
    );
}