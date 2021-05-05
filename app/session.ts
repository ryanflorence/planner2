import { Session } from ".prisma/client";
import type { LoaderFunction, Request } from "remix";
import { createCookieSessionStorage, redirect } from "remix";
import { prisma } from "./db";

// let secrets = process.env.COOKIE_SECRET;
// if (!secrets) {
//   throw new Error("You need to set a COOKIE_SECRET environment variable");
// }

let {
  getSession,
  commitSession,
  destroySession,
} = createCookieSessionStorage({
  cookie: {
    name: "__session",
    secrets: ["blah blah blah"],
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  },
});

export async function getUserSession(request: Request) {
  let session = await getSession(request.headers.get("Cookie"));
  let sessionId = session.get("sessionId");
  if (!sessionId) {
    return null;
  }

  return prisma.session.findUnique({
    where: { id: sessionId },
  });
}

export async function requireUserSession(
  request: Request,
  next: (session: Session) => ReturnType<LoaderFunction>
) {
  let session = await getSession(request.headers.get("Cookie"));
  let sessionId = session.get("sessionId");

  // no cookie
  if (!sessionId) {
    return redirect("/login");
  }

  let userSession = await prisma.session.findUnique({
    where: { id: sessionId },
  });

  // no db
  if (!userSession) {
    return redirect("/login", {
      headers: {
        "Set-Cookie": await destroySession(session),
      },
    });
  }

  return next(userSession);
}

export { getSession, commitSession, destroySession };
