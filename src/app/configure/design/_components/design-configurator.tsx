"use client";

import { RadioGroup } from "@headlessui/react";
import {
  CaseColor,
  CaseFinish,
  CaseMaterial,
  PhoneModel,
} from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight, Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Rnd } from "react-rnd";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { BASE_PRICE } from "@/constants/products";
import { useUploadThing } from "@/lib/uploadthing";
import { base64ToBlob, cn, formatPrice } from "@/lib/utils";
import {
  COLORS,
  FINISHES,
  MATERIALS,
  MODELS,
} from "@/validators/option-validator";

import { updateConfiguration } from "../actions";

interface Args {
  color: CaseColor;
  model: PhoneModel;
  material: CaseMaterial;
  finish: CaseFinish;
  configId: string;
}

interface Props {
  configId: string;
  imageUrl: string;
  imageDimensions: { width: number; height: number };
}

export const DesignConfigurator = ({
  configId,
  imageUrl,
  imageDimensions,
}: Props) => {
  const [options, setOptions] = useState<{
    color: (typeof COLORS)[number];
    model: (typeof MODELS)[number];
    material: (typeof MATERIALS.options)[number];
    finish: (typeof FINISHES.options)[number];
  }>({
    color: COLORS[0],
    model: MODELS[0],
    material: MATERIALS.options[0],
    finish: FINISHES.options[0],
  });
  const [renderedDimension, setRenderedDimension] = useState<{
    width: number;
    height: number;
  }>({
    width: imageDimensions.width / 4,
    height: imageDimensions.height / 4,
  });
  const [renderedPosition, setRenderedPosition] = useState<{
    x: number;
    y: number;
  }>({
    x: 150,
    y: 205,
  });

  const caseRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const router = useRouter();

  const { toast } = useToast();

  const { startUpload, isUploading } = useUploadThing("imageUploader");

  const { mutate, isPending } = useMutation({
    mutationKey: ["save-config"],
    mutationFn: async (args: Args) => {
      await Promise.all([saveConfiguration(), updateConfiguration(args)]);
    },
    onSuccess: () => {
      router.push(`/configure/preview?id=${configId}`);
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was an error on our end, please try again.",
      });
    },
  });

  const saveConfiguration = async () => {
    try {
      const {
        left: caseLeft,
        top: caseTop,
        width,
        height,
      } = caseRef.current!.getBoundingClientRect();
      const { left: containerLeft, top: containerTop } =
        containerRef.current!.getBoundingClientRect();

      const leftOffset = caseLeft - containerLeft;
      const topOffset = caseTop - containerTop;

      const actualX = renderedPosition.x - leftOffset;
      const actualY = renderedPosition.y - topOffset;

      const canvas = document.createElement("canvas");

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");

      const userImage = new Image();

      userImage.crossOrigin = "anonymous";
      userImage.src = imageUrl;

      await new Promise((resolve) => (userImage.onload = resolve));

      ctx?.drawImage(
        userImage,
        actualX,
        actualY,
        renderedDimension.width,
        renderedDimension.height
      );

      const base64 = canvas.toDataURL().split(",")[1];

      const blob = base64ToBlob(base64, "image/png");

      const file = new File([blob], "filename.png", { type: "image/png" });

      await startUpload([file], { configId });
    } catch {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          "There was a problem saving your config, please try again.",
      });
    }
  };

  return (
    <div className="relative mt-20 grid grid-cols-1 lg:grid-cols-3 mb-20 pb-20">
      <div
        ref={containerRef}
        className={cn(
          "relative h-[37.5rem] overflow-hidden col-span-2 w-full max-w-4xl flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
          {
            "opacity-50": isUploading || isPending,
          }
        )}
      >
        <div className="relative w-60 bg-opacity-50 pointer-events-none aspect-[896/1831]">
          <AspectRatio
            ref={caseRef}
            ratio={896 / 1831}
            className="pointer-events-none relative z-50 aspect-[896/1831] w-full"
          >
            <img
              src="/phone-template.png"
              className="pointer-events-none z-50 select-none"
            />
          </AspectRatio>
          <div className="absolute z-40 inset-0 left-[3px] top-px right-[3px] bottom-px rounded-[32px] shadow-[0_0_0_99999px_rgba(229,231,235,0.6)]" />
          <div
            className={cn(
              "absolute inset-0 left-[3px] top-px right-[3px] bottom-px rounded-[32px]",
              `bg-${options.color.tw}`
            )}
          />
        </div>
        <Rnd
          default={{
            x: 150,
            y: 205,
            height: imageDimensions.height / 4,
            width: imageDimensions.width / 4,
          }}
          onResizeStop={(_, __, ref, ___, { x, y }) => {
            setRenderedDimension({
              height: parseInt(ref.style.height.slice(0, -2)),
              width: parseInt(ref.style.width.slice(0, -2)),
            });
            setRenderedPosition({ x, y });
          }}
          onDragStop={(_, { x, y }) => setRenderedPosition({ x, y })}
          className="absolute z-20 border-[3px] border-primary"
          lockAspectRatio
          resizeHandleComponent={{
            bottomRight: (
              <div className="w-5 h-5 rounded-full shadow border bg-white border-zinc-200 transition hover:bg-primary" />
            ),
            bottomLeft: (
              <div className="w-5 h-5 rounded-full shadow border bg-white border-zinc-200 transition hover:bg-primary" />
            ),
            topRight: (
              <div className="w-5 h-5 rounded-full shadow border bg-white border-zinc-200 transition hover:bg-primary" />
            ),
            topLeft: (
              <div className="w-5 h-5 rounded-full shadow border bg-white border-zinc-200 transition hover:bg-primary" />
            ),
          }}
          disableDragging={isUploading || isPending}
          enableResizing={!isUploading || !isPending}
        >
          <div className="relative w-full h-full">
            <img src={imageUrl} className="pointer-events-none" />
          </div>
        </Rnd>
      </div>
      <div className="h-[37.5rem] w-full col-span-full lg:col-span-1 flex flex-col bg-white">
        <ScrollArea className="relative flex-1 overflow-auto">
          <div
            aria-hidden="true"
            className="absolute z-10 inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white pointer-events-none"
          />
          <div className="px-8 pb-12 pt-8">
            <h2 className="tracking-tight font-bold text-3xl">
              Customize your case
            </h2>
            <div className="w-full h-px bg-zinc-200 my-6" />
            <div className="relative mt-4 h-full flex flex-col justify-between">
              <div className="flex flex-col gap-6">
                <RadioGroup
                  value={options.color}
                  onChange={(value) =>
                    setOptions((prev) => ({ ...prev, color: value }))
                  }
                >
                  <Label>Color: {options.color.label}</Label>
                  <div className="mt-3 flex items-center space-x-3">
                    {COLORS.map((color) => (
                      <RadioGroup.Option
                        key={color.label}
                        value={color}
                        className={({ active, checked, disabled }) =>
                          cn(
                            "relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 active:ring-0 focus:ring-0 active:outline-none focus:outline-none border-2 border-transparent",
                            {
                              [`border-${color.tw}`]: active || checked,
                              "opacity-50 cursor-default": disabled,
                            }
                          )
                        }
                        disabled={isUploading || isPending}
                      >
                        <div
                          className={cn(
                            "h-8 w-8 rounded-full border border-black border-opacity-10",
                            `bg-${color.tw}`
                          )}
                        />
                      </RadioGroup.Option>
                    ))}
                  </div>
                </RadioGroup>
                <div className="relative flex flex-col gap-3 w-full">
                  <Label>Model</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      asChild
                      disabled={isUploading || isPending}
                    >
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between"
                      >
                        {options.model.label}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {MODELS.map((model) => (
                        <DropdownMenuItem
                          key={model.label}
                          className={cn(
                            "flex text-sm gap-1 items-center p-1.5 cursor-pointer hover:bg-zinc-100",
                            {
                              "bg-zinc-100":
                                model.label === options.model.label,
                            }
                          )}
                          onClick={() =>
                            setOptions((prev) => ({ ...prev, model }))
                          }
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4 text-primary",
                              model.label === options.model.label
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {model.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                {[MATERIALS, FINISHES].map(
                  ({ name, options: selectableOptions }) => (
                    <RadioGroup
                      key={name}
                      value={options[name]}
                      onChange={(value) =>
                        setOptions((prev) => ({ ...prev, [name]: value }))
                      }
                    >
                      <Label>
                        {name.slice(0, 1).toUpperCase() + name.slice(1)}
                      </Label>
                      <div className="mt-3 space-y-4">
                        {selectableOptions.map((option) => (
                          <RadioGroup.Option
                            key={option.value}
                            value={option}
                            className={({ active, checked, disabled }) =>
                              cn(
                                "relative block cursor-pointer rounded-lg bg-white px-6 py-4 shadow-sm border-2 border-zinc-200 focus:outline-none ring-0 focus:ring-0 outline-none sm:flex sm:justify-between",
                                {
                                  "border-primary": active || checked,
                                  "opacity-50 cursor-default": disabled,
                                }
                              )
                            }
                            disabled={isUploading || isPending}
                          >
                            <div className="flex items-center">
                              <div className="flex flex-col text-sm">
                                <RadioGroup.Label className="font-medium text-gray-900">
                                  {option.label}
                                </RadioGroup.Label>
                                {option.description && (
                                  <RadioGroup.Description className="text-gray-500 block sm:inline">
                                    {option.description}
                                  </RadioGroup.Description>
                                )}
                              </div>
                            </div>
                            <RadioGroup.Description className="mt-2 flex text-sm sm:ml-4 sm:mt-0 sm:flex-col sm:text-right font-medium text-gray-900">
                              {formatPrice(option.price / 100)}
                            </RadioGroup.Description>
                          </RadioGroup.Option>
                        ))}
                      </div>
                    </RadioGroup>
                  )
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
        <div className="w-full px-8 h-16 bg-white">
          <div className="h-px w-full bg-zinc-200" />
          <div className="w-full h-full flex justify-end items-center">
            <div className="w-full flex gap-6 items-center">
              <p className="font-medium whitespace-nowrap">
                {formatPrice(
                  (BASE_PRICE + options.finish.price + options.material.price) /
                    100
                )}
              </p>
              <Button
                onClick={() =>
                  mutate({
                    configId,
                    color: options.color.value,
                    model: options.model.value,
                    material: options.material.value,
                    finish: options.finish.value,
                  })
                }
                size="sm"
                className="w-full"
                disabled={isUploading || isPending}
              >
                {(isUploading || isPending) && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                Continue
                <ArrowRight className="h-4 w-4 ml-1.5 inline" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
