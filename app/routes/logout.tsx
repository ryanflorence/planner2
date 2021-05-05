import { ActionFunction, redirect } from "remix";
import { prisma } from "../db";
import {
  commitSession,
  destroySession,
  getSession,
  getUserSession,
} from "../session";

export let action: ActionFunction = async ({ request }) => {
  let cookieSession = await getSession(request.headers.get("Cookie"));
  let session = await getUserSession(request);

  if (session) {
    await prisma.session.delete({ where: { id: session?.id } });
  }

  cookieSession.unset("sessionId");
  cookieSession.flash("message", "You've been logged out! Go outside!");

  return redirect("/login", {
    headers: {
      "Set-Cookie": await commitSession(cookieSession),
    },
  });
};

export default function () {
  return null;
}
