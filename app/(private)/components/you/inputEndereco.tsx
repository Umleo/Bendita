'use client'

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { useRouter } from "next/navigation";

const formSchema = z.object({
    titulo: z.string().min(3, "Título deve ter pelo menos 3 caracteres"),
    rua: z.string().min(3, "Rua deve ter pelo menos 3 caracteres"),
    numero: z.string().min(1, "Número é obrigatório"),
    bairro: z.string().min(3, "Bairro deve ter pelo menos 3 caracteres"),
    complemento: z.string().optional(),
    cep: z.string().min(9, "CEP deve ter pelo menos 9 caracteres"),
})

type EnderecoFormSchema = z.infer<typeof formSchema>

type SessionType = {
    session: {
        user: {
            id: string;
        }
    };
}

export default function InputEndereco(session: SessionType) {

    const router = useRouter();

    const id = session.session.user.id;

    const { register, handleSubmit } = useForm<EnderecoFormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            titulo: "",
            rua: "",
            numero: "",
            bairro: "",
            complemento: "",
            cep: "",
        }
    })

    async function newEndereco(data: EnderecoFormSchema) {
        const { titulo, rua, numero, bairro, complemento, cep } = data

        await axios.post(`http://localhost:3000/api/enderecos/${id}`,
            { titulo, rua, numero, bairro, complemento, cep }
        )

        router.refresh();
    }

    return (
        <>
            <form onSubmit={handleSubmit(newEndereco)} className="space-y-4">
                <div className="grid flex-1 gap-3 sm:grid-cols-3">
                    <input
                        type="text"
                        {...register("titulo")}
                        placeholder="Título (ex: Casa)"
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 sm:col-span-1"
                    />
                    <input
                        type="text"
                        {...register("rua")}
                        placeholder="Rua"
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 sm:col-span-2"
                    />
                    <input
                        type="text"
                        {...register("numero")}
                        placeholder="Número"
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                    />
                    <input
                        type="text"
                        {...register("bairro")}
                        placeholder="Bairro"
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 sm:col-span-2"
                    />
                    <input
                        type="text"
                        {...register("complemento")}
                        placeholder="Complemento"
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition-all duration-300 placeholder:text-slate-40₀ focus:border-blue-4₀ focus:ring-4 focus:ring-blue-1₀ sm:col-span-2"
                    />
                    <input
                        type="text"
                        {...register("cep")}
                        placeholder="CEP"
                        className="w-full rounded-xl border border-slate-20０ bg-white px-4 py-2.5 text-sm text-slate-8０ outline-none transition-all duration-3₀₀ placeholder:text-slate-4₀₀ focus:border-blue-4₀₀ focus:ring-4 focus:ring-blue‑1₀₀"
                    />
                </div>

                <button
                    type="submit"
                    className="mx-auto mt-4 block w-1/2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-slate-700 focus:outline-none focus:ring-4 focus:ring-slate-300"
                >
                    Adicionar
                </button>
            </form>
        </>
    )
}