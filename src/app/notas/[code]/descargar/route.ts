import puppeteer from "puppeteer";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } },
) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const url = request.nextUrl;
  console.log(url);
  url.pathname = `/notas/${params.code}`;

  await page.goto(url.toString(), {
    waitUntil: "networkidle0",
  });

  const result = await page.pdf({
    format: "a4",
  });
  await browser.close();

  return new Response(result, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=notas.pdf",
    },
  });
}
