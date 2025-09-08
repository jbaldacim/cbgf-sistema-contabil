import { getAccountByCode } from "@/lib/contas";
import Image from "next/image";

export default function Home() {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-zinc-900 text-zinc-50">
      <div className="border-l-2 border-white pl-2">
        <p>
          <span className="font-bold">Nome: </span>
          {getAccountByCode("1.0.1")?.name}
        </p>
        <p>
          <span className="font-bold">Código: </span>
          {getAccountByCode("1.0.1")?.code}
        </p>
        <p>
          <span className="font-bold">Grupo Contábil: </span>
          {getAccountByCode("1.0.1")?.accountGroup}
        </p>
        <p>
          <span className="font-bold">Subgrupo 1: </span>
          {getAccountByCode("1.0.1")?.subgroup1}
        </p>
        <p>
          <span className="font-bold">Subgrupo 2: </span>
          {getAccountByCode("1.0.1")?.subgroup2}
        </p>
        <p>
          <span className="font-bold">Código e Nome: </span>
          {getAccountByCode("1.0.1")?.codeAndName}
        </p>
      </div>
    </div>
  );
}
