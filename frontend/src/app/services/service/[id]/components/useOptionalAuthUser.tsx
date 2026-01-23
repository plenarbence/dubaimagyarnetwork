"use client";

import { useEffect, useState } from "react";

type OptionalUser = {
  id: number;
};

export function useOptionalAuthUser() {
  const [user, setUser] = useState<OptionalUser | null>(null);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Invalid token");
        }

        const data = await res.json();

        // 👉 csak azt tartjuk meg, ami kell
        setUser({ id: data.id });

      } catch {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [API_URL]);

  return { user, loading, isLoggedIn: !!user };
}
