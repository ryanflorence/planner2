import { Project } from ".prisma/client";
import { Link, useRouteData } from "remix";
import type { LoaderFunction } from "remix";
import { prisma } from "../db";
import { requireUserSession } from "../session";
import styles from "../styles/index.css";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export let loader: LoaderFunction = ({ request }) => {
  return requireUserSession(request, (session) => {
    return prisma.project.findMany();
  });
};

export default function Index() {
  let projects = useRouteData<Project[]>();

  return (
    <main>
      <h2>Recent Activity</h2>
      <ul>
        {projects.map((project) => (
          <li>
            <Sparkles />{" "}
            <span>
              You created{" "}
              <Link to={`/projects/${project.id}`}>
                {project.title}
              </Link>
            </span>
          </li>
        ))}
      </ul>
    </main>
  );
}

function Sparkles() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="icon"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
      />
    </svg>
  );
}
