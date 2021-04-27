import type { LinksFunction } from "@remix-run/react";
import { Meta, Links, Scripts, useLiveReload } from "@remix-run/react";
import { NavLink, Outlet } from "react-router-dom";

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
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;800&display=swap"
          rel="stylesheet"
        />

        <Meta />
        <Links />
      </head>
      <body>
        <header>
          <nav>
            <NavLink to="/" end>
              Dashboard
            </NavLink>{" "}
            <NavLink to="/projects">Projects</NavLink>{" "}
            <NavLink to="/account">Account</NavLink>
          </nav>
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
