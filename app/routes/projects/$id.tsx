import { Project } from ".prisma/client";
import { ActionFunction, LoaderFunction, redirect } from "remix";
import { Form, usePendingFormSubmit, useRouteData, useSubmit } from "remix";
import { useEffect, useRef } from "react";
import { prisma } from "../../db";
import { ProjectWithTasks } from "../../types";

export let loader: LoaderFunction = ({ params }) => {
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
          id: Number(body.get("id")),
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
          <li key={task.id}>
            <label>
              <input
                onChange={(event) => {
                  submit(
                    {
                      complete: String(event.target.checked),
                      id: String(task.id),
                    },
                    { method: "put" }
                  );
                }}
                type="checkbox"
                checked={
                  pendingFormSubmit &&
                  pendingFormSubmit.data.get("id") === String(task.id)
                    ? JSON.parse(
                        pendingFormSubmit.data.get("complete") as string
                      )
                    : task.complete
                }
              />{" "}
              {task.title}
            </label>
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
          <Form method="post">
            <input
              ref={ref}
              type="text"
              placeholder="Task title"
              aria-label="Task title"
              name="title"
            />
          </Form>
        </li>
      </ul>
    </main>
  );
}
