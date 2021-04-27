import type { LinksFunction } from "@remix-run/react";
import { Meta, Links, Scripts } from "@remix-run/react";
import { NavLink, Outlet } from "react-router-dom";

import stylesUrl from "./styles/global.css";

export let links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

function Document({ children }: { children: React.ReactNode }) {
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
        {children}
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <Document>
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
    </Document>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <Document>
      <div
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
      </div>
    </Document>
  );
}

function LiveReload() {
  if (process.env.NODE_ENV !== "development") return null;
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          let ws = new WebSocket("ws://localhost:3001/socket");
          ws.onmessage = message => {
            let event = JSON.parse(message.data);
            if (event.type === "LOG") {
              console.log(event.message);
            }
            if (event.type === "RELOAD") {
              console.log("💿 Reloading window ...");
              window.location.reload();
            }
          };
          ws.onerror = error => {
            console.log("Remix dev asset server web socket error:");
            console.error(error);
          };
      `,
      }}
    />
  );
}
