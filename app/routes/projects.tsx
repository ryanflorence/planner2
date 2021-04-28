import { redirect } from "@remix-run/node";
import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { useRouteData } from "@remix-run/react";
import { NavLink, Outlet } from "react-router-dom";
import styles from "../styles/projects.css";
import { prisma } from "../db";
import { Project } from ".prisma/client";
import { ProjectWithTasks } from "../types";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export let loader: LoaderFunction = async () => {
  let projects = await prisma.project.findMany({
    include: {
      tasks: true,
    },
  });
  return projects;
};

export let action: ActionFunction = async ({ request }) => {
  let body = new URLSearchParams(await request.text());
  let project = await prisma.project.create({
    data: {
      title: body.get("title")!,
    },
  });
  return redirect(`/projects/${project.id}`);
};

export default function Projects() {
  let projects = useRouteData<ProjectWithTasks[]>();
  return (
    <section>
      <nav>
        {projects.map((project, index) => (
          <NavLink key={index} to={String(project.id)}>
            {project.title}{" "}
            <small>
              {project.tasks.filter((t) => t.complete).length}/
              {project.tasks.length}
            </small>
          </NavLink>
        ))}
        <form action="/projects" method="post">
          <input
            type="text"
            placeholder="New project"
            aria-label="New project"
            name="title"
          />
          <button type="submit">Add</button>
        </form>
      </nav>
      <Outlet />
    </section>
  );
}
