import { notFound, redirect } from "next/navigation";

import { db } from "@/lib/db";

import { DesignPreview } from "./_components/design-preview";

interface Props {
  searchParams: { [key: string]: string | string[] | undefined };
}

const PreviewPage = async ({ searchParams }: Props) => {
  const { id } = searchParams;

  if (!id || typeof id !== "string") {
    return notFound();
  }

  const configuration = await db.configuration.findUnique({
    where: {
      id,
    },
  });

  if (!configuration) {
    return notFound();
  }

  if (
    !configuration.croppedImageUrl ||
    !configuration.color ||
    !configuration.model ||
    !configuration.material ||
    !configuration.finish
  ) {
    return redirect(`/configure/design?id=${configuration.id}`);
  }

  return <DesignPreview configuration={configuration} />;
};

export default PreviewPage;
