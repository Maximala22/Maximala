/**
 * App branding & support — ändra här för ny kund/white-label.
 * Flemströms-värden som standard; enkelt att byta för extern försäljning.
 */
export const appConfig = {
  appName: "Jobbminne",
  companyName: "Flemströms",
  tagline: "Firmans minne i fickan.",
  subtitle: "Jobb, rapporter, bilder och timmar samlat på ett ställe.",
  loginSubtitle: "Byggt för fältet – enkelt att använda ute på jobbet.",
  supportName: "Jobbminne Support",
  /** Sätt null för att dölja mail-knapp i support om mejl saknas */
  supportEmail: "flemstromelliot@gmail.com" as string | null,
  showCompanyBranding: true,
  backupDescription: "Spara en kopia av jobb, rapporter och anteckningar.",
} as const;

export function getSupportMailto(subject: string, body: string): string | null {
  if (!appConfig.supportEmail) return null;
  return `mailto:${appConfig.supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
