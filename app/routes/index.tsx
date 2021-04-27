import { Project } from ".prisma/client";
import {
  MetaFunction,
  LinksFunction,
  LoaderFunction,
  Link,
  useRouteData,
} from "@remix-run/react";
import { prisma } from "../db";
import { Sparkles } from "../icons";

import stylesUrl from "../styles/index.css";

export let loader: LoaderFunction = () => {
  return prisma.project.findMany();
};

export let meta: MetaFunction = () => {
  return {
    title: "Tasks!",
  };
};

export let links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export default function Index() {
  let data = useRouteData<Project[]>();
  return (
    <main>
      <h2>Recent Activity</h2>
      <ul>
        {data.map((project) => (
          <li>
            <Sparkles />
            <span>
              You created{" "}
              <Link to={`/projects/${project.id}}`}>{project.title}</Link>
            </span>
          </li>
        ))}
      </ul>
    </main>
  );
}
