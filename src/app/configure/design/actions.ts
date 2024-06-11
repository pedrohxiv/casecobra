"use server";

import { db } from "@/lib/db";
import {
  CaseColor,
  CaseFinish,
  CaseMaterial,
  PhoneModel,
} from "@prisma/client";

interface Props {
  color: CaseColor;
  model: PhoneModel;
  material: CaseMaterial;
  finish: CaseFinish;
  configId: string;
}

export const updateConfiguration = async ({
  color,
  model,
  material,
  finish,
  configId,
}: Props) => {
  await db.configuration.update({
    where: {
      id: configId,
    },
    data: {
      color,
      model,
      material,
      finish,
    },
  });
};
