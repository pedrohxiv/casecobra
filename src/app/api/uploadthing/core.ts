import sharp from "sharp";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { z } from "zod";

import { db } from "@/lib/db";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .input(z.object({ configId: z.string().optional() }))
    .middleware(({ input }) => ({ input }))
    .onUploadComplete(async ({ metadata, file }) => {
      const { configId } = metadata.input;

      const response = await fetch(file.url);
      const buffer = await response.arrayBuffer();

      const imgMetadata = await sharp(buffer).metadata();

      const { width, height } = imgMetadata;

      if (!configId) {
        const configuration = await db.configuration.create({
          data: {
            width: width || 500,
            height: height || 500,
            imageUrl: file.url,
          },
        });

        return { configId: configuration.id };
      } else {
        const configuration = await db.configuration.update({
          where: {
            id: configId,
          },
          data: {
            croppedImageUrl: file.url,
          },
        });

        return { configId: configuration.id };
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
