import { Prisma, Project } from ".prisma/client";
import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Link, useRouteData } from "@remix-run/react";
import { Outlet } from "react-router";
import { prisma } from "../db";

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
  await prisma.project.create({
    data: {
      title: body.get("title")!,
    },
  });
  return redirect("/projects");
};

const projectWithTasks = Prisma.validator<Prisma.ProjectArgs>()({
  include: { tasks: true },
});

type ProjectWithTasks = Prisma.ProjectGetPayload<typeof projectWithTasks>;

export default function Projects() {
  let projects = useRouteData<ProjectWithTasks[]>();
  return (
    <div
      style={{
        display: "flex",
      }}
    >
      <div
        style={{
          width: "300px",
          height: "100vh",
          overflow: "auto",
          background: "#eee",
          boxSizing: "border-box",
          padding: "10px",
        }}
      >
        <h1>Projects</h1>
        <ul>
          {projects.map((project) => (
            <li key={project.id}>
              <Link to={String(project.id)}>
                {project.title} (
                {project.tasks.filter((task) => !task.complete).length})
              </Link>
            </li>
          ))}
        </ul>
        <form method="post" action="/projects">
          <fieldset>
            <legend>New Project</legend>
            <p>
              <label>
                Title:
                <br />
                <input type="text" name="title" />
              </label>
            </p>
            <p>
              <button type="submit">Create</button>
            </p>
          </fieldset>
        </form>
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
}
