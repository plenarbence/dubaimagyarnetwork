"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { UserResponse } from "./UserResponse";

export function useAuthUser() {
  const router = useRouter();
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Token expired or invalid");
        }

        const data = await res.json();
        setUser(data);

      } catch (err) {
        console.error("Token verification failed:", err);
        localStorage.removeItem("token");
        window.dispatchEvent(new Event("authChange"));
        router.push("/login");

      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router, API_URL]);

  return { user, loading };
}
