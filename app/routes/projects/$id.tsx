import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import {
  Form,
  usePendingFormSubmit,
  useRouteData,
  useSubmit,
} from "@remix-run/react";
import { useEffect, useRef } from "react";
import { prisma } from "../../db";
import type { ProjectWithTasks } from "../../types";

export let loader: LoaderFunction = async ({ params }) => {
  return prisma.project.findUnique({
    where: {
      id: parseInt(params.id),
    },
    include: {
      tasks: true,
    },
  });
};

export let action: ActionFunction = async ({ request, params }) => {
  let body = new URLSearchParams(await request.text());

  switch (request.method.toLowerCase()) {
    case "post": {
      await prisma.task.create({
        data: {
          title: body.get("title")!,
          projectId: parseInt(params.id),
        },
      });
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
    }
  }

  return redirect(`/projects/${params.id}`);
};

export default function Project() {
  let project = useRouteData<ProjectWithTasks>();
  let pendingFormSubmit = usePendingFormSubmit();
  let inputRef = useRef<HTMLInputElement>(null);
  let submit = useSubmit();

  useEffect(() => {
    if (pendingFormSubmit) {
      if (inputRef.current) inputRef.current.value = "";
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
                      complete: String(event.target.checked),
                      id: String(task.id),
                    },
                    { method: "put" }
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
              <input type="checkbox" disabled />{" "}
              {pendingFormSubmit.data.get("title")}
            </label>
          </li>
        )}
        <li>
          <input type="checkbox" disabled />{" "}
          <Form method="post">
            <input
              ref={inputRef}
              type="text"
              placeholder="New task"
              aria-label="New task"
              name="title"
            />
          </Form>
        </li>
      </ul>
    </main>
  );
}
