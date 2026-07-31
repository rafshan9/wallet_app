// app/download/page.tsx (or pages/download.tsx)
import GetSpendsButton from "../components/GetSpendsButton";

export default function DownloadPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#F4F4F0] px-6">
            <h1 className="text-3xl font-black text-[#282825] mb-4 text-center">
                Almost there!
            </h1>
            <p className="text-[#282825] mb-8 text-center font-medium">
                Click below to download the spends.apk file directly to your device.
            </p>

            {/* The actual download trigger */}
            <a
                href="/spends.apk"
                download="spends.apk"
                className="px-8 py-4 bg-[#F7CB46] text-[#282825] font-black text-lg border-4 border-[#282825]"
                style={{
                    boxShadow: "6px 6px 0px #282825",
                    fontFamily: "var(--font-jetbrains-mono)",
                }}
            >
                Confirm Download
            </a>
        </div>
    );
}