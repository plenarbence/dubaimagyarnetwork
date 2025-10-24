const API_URL = process.env.NEXT_PUBLIC_API_URL; 

// -----------------------------
// ✅ REGISZTRÁCIÓ
// -----------------------------
export async function registerUser(email, password) {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    let errMsg = `Registration failed (${res.status})`;
    try {
      const data = await res.json();
      if (data?.detail) errMsg = data.detail;
    } catch {
      const text = await res.text();
      if (text) errMsg = text;
    }
    throw new Error(errMsg);
  }

  return res.json();
}

// -----------------------------
// ✅ BEJELENTKEZÉS (OAuth2 kompatibilis)
// -----------------------------
export async function loginUser(email, password) {
  const formData = new URLSearchParams();
  formData.append("username", email);
  formData.append("password", password);

  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: formData.toString(),
  });

  if (!res.ok) {
    let errMsg = `Login failed (${res.status})`;
    try {
      const data = await res.json();
      if (data?.detail) errMsg = data.detail;
    } catch {
      const text = await res.text();
      if (text) errMsg = text;
    }
    throw new Error(errMsg);
  }

  return res.json();
}

// -----------------------------
// ✅ EMAIL VERIFIKÁCIÓ
// -----------------------------
export async function verifyEmail(token) {
  const res = await fetch(`${API_URL}/verify-email`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    let msg = `Email verification failed (${res.status})`;
    try {
      const data = await res.json();
      if (data?.detail) msg = data.detail;
    } catch {
      const text = await res.text();
      if (text) msg = text;
    }
    throw new Error(msg);
  }

  return res.json();
}

// -----------------------------
// ✅ AKTUÁLIS FELHASZNÁLÓ LEKÉRÉSE
// -----------------------------
export async function getCurrentUser(token) {
  const res = await fetch(`${API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    let errMsg = `Unauthorized (${res.status})`;
    try {
      const data = await res.json();
      if (data?.detail) errMsg = data.detail;
    } catch {
      const text = await res.text();
      if (text) errMsg = text;
    }
    throw new Error(errMsg);
  }

  return res.json();
}
