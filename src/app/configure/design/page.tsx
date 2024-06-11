import { notFound } from "next/navigation";

import { db } from "@/lib/db";

import { DesignConfigurator } from "./_components/design-configurator";

interface Props {
  searchParams: { [key: string]: string | string[] | undefined };
}

const DesignPage = async ({ searchParams }: Props) => {
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

  const { width, height, imageUrl } = configuration;

  return (
    <DesignConfigurator
      configId={id}
      imageUrl={imageUrl}
      imageDimensions={{ width, height }}
    />
  );
};

export default DesignPage;
