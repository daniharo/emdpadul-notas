import { parse } from "papaparse";
import Link from "next/link";
import { BottomActions } from "@/app/notas/[code]/BottomActions";
import { unstable_cache } from "next/cache";

const getCachedParsedCSV = unstable_cache(
  async () => {
    const csv = await fetch(process.env.CSV_URL as string, {
      next: { revalidate: 0 },
    });
    const data = await csv.text();
    return parse(data, { header: true });
  },
  ["csv_notas"],
  { revalidate: 3600 },
);

export default async function Notas({ params }: { params: { code: string } }) {
  const code = params.code;

  const parsed = await getCachedParsedCSV();

  const row = parsed.data.find((row: any) => row["password"] === code) as {
    [key: string]: string;
  };

  if (!row) {
    return (
      <main className="flex flex-col items-center justify-between p-24 gap-8">
        <h1 className="text-4xl font-bold">Código inválido</h1>
        <Link
          className="transition-all rounded-xl bg-white text-black px-4 py-2 hover:bg-neutral-300"
          href="/notas/"
        >
          Volver
        </Link>
      </main>
    );
  }

  const keyBlacklist = [
    "password",
    "Observaciones",
    "Boletín",
    "Enviar boletín",
  ];

  const instruments = row["Instrumento"].split("/");
  const ins1 = instruments[0];
  const ins2 = instruments[1];

  return (
    <main className="flex flex-col items-center justify-between max-w-lg mx-auto px-4 pt-10 pb-8 m-auto">
      <h1 className="font-bold">Escuela de Música y Danza de Padul</h1>
      <h2>Curso 2024/2025 - Tercer Trimestre</h2>
      <table className="border mt-4">
        <tbody>
          {Object.keys(row)
            .filter((key) => !keyBlacklist.includes(key) && !!row[key])
            .map((key) => (
              <tr key={key}>
                <td className="p-2 font-bold self-end border">
                  {key
                    .replace("INS1", ins1)
                    .replace("INS2", ins2 || "Segundo Instrumento")}
                </td>
                <td className="p-2 border">{row[key]}</td>
              </tr>
            ))}
          {row["Observaciones"] && (
            <>
              <tr>
                <td colSpan={2} className="px-2 pt-2 pb-1 font-bold">
                  Observaciones
                </td>
              </tr>
              <tr>
                <td colSpan={2} className="px-2 pb-2 pt-1">
                  {row["Observaciones"]}
                </td>
              </tr>
            </>
          )}
        </tbody>
      </table>
      <BottomActions name={`${row["Nombre"]} ${row["Apellidos"]}`} />
    </main>
  );
}
