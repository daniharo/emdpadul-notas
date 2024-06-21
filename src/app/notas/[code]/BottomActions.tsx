"use client";

import html2canvas from "html2canvas";

export const BottomActions = ({ name }: { name: string }) => {
  return (
    <div data-html2canvas-ignore={true}>
      <button
        className="mt-8 p-4 rounded-md shadow-md bg-rose-600 text-white hover:bg-rose-800 transition-all"
        onClick={async () => {
          const canvas = await html2canvas(
            document.querySelector("main") as HTMLElement,
            {
              height: document.querySelector("main")?.scrollHeight,
              width: document.querySelector("main")?.scrollWidth,
              backgroundColor: "#000000",
            },
          );
          const link = document.createElement("a");
          link.download = `EMDPadul 23-24 - Boletin Tercer Trimestre ${name}.png`;
          link.href = canvas.toDataURL("image/png");
          link.click();
        }}
      >
        Descargar
      </button>
    </div>
  );
};
