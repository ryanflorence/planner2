import { Meta, Links, Scripts, LiveReload } from "remix";
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
