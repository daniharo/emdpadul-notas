import { parse } from "papaparse";
import Link from "next/link";

export default async function Notas({ params }: { params: { code: string } }) {
  const code = params.code;

  const csv = await fetch(process.env.CSV_URL as string, {
    next: { revalidate: 3600 },
  });
  const data = await csv.text();
  const parsed = parse(data, { header: true });

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

  const keyBlacklist = ["password", "Observaciones", "Boletín"];

  const instruments = row["Instrumento"].split("/");
  const ins1 = instruments[0];
  const ins2 = instruments[1];

  return (
    <main className="flex flex-col items-center justify-between max-w-lg mx-auto px-4 mt-10 mb-8 m-auto">
      <table className="border">
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
    </main>
  );
}
