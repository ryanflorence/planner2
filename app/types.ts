import { Prisma } from ".prisma/client";

const projectWithTasks = Prisma.validator<Prisma.ProjectArgs>()({
  include: { tasks: true },
});

export type ProjectWithTasks = Prisma.ProjectGetPayload<
  typeof projectWithTasks
>;
