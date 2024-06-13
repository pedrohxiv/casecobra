"use client";

import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { Configuration } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Confetti from "react-dom-confetti";

import { LoginModal } from "@/components/login-modal";
import { Phone } from "@/components/phone";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { BASE_PRICE, PRODUCT_PRICES } from "@/constants/products";
import { cn, formatPrice } from "@/lib/utils";
import { COLORS, MODELS } from "@/validators/option-validator";

import { createCheckoutSession } from "../actions";

interface Props {
  configuration: Configuration;
}

export const DesignPreview = ({ configuration }: Props) => {
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  const color = COLORS.find(
    (supportedColor) => supportedColor.value === configuration.color
  )!;
  const model = MODELS.find(
    (supportedModel) => supportedModel.value === configuration.model
  )!;

  const router = useRouter();

  const { user } = useKindeBrowserClient();
  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationKey: ["get-checkout-session"],
    mutationFn: createCheckoutSession,
    onSuccess: ({ url }) => {
      if (url) {
        router.push(url);
      } else {
        throw new Error("Unable to retrieve payment URL.");
      }
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was an error on our end, please try again.",
      });
    },
  });

  const handleCheckout = () => {
    if (user) {
      mutate({ configId: configuration.id });
    } else {
      localStorage.setItem("configurationId", configuration.id);

      setIsLoginModalOpen(true);
    }
  };

  useEffect(() => {
    setShowConfetti(true);
  }, []);

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute inset-0 overflow-hidden flex justify-center"
      >
        <Confetti
          active={showConfetti}
          config={{ elementCount: 200, spread: 150, duration: 5000 }}
        />
      </div>
      <LoginModal isOpen={isLoginModalOpen} setIsOpen={setIsLoginModalOpen} />
      <div className="mt-20 grid grid-cols-1 text-sm sm:grid-cols-12 sm:grid-rows-1 sm:gap-x-6 md:gap-x-8 lg:gap-x-12">
        <div className="sm:col-span-4 md:col-span-3 md:row-span-2 md:row-end-2">
          <Phone
            className={cn(`bg-${color.tw}`)}
            imgSrc={configuration.croppedImageUrl!}
          />
        </div>
        <div className="mt-6 sm:col-span-9 sm:mt-0 md:row-end-1">
          <h3 className="text-3xl font-bold tracking-tight text-gray-900">
            Your {model.label} Case
          </h3>
          <p className="mt-3 flex items-center gap-1.5 text-base">
            <Check className="h-4 w-4 text-primary" />
            In stack and ready to ship
          </p>
        </div>
        <div className="sm:col-span-12 md:col-span-9 text-base">
          <div className="grid grid-cols-1 gap-y-8 border-b border-gray-200 py-8 sm:grid-cols-2 sm:gap-x-6 sm:py-6 md:py-10">
            <div>
              <p className="font-medium text-zinc-900">Highlights</p>
              <ol className="mt-3 text-zinc-700 list-disc list-inside">
                <li>Wireless charging compatible</li>
                <li>TPU shock absorption</li>
                <li>Packaging made from recycled materials</li>
                <li>5 year print warranty</li>
              </ol>
            </div>
            <div>
              <p className="font-medium text-zinc-950">Materials</p>
              <ol className="mt-3 text-zinc-700 list-disc list-inside">
                <li>High-quality, durable material</li>
                <li>Scratch and fingerprint resistant coating</li>
              </ol>
            </div>
          </div>
          <div className="mt-8">
            <div className="bg-gray-50 p-6 sm:rounded-lg sm:p-8">
              <div className="flow-root text-sm">
                <div className="flex items-center justify-between py-1 mt-2">
                  <p className="text-gray-600">Base price</p>
                  <p className="font-medium to-gray-900">
                    {formatPrice(BASE_PRICE / 100)}
                  </p>
                </div>
                {configuration.finish === "textured" && (
                  <div className="flex items-center justify-between py-1 mt-2">
                    <p className="text-gray-600">Textured finish</p>
                    <p className="font-medium to-gray-900">
                      {formatPrice(PRODUCT_PRICES.finish.textured / 100)}
                    </p>
                  </div>
                )}
                {configuration.material === "polycarbonate" && (
                  <div className="flex items-center justify-between py-1 mt-2">
                    <p className="text-gray-600">Soft polycarbonate material</p>
                    <p className="font-medium to-gray-900">
                      {formatPrice(PRODUCT_PRICES.material.polycarbonate / 100)}
                    </p>
                  </div>
                )}
                <div className="my-2 h-px bg-gray-200" />
                <div className="flex items-center justify-between py-2">
                  <p className="font-semibold text-gray-900">Order total</p>
                  <p className="font-semibold text-gray-900">
                    {formatPrice(
                      (BASE_PRICE +
                        (configuration.finish === "textured"
                          ? PRODUCT_PRICES.finish.textured
                          : 0) +
                        (configuration.material === "polycarbonate"
                          ? PRODUCT_PRICES.material.polycarbonate
                          : 0)) /
                        100
                    )}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-8 flex justify-end pb-12">
              <Button
                onClick={handleCheckout}
                size="sm"
                className="px-4 sm:px-6 lg:px-8"
                disabled={isPending}
              >
                Checkout
                <ArrowRight className="h-4 w-4 ml-1.5 inline" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
