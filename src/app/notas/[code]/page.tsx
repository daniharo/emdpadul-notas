import { parse } from "papaparse";
import Link from "next/link";

function showKey(key: string, showINS2: boolean) {
  if (key.startsWith("INS2") && !showINS2) return false;
  if (["password", "Observaciones", "Boletín"].includes(key)) return false;
  return !key.includes("TRI");
}

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
          href="/"
        >
          Volver
        </Link>
      </main>
    );
  }

  const showINS2 = Object.keys(row).some(
    (key) => key.startsWith("INS2") && row[key],
  );

  return (
    <main className="flex flex-col items-center justify-between max-w-lg mx-auto px-4 mt-10 mb-4 m-auto">
      <table className="border">
        <tbody>
          {Object.keys(row)
            .filter((key) => showKey(key, showINS2))
            .map((key) => (
              <tr key={key}>
                <td className="p-2 font-bold self-end border">
                  {key.replace("INS1", row["Instrumento"])}
                </td>
                <td className="p-2 border">{row[key]}</td>
              </tr>
            ))}
          <tr>
            <td colSpan={2} className="font-bold">
              Observaciones
            </td>
          </tr>
          <tr>
            <td colSpan={2}>{row["Observaciones"]}</td>
          </tr>
        </tbody>
      </table>
    </main>
  );
}
