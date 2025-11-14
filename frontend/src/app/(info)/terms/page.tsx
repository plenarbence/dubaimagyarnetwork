export default async function TermsPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // --- Szerveroldali fetch ---
  let content = "";
  let error = "";

  try {
    const res = await fetch(`${API_URL}/content/terms`, {
      cache: "no-store",   // mindig friss backend adat
    });

    if (res.ok) {
      const data = await res.json();
      content = data.value || "";
    } else {
      error = "⚠️ A felhasználási feltételek oldal jelenleg nem elérhető.";
    }
  } catch {
    error = "⚠️ Hiba történt a tartalom betöltése közben.";
  }

  const finalHtml = error || content;

  return (
    <div className="max-w-3xl mx-auto p-6 prose prose-lg">
      <div
        className="text-gray-700 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: finalHtml }}
      />
    </div>
  );
}
