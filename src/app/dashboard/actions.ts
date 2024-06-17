"use server";

import { OrderStatus } from "@prisma/client";

import { db } from "@/lib/db";

interface Props {
  id: string;
  newStatus: OrderStatus;
}

export const changeOrderStatus = async ({ id, newStatus }: Props) => {
  await db.order.update({
    where: {
      id,
    },
    data: {
      status: newStatus,
    },
  });
};
