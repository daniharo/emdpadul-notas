import Link from "next/link";

export default function Home() {
  return (
    <main className="flex-col flex w-full items-center mt-8 gap-4">
      <h1>Escuela de Música y Danza de Padul</h1>
      <Link
        href="/notas/"
        className="transition-all rounded-xl bg-white text-black px-4 py-2 hover:bg-neutral-300"
      >
        Ver notas
      </Link>
    </main>
  );
}
