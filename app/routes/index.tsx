import { MetaFunction, LinksFunction, Link } from "@remix-run/react";
import { Sparkles } from "../icons";

import stylesUrl from "../styles/index.css";

export let meta: MetaFunction = () => {
  return {
    title: "Remix Starter",
    description: "Welcome to remix!",
  };
};

export let links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export default function Index() {
  return (
    <main>
      <h2>Recent Activity</h2>
      <ul>
        <li>
          <Sparkles />
          <span>
            You created <Link to="/projects/1">U14 Soccer</Link>
          </span>
        </li>
        <li>
          <Sparkles />
          <span>
            You created <Link to="/projects/2">Remix</Link>
          </span>
        </li>
        <li>
          <Sparkles />
          <span>
            You created <Link to="/projects/3">Other thing</Link>
          </span>
        </li>
      </ul>
    </main>
  );
}
