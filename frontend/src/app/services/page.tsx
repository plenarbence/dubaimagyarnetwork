import ServicesClient from "./components/ServicesClient";

export const metadata = {
  title: "Dubai Magyar Network - Szolgáltatások",
  description:
    "Magyar szolgáltatások és hirdetések Dubaiban, egy helyen, átláthatóan.",
};

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      {/* SEO header */}
      <h1 className="text-2xl font-semibold">Szolgáltatások Dubaiban</h1>
      <p className="mt-2 text-sm text-gray-600 max-w-4xl">
        Magyar szolgáltatókat gyűjtöttünk össze Dubaiban, hogy könnyen
        megtaláld azt, akire szükséged van egy átlátható, magyar közösségi felületen.
      </p>
      
      <ServicesClient />
    
    </div>
  );
}
