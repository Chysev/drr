import { prisma } from "@/lib/prisma";
import { Report } from "@prisma/client";

export async function getReports(): Promise<Report[]> {
  return await prisma.report.findMany({
    orderBy: { createdAt: "desc" },
  });
}
