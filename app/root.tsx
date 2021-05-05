import {
  Meta,
  Links,
  Scripts,
  LiveReload,
  json,
  useRouteData,
  Form,
} from "remix";
import type { LoaderFunction } from "remix";
import { NavLink, Outlet } from "react-router-dom";
import styles from "./styles/global.css";
import {
  getSession,
  commitSession,
  requireUserSession,
  getUserSession,
} from "./session";

export let loader: LoaderFunction = async ({ request }) => {
  let userSession = await getUserSession(request);
  return json({ userSession });
};

export default function App() {
  let data = useRouteData();
  return (
    <Document>
      {data.userSession ? (
        <header>
          <nav>
            <NavLink to="/" end>
              Dashboard
            </NavLink>
            <NavLink to="/projects">Projects</NavLink>
            <NavLink to="/about">About</NavLink>
            <Form method="post" action="/logout">
              <button type="submit">Logout</button>
            </Form>
          </nav>
        </header>
      ) : (
        <header>
          <nav>
            <NavLink to="/TODO">Sign up!</NavLink>
          </nav>
          <nav>
            <NavLink to="/TODO">Order a sandwich!</NavLink>
          </nav>
        </header>
      )}
      <Outlet />
    </Document>
  );
}

function Document({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <Meta />

        <link rel="stylesheet" href={styles} />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <Links />
      </head>
      <body>
        {children}
        <LiveReload />
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return (
    <Document>
      <div className="error">
        <div>
          <h1>Error</h1>
          <p>{error.message}</p>
        </div>
      </div>
    </Document>
  );
}
