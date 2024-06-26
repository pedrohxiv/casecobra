"use server";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Order } from "@prisma/client";

import { BASE_PRICE, PRODUCT_PRICES } from "@/constants/products";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";

interface Props {
  configId: string;
}

export const createCheckoutSession = async ({ configId }: Props) => {
  const { getUser } = getKindeServerSession();

  const user = await getUser();

  if (!user) {
    throw new Error("You need to be logged in");
  }

  const configuration = await db.configuration.findUnique({
    where: {
      id: configId,
    },
  });

  if (!configuration) {
    throw new Error("No such configuration found");
  }

  const { material, finish } = configuration;

  const price =
    BASE_PRICE +
    (finish === "textured" ? PRODUCT_PRICES.finish.textured : 0) +
    (material === "polycarbonate" ? PRODUCT_PRICES.material.polycarbonate : 0);

  let order: Order | undefined = undefined;

  const existingOrder = await db.order.findFirst({
    where: {
      userId: user.id,
      configurationId: configuration.id,
    },
  });

  if (existingOrder) {
    order = existingOrder;
  } else {
    order = await db.order.create({
      data: {
        amount: price / 100,
        userId: user.id,
        configurationId: configuration.id,
      },
    });
  }

  const product = await stripe.products.create({
    name: "Custom iPhone Case",
    images: [configuration.imageUrl],
    default_price_data: { currency: "USD", unit_amount: price },
  });

  const stripeSession = await stripe.checkout.sessions.create({
    success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${order.id}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/configure/preview?id=${configuration.id}`,
    payment_method_types: ["card"],
    mode: "payment",
    shipping_address_collection: { allowed_countries: ["BR"] },
    metadata: { userId: user.id, orderId: order.id },
    line_items: [{ price: product.default_price as string, quantity: 1 }],
  });

  return { url: stripeSession.url };
};
