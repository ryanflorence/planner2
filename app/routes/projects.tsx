import { useRouteData, useSubmit } from "remix";
import { NavLink, Outlet } from "react-router-dom";
import styles from "../styles/projects.css";
import { prisma } from "../db";
import { ActionFunction, redirect } from "remix";
import { Project } from ".prisma/client";
import { ProjectWithTasks } from "../types";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export async function loader() {
  let projects = await prisma.project.findMany({
    include: {
      tasks: true,
    },
  });
  return projects;
}

// POST/PUT/DELETE
export let action: ActionFunction = async ({ request }) => {
  let body = new URLSearchParams(await request.text());
  await prisma.project.create({
    data: {
      title: body.get("title")!,
    },
  });
  return redirect("/projects");
};

export default function Projects() {
  let projects = useRouteData<ProjectWithTasks[]>();

  return (
    <section>
      <nav>
        {projects.length === 0 && <p>Add a Project Below ⬇</p>}
        {projects.map((project) => (
          <NavLink key={project.id} to={String(project.id)}>
            {project.title}{" "}
            <small>
              {project.tasks.filter((t) => t.complete).length}/
              {project.tasks.length}
            </small>
          </NavLink>
        ))}
        <form method="post" action="/projects">
          <input
            type="text"
            placeholder="New project title"
            aria-label="New project title"
            name="title"
          />
          <button type="submit">Add</button>
        </form>
      </nav>
      <Outlet />
    </section>
  );
}
