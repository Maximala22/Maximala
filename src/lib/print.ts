import type { Job, Note, WorkLog } from "./types";
import { formatHours } from "./utils";

function baseStyles(): string {
  return `
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #241C15; padding: 24px; max-width: 800px; margin: 0 auto; }
      h1 { font-size: 22px; margin-bottom: 4px; }
      .brand { color: #0097CF; font-size: 12px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; }
      .meta { color: #8A7A6B; font-size: 13px; margin-bottom: 20px; }
      .section { margin-bottom: 16px; }
      .label { font-size: 11px; text-transform: uppercase; color: #8A7A6B; letter-spacing: 0.05em; margin-bottom: 4px; }
      .value { font-size: 15px; line-height: 1.5; }
      img { max-width: 100%; border-radius: 8px; margin: 8px 0; }
      .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #E8D8C8; font-size: 12px; color: #8A7A6B; }
    </style>
  `;
}

function footer(): string {
  return `<div class="footer">Jobbminne · Flemströms · Utskriven ${new Date().toLocaleString("sv-SE")}</div>`;
}

export function printHtml(title: string, bodyHtml: string): void {
  const win = window.open("", "_blank");
  if (!win) return;
  win.document.write(`
    <!DOCTYPE html>
    <html lang="sv">
    <head>
      <meta charset="utf-8" />
      <title>${title}</title>
      ${baseStyles()}
    </head>
    <body>
      <div class="brand">Flemströms · Jobbminne</div>
      ${bodyHtml}
      ${footer()}
    </body>
    </html>
  `);
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 300);
}

export function printJob(job: Job): void {
  const body = `
    <h1>${job.title}</h1>
    <div class="meta">Status: ${job.status}</div>
    ${job.customerName ? `<div class="section"><div class="label">Kund</div><div class="value">${job.customerName}</div></div>` : ""}
    ${job.customerPhone ? `<div class="section"><div class="label">Telefon</div><div class="value">${job.customerPhone}</div></div>` : ""}
    ${job.customerEmail ? `<div class="section"><div class="label">E-post</div><div class="value">${job.customerEmail}</div></div>` : ""}
    ${job.date ? `<div class="section"><div class="label">Datum & tid</div><div class="value">${job.date}${job.time ? ` kl. ${job.time}` : ""}</div></div>` : ""}
    ${job.address ? `<div class="section"><div class="label">Adress</div><div class="value">${job.address}</div></div>` : ""}
    ${job.description ? `<div class="section"><div class="label">Beskrivning</div><div class="value">${job.description}</div></div>` : ""}
    ${job.notes ? `<div class="section"><div class="label">Anteckningar</div><div class="value">${job.notes}</div></div>` : ""}
  `;
  printHtml(job.title, body);
}

export function printNote(note: Note): void {
  const body = `
    <h1>${note.title}</h1>
    <div class="meta">${new Date(note.updatedAt).toLocaleString("sv-SE")}</div>
    <div class="section"><div class="value">${note.text.replace(/\n/g, "<br>")}</div></div>
    ${note.tags?.length ? `<div class="section"><div class="label">Taggar</div><div class="value">${note.tags.join(", ")}</div></div>` : ""}
  `;
  printHtml(note.title, body);
}

export function printWorkLog(log: WorkLog): void {
  const body = `
    <h1>Dagsrapport</h1>
    <div class="meta">${log.date}</div>
    ${log.driverName ? `<div class="section"><div class="label">Förare</div><div class="value">${log.driverName}</div></div>` : ""}
    ${log.vehicleName ? `<div class="section"><div class="label">Fordon</div><div class="value">${log.vehicleName}</div></div>` : ""}
    ${log.place ? `<div class="section"><div class="label">Plats</div><div class="value">${log.place}</div></div>` : ""}
    ${log.hours !== undefined ? `<div class="section"><div class="label">Timmar</div><div class="value">${formatHours(log.hours)} h</div></div>` : ""}
    ${log.description ? `<div class="section"><div class="label">Gjort</div><div class="value">${log.description}</div></div>` : ""}
  `;
  printHtml("Dagsrapport", body);
}

export function printImage(dataUrl: string, title = "Bild"): void {
  const body = `<div class="section"><img src="${dataUrl}" alt="${title}" /></div>`;
  printHtml(title, body);
}
