import type { LoaderFunction, Request } from "remix";
import {
  createCookieSessionStorage,
  redirect,
} from "remix";

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
  let session = await getSession(
    request.headers.get("Cookie")
  );
  return session.get("user");
}

export async function requireUserSession(
  request: Request,
  next: (session: string) => ReturnType<LoaderFunction>
) {
  let session = await getSession(
    request.headers.get("Cookie")
  );
  if (!session.get("user")) {
    return redirect("/login");
  }
  return next(session.get("user"));
}

export { getSession, commitSession, destroySession };
