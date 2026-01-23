import HomePosters from "./home_logic/HomePosters";
import HomeFeatured from "./home_logic/HomeFeatured";

export const metadata = {
  title: "Dubai Magyar Network",
  description:
    "A Dubai Magyar Network egy magyar nyelvű szolgáltatói és hirdetési platform Dubaiban élőknek és Dubai iránt érdeklődőknek. Ingatlan, szolgáltatások, helyi szakértők és megbízható hirdetések egy helyen.",
};

export default async function Home() {

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // --- Szerveroldali fetch ---
  let content = "";
  let error = "";

  try {
    const res = await fetch(`${API_URL}/content/aboutus`, {
       next: { revalidate: 3600 }, // 1 óránként frissül
    });

    if (res.ok) {
      const data = await res.json();
      content = data.value || "";
    } else {
      error = "A rólunk tartalom jelenleg nem elérhető.";
    }
  } catch {
    error = "⚠️ Hiba történt a tartalom betöltése közben.";
  }

  const finalHtml = error || content;


  return (
    <div className="w-full bg-white text-black">
      <div className="max-w-6xl mx-auto mt-6">
        <h1 className="sr-only">
          Magyar szolgáltatások és hirdetések Dubajban
        </h1>

        <HomePosters />
        <HomeFeatured />


      <div className="max-w-4xl mx-auto mt-16 px-4">
        <h2 className="text-2xl font-semibold mb-4 text-black">
          Rólunk
        </h2>

        <div
          className="text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: finalHtml }}
        />
      </div>
      </div>
    </div>
  );
}
