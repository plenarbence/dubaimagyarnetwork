import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  // globális ki/be kapcsoló
  if (process.env.BASIC_AUTH_ENABLED !== "true") {
    return NextResponse.next();
  }

  const auth = req.headers.get("authorization");

  if (!auth) {
    return new NextResponse("Auth required", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Dev Protected"',
      },
    });
  }

  const decoded = Buffer.from(auth.split(" ")[1], "base64")
    .toString()
    .split(":");

  const user = decoded[0];
  const pass = decoded[1];

  if (
    user !== process.env.BASIC_AUTH_USER ||
    pass !== process.env.BASIC_AUTH_PASS
  ) {
    return new NextResponse("Unauthorized", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Dev Protected"',
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
