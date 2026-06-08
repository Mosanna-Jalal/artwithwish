function getDriveId() {
  return process.env.HERO_MODEL_DRIVE_ID || "(not set)";
}

export default function AdminModelsPage() {
  const driveId = getDriveId();
  const driveLink =
    driveId !== "(not set)"
      ? `https://drive.google.com/file/d/${driveId}/view`
      : null;

  return (
    <div className="p-5 sm:p-8">
      <div className="mb-8">
        <p
          className="text-xs tracking-[0.3em] uppercase text-[#C9A96E] mb-1"
          style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
        >
          Manage
        </p>
        <h1
          className="text-3xl font-light text-[#FDFAF6]"
          style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
        >
          Hero 3D Model
        </h1>
      </div>

      {/* Current model card */}
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] p-6 mb-8 max-w-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-[#2A2A2A] flex items-center justify-center flex-shrink-0">
            <span className="text-[#C9A96E] text-base">◉</span>
          </div>
          <div>
            <p
              className="text-sm text-[#FDFAF6]"
              style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
            >
              Loaded from Google Drive
            </p>
            <p
              className="text-xs text-[#4A4540]"
              style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
            >
              Streamed via server proxy — kept out of the codebase
            </p>
          </div>
        </div>

        <div className="border-t border-[#2A2A2A] pt-4 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span
              className="text-xs text-[#6A6460]"
              style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
            >
              Drive File ID
            </span>
            <code className="text-xs text-[#C9A96E] bg-[#2A2A2A] px-2 py-0.5">
              {driveId}
            </code>
          </div>
          {driveLink && (
            <div className="flex items-center justify-between">
              <span
                className="text-xs text-[#6A6460]"
                style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
              >
                Source
              </span>
              <a
                href={driveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#8A8480] hover:text-[#C9A96E] transition-colors"
                style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
              >
                Open in Drive ↗
              </a>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span
              className="text-xs text-[#6A6460]"
              style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
            >
              Live endpoint
            </span>
            <a
              href="/api/hero-model"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#8A8480] hover:text-[#C9A96E] transition-colors"
              style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
            >
              /api/hero-model ↗
            </a>
          </div>
        </div>
      </div>

      {/* How to change */}
      <div className="bg-[#C9A96E]/10 border border-[#C9A96E]/20 p-5 max-w-2xl">
        <p
          className="text-sm text-[#C9A96E] font-medium mb-3"
          style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
        >
          How to change the 3D model
        </p>
        <ol
          className="text-sm text-[#8A8480] flex flex-col gap-2 list-decimal list-inside"
          style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
        >
          <li>Upload your new <span className="text-[#FDFAF6]">.glb</span> file to Google Drive</li>
          <li>
            Right-click it → Share → set to{" "}
            <span className="text-[#FDFAF6]">&quot;Anyone with the link&quot;</span>
          </li>
          <li>
            Copy the link — the long ID between{" "}
            <code className="bg-[#2A2A2A] px-1 text-[#C9A96E]">/d/</code> and{" "}
            <code className="bg-[#2A2A2A] px-1 text-[#C9A96E]">/view</code> is the File ID
          </li>
          <li>
            Paste that ID into{" "}
            <code className="bg-[#2A2A2A] px-2 py-0.5 text-[#C9A96E] text-xs">
              HERO_MODEL_DRIVE_ID
            </code>{" "}
            in <code className="bg-[#2A2A2A] px-1 text-[#C9A96E]">.env.local</code>
          </li>
          <li>Restart the server — the new model appears in the header</li>
        </ol>
      </div>
    </div>
  );
}
