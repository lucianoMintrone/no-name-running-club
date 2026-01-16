import { prisma } from "@/lib/prisma";

export class AdminRunService {
  static async updateRun(runId: string, data: { temperature?: number; position?: number }): Promise<void> {
    await prisma.run.update({ where: { id: runId }, data });
  }

  static async deleteRun(runId: string): Promise<void> {
    await prisma.run.delete({ where: { id: runId } });
  }
}

