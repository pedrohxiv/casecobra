"use client";

import { OrderStatus } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { Check, ChevronsUpDown } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

import { useToast } from "@/components/ui/use-toast";
import { changeOrderStatus } from "../actions";

interface Props {
  id: string;
  orderStatus: OrderStatus;
}

export const StatusDropdown = ({ id, orderStatus }: Props) => {
  const labelMap: Record<keyof typeof OrderStatus, string> = {
    awaiting_shipment: "Awaiting Shipment",
    fulfilled: "Fulfilled",
    shipped: "Shipped",
  };

  const router = useRouter();

  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationKey: ["change-order-status"],
    mutationFn: changeOrderStatus,
    onSuccess: () => {
      router.refresh();
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          "There was a problem updating the order status, please try again.",
      });
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={isPending}>
        <Button
          variant="outline"
          className="w-52 flex justify-between items-center"
        >
          {labelMap[orderStatus]}
          <ChevronsUpDown className="h-4 w-4 ml-2 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-0">
        {Object.keys(OrderStatus).map((status) => (
          <DropdownMenuItem
            key={status}
            className={cn(
              "flex text-sm gap-1 items-center p-2.5 cursor-pointer hover:bg-zinc-100",
              {
                "bg-zinc-100": orderStatus === status,
              }
            )}
            onClick={() => mutate({ id, newStatus: status as OrderStatus })}
          >
            <Check
              className={cn(
                "h-4 w-4 mr-2 text-primary",
                orderStatus === status ? "opacity-100" : "opacity-0"
              )}
            />
            {labelMap[status as OrderStatus]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
