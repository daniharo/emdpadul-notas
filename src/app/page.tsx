import Image from "next/image";
import { redirect } from "next/navigation";

export default function Home() {
  async function goToNotas(formData: FormData) {
    "use server";
    const code = formData.get("code");
    redirect(`/${code}`);
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <form
        className="flex flex-col items-center justify-center"
        action={goToNotas}
      >
        <label className="text-2xl font-bold">
          Introduce tu código para ver las notas
        </label>
        <input
          className="mt-8 p-4 rounded-md shadow-md text-center text-black"
          type="text"
          placeholder="Código"
          name="code"
        />
        <button
          className="mt-8 p-4 rounded-md shadow-md bg-rose-600 text-white hover:bg-rose-800 transition-all"
          type="submit"
        >
          Ver el boletín
        </button>
      </form>
    </main>
  );
}
