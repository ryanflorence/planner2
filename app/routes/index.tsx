import { MetaFunction, LinksFunction, Link } from "@remix-run/react";

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
    <div>
      <h2>Recent Activity</h2>
      <ul>
        <li>
          <Link to="/projects/1">U14 Soccer</Link>
        </li>
      </ul>
    </div>
  );
}
