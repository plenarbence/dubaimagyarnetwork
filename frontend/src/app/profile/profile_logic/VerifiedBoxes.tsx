"use client";

import type { UserResponse } from "./UserResponse";

import OverviewBox from "./VerifiedBoxes/OverviewBox";
import ListingsBox from "./VerifiedBoxes/ListingsBox";
import PaymentsBox from "./VerifiedBoxes/PaymentsBox";
import RatingsBox from "./VerifiedBoxes/RatingsBox";
import PromotionsBox from "./VerifiedBoxes/PromotionsBox";

export default function VerifiedBoxes({ user }: { user: UserResponse }) {
  return (
    <div className="w-full max-w-5xl mt-6">

      {/* GRID – mindent középre rak */}
      <div
        className="
          grid 
          grid-cols-1 
          sm:grid-cols-2 
          lg:grid-cols-3 
          gap-6 
          place-items-center
          items-stretch
        "
      >
        <ListingsBox/>
        <PaymentsBox/>
        <PromotionsBox/>
        <RatingsBox/>
        <OverviewBox user={user} />
        

      </div>

    </div>
  );
}
