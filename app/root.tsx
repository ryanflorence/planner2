import { Meta, Links, Scripts } from "remix";
import { NavLink, Outlet } from "react-router-dom";
import styles from "./styles/global.css";

function Document({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <Meta />

        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="stylesheet" href={styles} />
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

export default function App() {
  return (
    <Document>
      <header>
        <nav>
          <NavLink to="/" end>
            Dashboard
          </NavLink>
          <NavLink to="/projects">Projects</NavLink>
          <NavLink to="/about">About</NavLink>
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
