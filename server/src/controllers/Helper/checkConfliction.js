import { ConflictError } from "../../lib/custom.error.js";
import prisma from "../../Prisma/prisma.client.js";
import { format, isAfter, isDate, isBefore } from "date-fns";

// Function to check if a teacher or student has a scheduling conflict
export default async (userId, role, newStartTime, newEndTime, id = null) => {
  const filter = { [role]: userId };
  if (id) filter.id = { not: id };
  const conflict = await prisma.class.findFirst({
    where: {
      ...filter,
      status: { notIn: ["COMPLETED"] },
      AND: [
        {
          OR: [
            {
              startTime: { lte: newStartTime },
              endTime: { gt: newStartTime },
            },
            {
              startTime: { lte: newEndTime },
              endTime: { gte: newEndTime },
            },
            {
              startTime: { gte: newStartTime },
              endTime: { lte: newEndTime },
            },
          ],
        },
      ],
    },
  });
  if (conflict)
    throw new ConflictError(
      `${role.slice(0, -2)} is already scheduled at ${format(
        new Date(conflict.scheduledAt),
        "d MMMM yyyy h:mm a"
      )} for ${conflict.duration} minutes`
    );
};
