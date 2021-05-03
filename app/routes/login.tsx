import { useEffect, useState } from "react";
import {
  ActionFunction,
  Form,
  LoaderFunction,
  useRouteData,
} from "remix";
import { json, redirect } from "remix";
import { commitSession, getSession } from "../session";
import styles from "../styles/login.css";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

// POST
export let action: ActionFunction = async ({ request }) => {
  let body = Object.fromEntries(
    new URLSearchParams(await request.text())
  );
  let errored = false;
  let session = await getSession(
    request.headers.get("Cookie")
  );

  if (!body.email) {
    errored = true;
    session.flash("emailError", "email is required");
  }
  if (!body.password) {
    errored = true;
    session.flash("passwordError", "password is required");
  }

  if (errored) {
    session.flash("email", body.email);
    session.flash("password", body.password);
    return redirect("/login", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }

  session.set("user", "foo");
  return redirect("/", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

// GET
export let loader: LoaderFunction = async ({ request }) => {
  let session = await getSession(
    request.headers.get("Cookie")
  );
  return json(
    {
      email: session.get("email"),
      password: session.get("password"),
      passwordError: session.get("passwordError"),
      emailError: session.get("emailError"),
    },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  );
};

export default function Login() {
  let session = useRouteData();
  console.log(session);
  return (
    <main>
      <h1>Login</h1>
      <Form method="post">
        <p>
          <label>
            Email Address:
            <br />
            <input
              autoComplete="false"
              type="email"
              defaultValue={session.email}
              // required
              name="email"
            />
          </label>
          {session.emailError && (
            <ErrorMessage>
              {session.emailError}
            </ErrorMessage>
          )}
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
            />
          </label>
          {session.passwordError && (
            <ErrorMessage>
              {session.passwordError}
            </ErrorMessage>
          )}
        </p>
        <p>
          <button type="submit">Login</button>
        </p>
      </Form>
    </main>
  );
}

function ErrorMessage({
  children,
}: {
  children: React.ReactNode;
}) {
  let [mounted, setMounted] = useState(false);
  useEffect(() => {
    let id = setTimeout(() => {
      setMounted(true);
    }, 10);
    return () => clearTimeout(id);
  }, []);
  return (
    <span aria-live="polite" data-fade={String(mounted)}>
      {children}
    </span>
  );
}
