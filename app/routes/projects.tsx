import { Prisma, Project } from ".prisma/client";
import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useRouteData } from "@remix-run/react";
import { NavLink } from "react-router-dom";
import { Outlet } from "react-router";
import { prisma } from "../db";
import styles from "../styles/projects.css";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export let loader: LoaderFunction = async () => {
  return prisma.project.findMany({
    include: {
      tasks: true,
    },
  });
};

export let action: ActionFunction = async ({ request }) => {
  let text = await request.text();
  let body = new URLSearchParams(text);
  let project = await prisma.project.create({
    data: {
      title: body.get("title")!,
    },
  });
  return redirect(`/projects/${project.id}`);
};

const projectWithTasks = Prisma.validator<Prisma.ProjectArgs>()({
  include: { tasks: true },
});

type ProjectWithTasks = Prisma.ProjectGetPayload<typeof projectWithTasks>;

export default function Projects() {
  let projects = useRouteData<ProjectWithTasks[]>();
  return (
    <div id="projects">
      <nav>
        <div>
          {projects.map((project) => (
            <NavLink to={String(project.id)}>
              {project.title}{" "}
              <small>
                {project.tasks.filter((task) => !task.complete).length}/
                {project.tasks.length}
              </small>
            </NavLink>
          ))}
        </div>
        <form method="post" action="/projects">
          <input
            type="text"
            name="title"
            aria-label="New projects"
            placeholder="New Project"
          />
          <button type="submit">Add</button>
        </form>
      </nav>
      <div className="page">
        <Outlet />
      </div>
    </div>
  );
}
