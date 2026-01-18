import { prisma } from "@/lib/prisma";

export async function createBidLogic(
  sellerId: string,
  body: {
    projectId: string;
    amount: number;
    estimatedTime: string;
    message: string;
  }
) {
  const { projectId, amount, estimatedTime, message } = body;

  if (!projectId || !amount || !estimatedTime || !message) {
    throw new Error("All fields are required.");
  }

  const existingProject = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!existingProject) {
    throw new Error("Project not found.");
  }

  // Prevent seller from bidding on own project
  if (existingProject.buyerId === sellerId) {
    throw new Error("You cannot bid on your own project.");
  }

  const seller = await prisma.user.findUnique({
    where: { id: sellerId },
    select: { name: true },
  });

  if (!seller) {
    throw new Error("Seller not found.");
  }

  const bid = await prisma.bid.create({
    data: {
      projectId,
      sellerId,
      sellerName: seller.name,
      amount,
      estimatedTime,
      message,
    },
  });

  return bid;
}

export async function getProjectBidsLogic(projectId: string) {
  if (!projectId) {
    throw new Error("projectId is required.");
  }

  const existingProject = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!existingProject) {
    throw new Error("Project not found.");
  }

  const bids = await prisma.bid.findMany({
    where: { projectId },
    include: { seller: true },
  });

  return bids;
}
