import { useEffect, useState } from "react";
import {
  ActionFunction,
  Form,
  LoaderFunction,
  useRouteData,
} from "remix";
import { json, redirect } from "remix";
import { createPasswordHash } from "../crypto.server";

import { prisma } from "../db";
import { commitSession, getSession } from "../session";
import styles from "../styles/login.css";

////////////////////////////////////////////////////////////////////////////////
// Types
interface SignupSession {
  email?: string;
  password?: string;
  verifyPassword?: string;
  passwordError?: string;
  emailError?: string;
  verifyPasswordError?: string;
  error?: string;
}

////////////////////////////////////////////////////////////////////////////////
// Actual code!
export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export let action: ActionFunction = async ({ request }) => {
  let body = Object.fromEntries(
    new URLSearchParams(await request.text())
  );
  let errored = false;
  let session = await getSession(request.headers.get("Cookie"));

  //////////////////////////////////////////////////
  // Validations
  if (!body.email) {
    errored = true;
    session.flash("emailError", "email is required");
  } else if (!body.email.includes("@")) {
    errored = true;
    session.flash("emailError", "That's not an email, dork.");
  }

  // TODO: Be able to send multiple errors down so you don't have to submit
  // over and over and over hoping the next time you did it right!
  if (!body.password) {
    errored = true;
    session.flash("passwordError", "password is required");
  } else if (body.password.length < 6) {
    errored = true;
    session.flash("passwordError", "Your password sucks.");
  }

  if (body.password !== body.verifyPassword) {
    errored = true;
    session.flash(
      "verifyPasswordError",
      "Password verification did not match!"
    );
  }
  //////////////////////////////////////////////////
  // Handle error
  if (errored) {
    session.flash("email", body.email);
    session.flash("password", body.password);
    session.flash("verifyPassword", body.verifyPassword);
    return redirect("/signup", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }

  //////////////////////////////////////////////////
  // Create the user and session
  try {
    // FIXME: if the is successfully created, but the session fails,
    // then what?
    let user = await prisma.user.create({
      data: {
        email: body.email,
        passwordHash: await createPasswordHash(body.password),
      },
    });
    let dbSession = await prisma.session.create({
      data: { userId: user.id },
    });
    session.set("sessionId", dbSession.id);

    return redirect("/", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } catch (error) {
    console.error(error);
    session.flash("error", "Could not create user");
    return redirect("/signup", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }
};

// GET
export let loader: LoaderFunction = async ({ request }) => {
  let session = await getSession(request.headers.get("Cookie"));

  let signupSession: SignupSession = {
    email: session.get("email"),
    password: session.get("password"),
    verifyPassword: session.get("verifyPassword"),
    passwordError: session.get("passwordError"),
    verifyPasswordError: session.get("verifyPasswordError"),
    emailError: session.get("emailError"),
    error: session.get("error"),
  };

  return json(signupSession, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

export default function Signup() {
  let session = useRouteData<SignupSession>();
  return (
    <main>
      <h1>Sign Up</h1>
      <Form method="post">
        <p>
          <label>
            Email Address:
            <br />
            <input
              autoComplete="false"
              type="email"
              defaultValue={session.email || "rpflorence@gmail.com"}
              // required
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
              // required
              name="password"
              defaultValue={session.password || "password1"}
            />
          </label>
          {session.passwordError && (
            <FadeIn>{session.passwordError}</FadeIn>
          )}
        </p>
        <p>
          <label>
            Verify Password:
            <br />
            <input
              autoComplete="false"
              type="password"
              // required
              name="verifyPassword"
              defaultValue={session.verifyPassword || "password1"}
            />
          </label>
          {session.verifyPasswordError && (
            <FadeIn>{session.verifyPasswordError}</FadeIn>
          )}
        </p>
        <p>
          <button type="submit">Sign up!</button>
        </p>
        {session.error && <FadeIn>{session.error}</FadeIn>}
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
