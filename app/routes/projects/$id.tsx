import { Prisma, Project } from ".prisma/client";
import { LoaderFunction, ActionFunction, redirect } from "@remix-run/node";
import {
  useRouteData,
  Form,
  usePendingFormSubmit,
  useSubmit,
} from "@remix-run/react";
import { useEffect, useRef } from "react";
import { prisma } from "../../db";

export let loader: LoaderFunction = async ({ params }) => {
  let project = await prisma.project.findUnique({
    where: {
      id: parseInt(params.id),
    },
    include: {
      tasks: true,
    },
  });
  return project;
};

export let action: ActionFunction = async ({ request, params }) => {
  let body = new URLSearchParams(await request.text());

  switch (request.method.toLowerCase()) {
    case "post": {
      await prisma.task.create({
        data: {
          projectId: parseInt(params.id),
          title: body.get("title") || "No title",
        },
      });
      await new Promise((res) => setTimeout(res, 300));
      break;
    }
    case "put": {
      await prisma.task.update({
        where: {
          id: parseInt(body.get("id")!),
        },
        data: {
          complete: JSON.parse(body.get("complete")!),
        },
      });
      break;
    }
  }

  return redirect(`/projects/${params.id}`);
};

const projectWithTasks = Prisma.validator<Prisma.ProjectArgs>()({
  include: { tasks: true },
});

type ProjectWithTasks = Prisma.ProjectGetPayload<typeof projectWithTasks>;

export function meta({ data }: { data: ProjectWithTasks }) {
  return {
    title: `${data.title} (${data.tasks.filter((t) => !t.complete).length})`,
  };
}

export default function Project() {
  let project = useRouteData<ProjectWithTasks>();
  let inputRef = useRef<HTMLInputElement>(null);
  let pendingFormSubmit = usePendingFormSubmit();
  let submit = useSubmit();

  useEffect(() => {
    if (pendingFormSubmit) {
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }, [pendingFormSubmit]);

  return (
    <main>
      <h2>{project.title}</h2>
      <ul>
        {project.tasks.map((task) => (
          <li key={task.id}>
            <label>
              <input
                type="checkbox"
                defaultChecked={task.complete}
                onChange={(event) => {
                  submit(
                    {
                      id: String(task.id),
                      complete: String(event.target.checked),
                    },
                    { method: "put", replace: true }
                  );
                }}
              />{" "}
              {task.title}
            </label>
          </li>
        ))}
        {pendingFormSubmit && pendingFormSubmit.method === "post" && (
          <li>
            <label>
              <input disabled type="checkbox" checked={false} />{" "}
              {pendingFormSubmit.data.get("title")}
            </label>
          </li>
        )}
        <li>
          <Form method="post">
            <label>
              <input disabled type="checkbox" checked={false} />{" "}
              <input
                type="text"
                name="title"
                placeholder="New task"
                aria-label="new task"
                ref={inputRef}
              />
            </label>
          </Form>
        </li>
      </ul>
    </main>
  );
}
