"use client";

import { useRouter } from "next/navigation";

type Props = {
  listing_id: number;
  status: string;
  admin_comment?: string | null;
};


export default function HandleStatus({ listing_id, status, admin_comment }: Props) {
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleEdit = () => {
    router.push(`/profile/my-listings/edit/${listing_id}`);
  };

  async function handleSubmit() {
    if (!window.confirm("Biztosan beküldöd a hirdetést?")) return;

    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    try {
      const res = await fetch(
        `${API_URL}/listings/${listing_id}/to-pending-admin`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        localStorage.removeItem("token");
        router.replace("/login");
        return;
      }

      router.push("/profile/my-listings");
    } catch {
      localStorage.removeItem("token");
      router.replace("/login");
    }
  }



  async function handleDelete() {
    if (!window.confirm("Biztosan törlöd a hirdetést?")) return;

    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    try {
      const res = await fetch(
        `${API_URL}/listings/${listing_id}/to-expired`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        localStorage.removeItem("token");
        router.replace("/login");
        return;
      }

      router.push("/profile/my-listings");
    } catch {
      localStorage.removeItem("token");
      router.replace("/login");
    }
  }

  async function handleBackToDraft() {
    if (!window.confirm("Biztosan újra szerkeszteni szeretnéd a hirdetést?")) return;

    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    try {
      const res = await fetch(
        `${API_URL}/listings/${listing_id}/to-draft`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        localStorage.removeItem("token");
        router.replace("/login");
        return;
      }

      router.push("/profile/my-listings");
    } catch {
      localStorage.removeItem("token");
      router.replace("/login");
    }
  }


  // -----------------------------
  // PENDING_ADMIN → SEMMI
  // -----------------------------
  if (status === "pending_admin") {
    return null;
  }

  return (
    <div className="mt-8 border-t pt-6">
      {/* ================= ADMIN COMMENT ================= */}
      {(status === "draft" || status === "rejected") && admin_comment && (
        <div className="mb-4 rounded border border-gray-300 bg-gray-50 p-3 text-sm text-gray-700">
          <p className="font-medium mb-1">Admin megjegyzés:</p>
          <p>{admin_comment}</p>
        </div>
      )}

      {/* ================= ACTIVE INFO ================= */}
      {status === "active" && (
        <p className="mb-3 text-xs text-gray-500">
          * Adminnak ezután újra jóvá kell hagynia
        </p>
      )}

      {/* ================= BUTTONS ================= */}
      <div className="flex flex-col gap-3 w-full">
        {/* ===== DRAFT ===== */}
        {status === "draft" && (
            <div className="flex flex-col gap-3">
                <button
                onClick={handleEdit}
                className="w-full px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                Szerkesztés
                </button>

                <button
                onClick={handleSubmit}
                className="w-full px-4 py-2 rounded bg-gray-800 text-white hover:opacity-90"
                >
                Beküldés
                </button>

                <button
                onClick={handleDelete}
                className="w-full px-4 py-2 rounded border border-red-300 text-red-600 hover:bg-red-50"
                >
                Törlés
                </button>
            </div>
            )}


        {/* ===== REJECTED ===== */}
        {status === "rejected" && (
          <>
            <button
              onClick={handleBackToDraft}
              className="w-full px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Visszahelyezés a vázlatokba
            </button>


            <button
              onClick={handleDelete}
              className="w-full px-4 py-2 rounded border border-red-300 text-red-600 hover:bg-red-50"
            >
              Törlés
            </button>
          </>
        )}

        {/* ===== ACTIVE ===== */}
        {status === "active" && (
          <>
            <button
              onClick={handleBackToDraft}
              className="w-full px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Visszahelyezés a vázlatokba
            </button>


            <button
              onClick={handleDelete}
              className="w-full px-4 py-2 rounded border border-red-300 text-red-600 hover:bg-red-50"
            >
              Törlés
            </button>
          </>
        )}

        {/* ===== DELETED ===== */}
        {status === "expired" && (
          <>
            <button
              onClick={handleBackToDraft}
              className="w-full px-4 py-2 rounded bg-gray-800 text-white hover:opacity-90"
            >
              Visszaállítás
            </button>
          </>
        )}
      </div>
    </div>
  );
}
