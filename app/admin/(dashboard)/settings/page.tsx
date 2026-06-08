import FontSettings from "@/components/admin/FontSettings";
import { getHeadingFont } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const current = await getHeadingFont();

  return (
    <div className="p-5 sm:p-8">
      <div className="mb-8">
        <p
          className="text-xs tracking-[0.3em] uppercase text-[#C9A96E] mb-1"
          style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
        >
          Customize
        </p>
        <h1
          className="text-3xl font-light text-[#FDFAF6]"
          style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
        >
          Settings
        </h1>
      </div>

      <FontSettings current={current} />
    </div>
  );
}
