import axios from 'axios';

interface Endereco {
  titulo: string;
  rua: string;
  numero: string;
  bairro: string;
  complemento: string;
  cep: string;
}

type SessionType = {
  session: {
    user: {
      id: string;
    };
  };
};

export default async function EnderecoCad(session: SessionType) {
  const id = session.session.user.id;
  console.log(id);

  const enderecos: Endereco[] = await axios
    .get(`${process.env.NEXT_PUBLIC_URL_HOME}/api/enderecos/${id}`)
    .then((res) => {
      return res.data;
    });

  return (
    <>
      {enderecos.map((endereco, index) => (
        <div
          key={index}
          className="mb-4 rounded-lg border border-gray-300 bg-white p-4 shadow"
        >
          <h3 className="text-lg font-semibold">{endereco.titulo}</h3>
          <p>
            {endereco.rua}, {endereco.numero} - {endereco.bairro}
          </p>
          <p>{endereco.complemento}</p>
          <p>CEP: {endereco.cep}</p>
        </div>
      ))}
    </>
  );
}
