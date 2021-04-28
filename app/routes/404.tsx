import type { MetaFunction } from "@remix-run/react";
import styles from "../styles/404.css";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export let meta: MetaFunction = () => {
  return { title: "Ain't nothing here" };
};

export default function FourOhFour() {
  return (
    <main>
      <h1>Oops!</h1>
      <p>Sorry, we don't recognize that url.</p>
    </main>
  );
}
