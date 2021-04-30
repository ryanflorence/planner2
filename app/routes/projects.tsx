import { NavLink, Outlet } from "react-router-dom";
import type { ActionFunction } from "remix";
import { useRouteData, redirect } from "remix";
import { prisma } from "../db";
import styles from "../styles/projects.css";
import { ProjectWithTasks } from "../types";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

// GET
export async function loader() {
  let projects = await prisma.project.findMany({
    include: {
      tasks: true,
    },
  });
  return projects;
}

// POST (PUT DELETE PATCH)
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
        {projects.length === 0 && <p>No projects! Add some ⬇</p>}
        {projects.map((project) => (
          <NavLink to={String(project.id)}>
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
            placeholder="Project title"
            aria-label="Project title"
            name="title"
          />
          <button type="submit">Add</button>
        </form>
      </nav>
      <Outlet />
    </section>
  );
}
