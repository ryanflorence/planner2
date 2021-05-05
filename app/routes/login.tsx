import { useEffect, useState } from "react";
import {
  ActionFunction,
  Form,
  LoaderFunction,
  useRouteData,
} from "remix";
import { json, redirect } from "remix";
import { prisma } from "../db";
import { commitSession, getSession, getUserSession } from "../session";
import styles from "../styles/login.css";
import { bcrypt } from "../crypto.server";
import invariant from "../invariant";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export let action: ActionFunction = async ({ request }) => {
  let body = Object.fromEntries(
    new URLSearchParams(await request.text())
  );
  let errored = false;
  let cookieSession = await getSession(request.headers.get("Cookie"));

  //////////////////////////////////////////////////
  // Validation
  if (!body.email) {
    errored = true;
    cookieSession.flash("emailError", "email is required");
  }
  if (!body.password) {
    errored = true;
    cookieSession.flash("passwordError", "password is required");
  }

  let user = await prisma.user.findUnique({
    where: {
      email: body.email,
    },
  });

  if (!user) {
    errored = true;
    cookieSession.flash(
      "emailError",
      "There is no user with this email"
    );
  } else {
    let passwordMatches = await bcrypt.compare(
      body.password,
      user.passwordHash
    );
    if (!passwordMatches) {
      errored = true;
      cookieSession.flash(
        "passwordError",
        "Sorry, that username and password combination is wrong."
      );
    }
  }

  if (errored) {
    cookieSession.flash("email", body.email);
    cookieSession.flash("password", body.password);
    return redirect("/login", {
      headers: {
        "Set-Cookie": await commitSession(cookieSession),
      },
    });
  }

  //////////////////////////////////////////////////
  invariant(user, "User is not defined");

  try {
    let session = await prisma.session.create({
      data: {
        userId: user.id,
      },
    });

    cookieSession.set("sessionId", session.id);

    return redirect("/", {
      headers: {
        "Set-Cookie": await commitSession(cookieSession),
      },
    });
  } catch (error) {
    console.error(error);
    cookieSession.flash("error", "Could not create session");
    return redirect("/login", {
      headers: {
        "Set-Cookie": await commitSession(cookieSession),
      },
    });
  }
};

// GET
export let loader: LoaderFunction = async ({ request }) => {
  let userSession = await getUserSession(request);
  if (userSession) {
    return redirect("/");
  }

  let cookieSession = await getSession(request.headers.get("Cookie"));
  return json(
    {
      email: cookieSession.get("email"),
      emailError: cookieSession.get("emailError"),
      // comes from logging out
      message: cookieSession.get("message"),
      password: cookieSession.get("password"),
      passwordError: cookieSession.get("passwordError"),
      error: cookieSession.get("error"),
    },
    {
      headers: {
        "Set-Cookie": await commitSession(cookieSession),
      },
    }
  );
};

export default function Login() {
  let session = useRouteData();
  return (
    <main>
      <h1>Login</h1>
      {session.message && <p>{session.message}</p>}
      {session.error && <p>{session.error}</p>}
      <Form method="post">
        <p>
          <label>
            Email Address:
            <br />
            <input
              autoComplete="false"
              type="email"
              defaultValue={session.email}
              required
              name="email"
            />
          </label>
          {session.emailError && <FadeIn>{session.emailError}</FadeIn>}
        </p>
        <p>
          <label>
            Password:
            <br />
            <input
              autoComplete="false"
              type="password"
              required
              name="password"
            />
          </label>
          {session.passwordError && (
            <FadeIn>{session.passwordError}</FadeIn>
          )}
        </p>
        <p>
          <button type="submit">Login</button>
        </p>
      </Form>
    </main>
  );
}

function FadeIn({ children }: { children: React.ReactNode }) {
  let [mounted, setMounted] = useState(false);
  useEffect(() => {
    let id = setTimeout(() => {
      setMounted(true);
    }, 10);
    return () => clearTimeout(id);
  }, []);
  return <span data-fade={String(mounted)}>{children}</span>;
}
