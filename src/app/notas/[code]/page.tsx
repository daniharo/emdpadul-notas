import { parse } from "papaparse";
import Link from "next/link";

function showKey(key: string, blacklist: string[]) {
  if (blacklist.some((blacklistKey) => key.startsWith(blacklistKey)))
    return false;
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
          href="/notas/"
        >
          Volver
        </Link>
      </main>
    );
  }

  const keyBlacklist: string[] = [];

  const instruments = row["Instrumento"].split("/");
  const ins1 = instruments[0];
  const ins2 = instruments[1];

  const showINS1 = Object.keys(row).some(
    (key) => key.startsWith("INS1") && row[key],
  );
  if (!showINS1) keyBlacklist.push("INS1");
  const showINS2 = Object.keys(row).some(
    (key) => key.startsWith("INS2") && row[key],
  );
  if (!showINS2) keyBlacklist.push("INS2");

  return (
    <main className="flex flex-col items-center justify-between max-w-lg mx-auto px-4 mt-10 mb-8 m-auto">
      <table className="border">
        <tbody>
          {Object.keys(row)
            .filter((key) => showKey(key, keyBlacklist))
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
      <form method="GET" action={`/notas/${code}/descargar`}>
        <button className="print:hidden mt-8 p-4 rounded-xl bg-rose-600 text-white hover:bg-rose-800 transition-all">
          Descargar
        </button>
      </form>
    </main>
  );
}
