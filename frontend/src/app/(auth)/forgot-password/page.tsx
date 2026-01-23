"use client";

import { useState } from "react";
import EmailAndCodeStep from "./EmailAndCodeStep";
import PasswordResetStep from "./PasswordResetStep";

export default function ForgotPasswordPage() {
  const [codeValid, setCodeValid] = useState(false);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  const handleCodeVerified = (verifiedEmail: string, verifiedCode: string) => {
    setEmail(verifiedEmail);
    setCode(verifiedCode);
    setCodeValid(true);
  };

  return (
    <div className="flex items-start justify-center pt-20 pb-12 bg-white px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-semibold text-center mb-8 text-gray-800">
          Elfelejtett jelszó
        </h1>

        {!codeValid && (
          <EmailAndCodeStep onCodeVerified={handleCodeVerified} />
        )}

        {codeValid && (
          <PasswordResetStep
            email={email}
            code={code}
          />
        )}
          
      </div>
    </div>
  );
}
