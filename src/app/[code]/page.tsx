import { parse } from "papaparse";
import Link from "next/link";

function showKey(key: string) {
  if (key === "password") return false;
  return !key.includes("TRI");
}

export default async function Notas({ params }: { params: { code: string } }) {
  const code = params.code;

  const csv = await fetch(process.env.CSV_URL as string);
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

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <table className="border">
        <tbody>
          {Object.keys(row)
            .filter(showKey)
            .map((key) => (
              <tr key={key}>
                <td className="p-2 font-bold self-end border">{key}</td>
                <td className="p-2 border">{row[key]}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </main>
  );
}
