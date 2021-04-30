import type { Project } from ".prisma/client";
import { useEffect, useRef } from "react";
import {
  ActionFunction,
  Form,
  LoaderFunction,
  redirect,
  usePendingFormSubmit,
} from "remix";
import { useRouteData, useSubmit } from "remix";
import { prisma } from "../../db";
import { ProjectWithTasks } from "../../types";

export let loader: LoaderFunction = async ({ params }) => {
  return prisma.project.findUnique({
    where: {
      id: Number(params.id),
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
          projectId: Number(params.id),
        },
      });
      break;
    }

    case "put": {
      // await new Promise((res) => setTimeout(res, 1000));
      await prisma.task.update({
        where: {
          id: Number(body.get("id")!),
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
  let ref = useRef<HTMLInputElement>(null);
  let submit = useSubmit();

  useEffect(() => {
    if (pendingFormSubmit) {
      if (ref.current) ref.current.value = "";
    }
  }, [pendingFormSubmit]);

  return (
    <main>
      <h2>{project.title}</h2>
      <ul>
        {project.tasks.map((task) => (
          <li>
            <input
              type="checkbox"
              checked={task.complete}
              onChange={(event) => {
                submit(
                  {
                    complete: String(event.target.checked),
                    id: String(task.id),
                  },
                  {
                    method: "put",
                    replace: true,
                  }
                );
              }}
            />{" "}
            {task.title}
          </li>
        ))}
        {pendingFormSubmit &&
          pendingFormSubmit.method.toLowerCase() === "post" && (
            <li>
              <input type="checkbox" disabled />{" "}
              {pendingFormSubmit.data.get("title")}
            </li>
          )}
        <li>
          <input type="checkbox" disabled />{" "}
          <Form method="post" replace>
            <input
              ref={ref}
              type="text"
              name="title"
              placeholder="New task"
              aria-label="New task"
            />
          </Form>
        </li>
      </ul>
    </main>
  );
}
