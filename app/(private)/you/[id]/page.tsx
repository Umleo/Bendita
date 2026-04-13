import { auth } from '@/app/lib/auth';
import { redirect } from 'next/dist/client/components/navigation';
import { headers } from 'next/dist/server/request/headers';
import EnderecoCad from '../../components/you/enderecoCad';
import InputEndereco from '../../components/you/inputEndereco';

export default async function You({ params }: { params: { id: string } }) {
  const { id } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // validação básica de segurança
  if (!session) {
    redirect('/login');
  }

  // validação extra
  const isOwner = session.user.id === id;
  if (!isOwner) {
    redirect('/login');
  }

  const enderecoCadastrado = {
    status: 'Ativo',
  };

  return (
    <main className="min-h-screen bg-gray-100 py-10 px-4 text-slate-800">
      <section className="mx-auto w-full max-w-2xl rounded-3xl border border-white/60 bg-white/90 p-6 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] backdrop-blur-sm sm:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Minha Conta
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Atualize seus dados e gerencie seus endereços.
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="ml-1 text-sm font-semibold text-slate-600">
              Nome
            </label>
            <input
              type="text"
              defaultValue={session.user.name ?? ''}
              className="w-full rounded-2xl border border-slate-200/70 bg-white px-5 py-3.5 text-slate-800 shadow-sm outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
              placeholder="Seu nome completo"
            />
          </div>

          <div className="space-y-1.5">
            <label className="ml-1 text-sm font-semibold text-slate-600">
              E-mail
            </label>
            <input
              type="email"
              defaultValue={session.user.email ?? ''}
              className="w-full rounded-2xl border border-slate-200/70 bg-white px-5 py-3.5 text-slate-800 shadow-sm outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
              placeholder="voce@exemplo.com"
            />
          </div>

          <div className="space-y-1.5">
            <label className="ml-1 text-sm font-semibold text-slate-600">
              Telefone
            </label>
            <input
              type="tel"
              defaultValue=""
              className="w-full rounded-2xl border border-slate-200/70 bg-white px-5 py-3.5 text-slate-800 shadow-sm outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
              placeholder="(00) 00000-0000"
            />
          </div>

          <button
            type="button"
            className="mx-auto mt-2 flex w-1/2 items-center justify-center rounded-2xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-[0_8px_20px_-8px_rgba(37,99,235,0.55)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-500 focus:ring-4 focus:ring-blue-200"
          >
            Atualizar dados
          </button>
        </div>

        <div className="mt-8 space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Endereços</h2>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <EnderecoCad session={session} />
              </div>

              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                {enderecoCadastrado.status}
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-4">
            <p className="mb-3 text-sm font-semibold text-slate-700">
              Cadastrar novo endereço
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <InputEndereco session={session} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
