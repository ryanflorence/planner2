import { Meta, Links, Scripts } from "@remix-run/react";
import { NavLink, Outlet } from "react-router-dom";
import styles from "./styles/global.css";
import light from "./styles/light.css";
import dark from "./styles/dark.css";

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
        <link
          rel="stylesheet"
          href={light}
          media="(prefers-color-scheme: light)"
        />
        <link
          rel="stylesheet"
          href={dark}
          media="(prefers-color-scheme: dark)"
        />
        <link rel="stylesheet" href={styles} />
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
          </NavLink>
          <NavLink to="/projects">Projects</NavLink>
          <NavLink to="/account">Account</NavLink>
        </nav>
      </header>
      <Outlet />
    </Document>
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
