import type { LinksFunction } from "@remix-run/react";
import { Meta, Links, Scripts, useLiveReload } from "@remix-run/react";
import { Link, Outlet } from "react-router-dom";

import stylesUrl from "./styles/global.css";

export let links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export default function App() {
  useLiveReload();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <Meta />
        <Links />
      </head>
      <body>
        <header>
          <Link to="/">Dashboard</Link> <Link to="/projects">Projects</Link>{" "}
          <Link to="/account">Account</Link>
        </header>
        <Outlet />
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  useLiveReload();
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <title>Oops!</title>
      </head>
      <body
        style={{
          fontFamily: "monospace",
          background: "blue",
          color: "white",
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          fontSize: "2rem",
          paddingBottom: "10rem",
          boxSizing: "border-box",
        }}
      >
        <div>
          <h1>Error</h1>
          <p>{error.message}</p>
        </div>

        <Scripts />
      </body>
    </html>
  );
}
