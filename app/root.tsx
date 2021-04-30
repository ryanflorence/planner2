import { Meta, Links, Scripts, LiveReload } from "remix";
import { NavLink, Outlet } from "react-router-dom";
import styles from "./styles/global.css";

export default function App() {
  return (
    <Document>
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
        <header>
          <nav>
            <NavLink to="/" end>
              Dashboard
            </NavLink>
            <NavLink to="/projects">Projects</NavLink>
            <NavLink to="/about">About</NavLink>
          </nav>
        </header>
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
