import { prisma } from "@/lib/prisma";
import { uploadToCloudinary } from "@/lib/utils/cloudinary";

export async function updateProjectStatus(
  projectId: string,
  status: string,
  bidId?: string,
  fileBase64?: string
) {
  const validStatuses = ["PENDING", "IN_PROGRESS", "COMPLETED"];
  if (!validStatuses.includes(status)) {
    throw new Error("Invalid status value");
  }

  let fileData: any = null;

  if (fileBase64) {
    fileData = await uploadToCloudinary(fileBase64);
  }

  const result = await prisma.$transaction(async (tx) => {
    const updateData: any = {
      status,
      selectedBid: bidId ?? null,
    };

    if (fileData) {
      updateData.completionDocumentUrl = fileData.url;
      updateData.completionDocumentName = fileData.name;
      updateData.completionDocumentSize = fileData.size;
      updateData.documentUploadedAt = new Date();
    }

    const project = await tx.project.update({
      where: { id: projectId },
      data: updateData,
      include: {
        bids: true,
      },
    });

    if (bidId) {
      await tx.bid.update({
        where: { id: bidId },
        data: {
          bidStatus:
            status === "IN_PROGRESS"
              ? "SELECTED"
              : status === "COMPLETED"
              ? "COMPLETED"
              : "SUBMITTED",
        },
      });
    }

    return project;
  });

  return {
    ...result,
    completionDocument: fileData || null,
  };
}
