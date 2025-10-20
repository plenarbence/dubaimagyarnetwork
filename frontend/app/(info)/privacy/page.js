// app/privacy/page.js

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">Adatvédelmi nyilatkozat</h1>

      <p className="mb-4">
        A dubaimagyarnetwork.com (üzemeltető: <strong>REPLACE_WITH_COMPANY_NAME</strong>)
        elkötelezett a személyes adatok védelme mellett. Az alábbiakban ismertetjük,
        milyen adatokat gyűjtünk, mire használjuk és hogyan biztosítjuk az adatok védelmét.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Adatkezelő</h2>
      <p className="mb-4">
        Adatkezelő: <strong>REPLACE_WITH_COMPANY_NAME</strong><br />
        Székhely: <strong>REPLACE_WITH_COMPANY_ADDRESS</strong><br />
        E-mail: <strong>REPLACE_WITH_COMPANY_EMAIL</strong><br />
        Trade License: <strong>REPLACE_WITH_TRADE_LICENSE</strong>
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. Milyen adatokat gyűjtünk</h2>
      <p className="mb-4">
        – Regisztrációkor: név, e-mail cím, telefonszám, opcionálisan cégadatok.<br />
        – Hirdetés beküldésekor: hirdetés szövege, képek, ár, elérhetőségek.<br />
        – Fizetéskor: a tényleges bankkártya-adatokat a fizetési szolgáltató (pl. Stripe) kezeli; mi csak a tranzakció metaadatait tároljuk (pl. tranzakció ID).
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Az adatok felhasználása</h2>
      <p className="mb-4">
        Az adatokat elsősorban kapcsolattartásra, hirdetéskezelésre, számlázásra és
        jogi kötelezettségek teljesítésére használjuk. Ezen felül statisztikákhoz
        aggregált (nem személyazonosítható) adatokat készíthetünk.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Adattovábbítás</h2>
      <p className="mb-4">
        A fizetések feldolgozását külső szolgáltató végzi (pl. Stripe). Egyéb személyes
        adatot harmadik félnek csak törvényi kötelezettség vagy az Ön kifejezett
        hozzájárulása esetén adunk át.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Adatbiztonság</h2>
      <p className="mb-4">
        Megfelelő technikai és szervezési intézkedéseket alkalmazunk az adatok védelmére,
        beleértve HTTPS használatát és a jelszavak biztonságos tárolását. Ugyanakkor
        a felhasználó felelőssége is, hogy biztonságos jelszót használjon.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">6. Jogosultságok</h2>
      <p className="mb-4">
        Ön jogosult kérni személyes adatai másolatát, helyesbítését, törlését vagy
        adatkezelés korlátozását. Kérést az alábbi e-mail címen fogadunk:
        <strong> REPLACE_WITH_COMPANY_EMAIL</strong>.
      </p>

      <p className="mt-10 text-sm text-gray-600">
        Adatkezelő: <strong>REPLACE_WITH_COMPANY_NAME</strong> · Székhely: <strong>REPLACE_WITH_COMPANY_ADDRESS</strong><br />
        Trade License: <strong>REPLACE_WITH_TRADE_LICENSE</strong> · Utolsó frissítés: 2025-10-03
      </p>
    </div>
  );
}
