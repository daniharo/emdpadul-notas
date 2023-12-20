import { revalidatePath } from "next/cache";

export default function Admin() {
  async function revalidateCSV() {
    "use server";
    revalidatePath("/notas/[code]", "page");
  }
  return (
    <main className="flex-col flex w-full items-center mt-8 gap-4">
      <h1>Escuela de Música y Danza de Padul</h1>
      <form action={revalidateCSV}>
        <button className="rounded-xl py-2 px-4 bg-white hover:bg-neutral-300 transition-all text-black">
          Refrescar CSV
        </button>
      </form>
    </main>
  );
}
