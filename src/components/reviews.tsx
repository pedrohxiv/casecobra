"use client";

import { useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { MaxWidthWrapper } from "@/components/max-width-wrapper";
import { Phone } from "@/components/phone";
import { cn, splitArray } from "@/lib/utils";

interface Props {
  reviews: string[];
  className?: string;
  reviewClassName?: (reviewIndex: number) => string;
  msPerPixel?: number;
}

const ReviewColumn = ({
  reviews,
  className,
  reviewClassName,
  msPerPixel = 0,
}: Props) => {
  const [columnHeight, setColumnHeight] = useState<number>(0);

  const columnRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!columnRef.current) {
      return;
    }

    const resizeObserver = new window.ResizeObserver(() => {
      setColumnHeight(columnRef.current?.offsetHeight ?? 0);
    });

    resizeObserver.observe(columnRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div
      ref={columnRef}
      className={cn("animate-marquee space-y-8 py-4", className)}
      style={
        {
          "--marquee-duration": `${columnHeight * msPerPixel}ms`,
        } as React.CSSProperties
      }
    >
      {reviews.concat(reviews).map((review, i) => (
        <div
          key={i}
          className={cn(
            "animate-fade-in rounded-[2.25rem] bg-white p-6 opacity-0 shadow-xl shadow-slate-900/5",
            reviewClassName?.(i % reviews.length)
          )}
          style={{
            animationDelay: Array.from(
              { length: 6 },
              (_, i) => `${(i * 0.1).toFixed(1)}s`
            )[Math.floor(Math.random() * 6)],
          }}
        >
          <Phone imgSrc={review} />
        </div>
      ))}
    </div>
  );
};

export const Reviews = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const isInView = useInView(containerRef, { once: true, amount: 0.4 });

  const columns = splitArray(
    Array.from({ length: 6 }, (_, i) => `${"/testimonials/"}${i + 1}.jpg`),
    3
  );

  return (
    <MaxWidthWrapper className="relative max-w-5xl">
      <img
        aria-hidden="true"
        src="/what-people-are-buying.png"
        className="absolute select-none hidden xl:block -left-32 top-1/3"
      />
      <div
        ref={containerRef}
        className="relative -mx-4 mt-16 grid h-[49rem] max-h-[150vh] grid-cols-1 items-start gap-8 overflow-hidden px-4 sm:mt-20 md:grid-cols-2 lg:grid-cols-3"
      >
        {isInView && (
          <>
            <ReviewColumn
              reviews={[
                ...columns[0],
                ...splitArray(columns[2], 2).flat(),
                ...columns[1],
              ]}
              reviewClassName={(reviewIndex) =>
                cn({
                  "md:hidden":
                    reviewIndex >=
                    columns[0].length + splitArray(columns[2], 2)[0].length,
                  "lg:hidden": reviewIndex >= columns[0].length,
                })
              }
              msPerPixel={10}
            />
            <ReviewColumn
              reviews={[...columns[1], ...splitArray(columns[2], 2)[1]]}
              className="hidden md:block"
              reviewClassName={(reviewIndex) =>
                reviewIndex >= columns[1].length ? "lg:hidden" : ""
              }
              msPerPixel={15}
            />
            <ReviewColumn
              reviews={splitArray(columns[2], 2).flat()}
              className="hidden md:block"
              msPerPixel={10}
            />
          </>
        )}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-slate-100" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-100" />
      </div>
    </MaxWidthWrapper>
  );
};
