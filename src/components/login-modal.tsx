import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs";

import { buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const LoginModal = ({ isOpen, setIsOpen }: Props) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="absolute z-[9999999]">
        <DialogHeader>
          <div className="relative mx-auto h-24 w-24 mb-2">
            <img src="/snake-1.png" className="object-contain h-full w-full" />
          </div>
          <DialogTitle className="text-3xl text-center font-bold tracking-tight text-gray-900">
            Login to continue
          </DialogTitle>
          <DialogDescription className="text-base text-center py-2">
            <span className="font-medium text-zinc-900">
              Your configuration was saved!
            </span>{" "}
            Please login or create an account to complete your purchase.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-6 divide-x divide-gray-200">
          <LoginLink className={buttonVariants({ variant: "outline" })}>
            Login
          </LoginLink>
          <RegisterLink className={buttonVariants({ variant: "default" })}>
            Register
          </RegisterLink>
        </div>
      </DialogContent>
    </Dialog>
  );
};
