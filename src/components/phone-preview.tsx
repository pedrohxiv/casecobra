"use client";

import { CaseColor } from "@prisma/client";
import { useEffect, useRef, useState } from "react";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";
import { COLORS } from "@/validators/option-validator";

interface Props {
  croppedImageUrl: string;
  color: CaseColor;
}

export const PhonePreview = ({ croppedImageUrl, color }: Props) => {
  const [renderedDimensions, setRenderedDimensions] = useState<{
    height: number;
    width: number;
  }>({ height: 0, width: 0 });

  const ref = useRef<HTMLDivElement | null>(null);

  const handleResize = () => {
    if (!ref.current) {
      return;
    }

    const { height, width } = ref.current.getBoundingClientRect();

    setRenderedDimensions({ height, width });
  };

  useEffect(() => {
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [ref.current]);

  return (
    <AspectRatio ref={ref} ratio={3000 / 2001} className="relative">
      <div
        className="absolute z-20 scale-[1.0352]"
        style={{
          left:
            renderedDimensions.width / 2 -
            renderedDimensions.width / (1216 / 121),
          top: renderedDimensions.height / 6.22,
        }}
      >
        <img
          src={croppedImageUrl}
          width={renderedDimensions.width / (3000 / 637)}
          className={cn(
            "phone-skew relative z-20 rounded-t-[15px] rounded-b-[10px] md:rounded-t-[30px] md:rounded-b-[20px]",
            `bg-${
              COLORS.find((supportedColor) => supportedColor.value === color)!
                .tw
            }`
          )}
        />
      </div>
      <div className="relative h-full w-full z-40">
        <img
          src="/clearphone.png"
          className="pointer-events-none h-full w-full antialiased rounded-md"
        />
      </div>
    </AspectRatio>
  );
};
