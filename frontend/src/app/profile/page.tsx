"use client";

import { useAuthUser } from "./profile_logic/useAuthUser";

import UnverifiedBox from "./profile_logic/UnverifiedBox";
import VerifiedBoxes from "./profile_logic/VerifiedBoxes";



export default function ProfilePage() {
  const { user, loading } = useAuthUser();

  // ----------------------
  //       LOADING
  // ----------------------
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Betöltés...
      </div>
    );
  }


  if (!user) {
    return null;
  }

  // ----------------------
  //   VERIFIED / NOT VERIFIED
  // ----------------------
  return (
    <div className="pt-10 pb-10 p-6 flex flex-col items-center">

      {!user.is_verified && (
        // 👉 EZ A NEM VERIFIED BOX COMPONENT
        <UnverifiedBox user={user} />
      )}

      {user.is_verified && (
        // 👉 EZ A VERIFIED SETUP 
        <VerifiedBoxes user={user} />
      )}

    </div>
  );
}
