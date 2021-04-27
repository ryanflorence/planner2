import type { MetaFunction } from "@remix-run/react";

export let meta: MetaFunction = () => {
  return { title: "Ain't nothing here" };
};

export default function FourOhFour() {
  return (
    <div>
      <h1>Oops, we don't recognize that url.</h1>
    </div>
  );
}
