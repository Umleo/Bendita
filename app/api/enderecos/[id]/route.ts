import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // Este 'id' vem do nome da pasta [id]

  try {

    const enderecos = await prisma.endereco.findMany({
      where: {
        userId: id // Filtra os endereços pelo 'userId' usando o 'id' da URL
      }
    });
    return NextResponse.json(enderecos);

  } catch (error) {
    console.error("Erro ao buscar endereços:", error);
    return NextResponse.json({ error: "Erro ao buscar endereços" }, { status: 500 });
  }

}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // Este 'id' vem do nome da pasta [id]

  const { titulo, rua, numero, bairro, complemento, cep } = await request.json();

  const novoEndereco = await prisma.endereco.create({
    data: {
      titulo,
      rua,
      numero,
      bairro,
      complemento,
      cep,
      userId: id // Relaciona o endereço ao usuário usando o 'id' da URL
    }
  });

  return NextResponse.json(novoEndereco);
}

