import { prisma } from "@/lib/prisma";

export async function uploadDeliverableLogic(
  projectId: string,
  fileUrl: string
) {
  if (!projectId || !fileUrl) {
    throw new Error("projectId and fileUrl are required.");
  }

  const existingProject = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!existingProject) {
    throw new Error("Project not found.");
  }

  const deliverable = await prisma.deliverable.create({
    data: {
      projectId,
      fileUrl,
    },
  });

  await prisma.project.update({
    where: { id: projectId },
    data: { status: "COMPLETED" },
  });

  return deliverable;
}
