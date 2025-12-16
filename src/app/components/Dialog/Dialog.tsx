import { cn } from "@/app/utils";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ForwardedRef, forwardRef } from "react";

const DialogOverlay = forwardRef((props, ref: ForwardedRef<HTMLDivElement>) => {
  return (
    <DialogPrimitive.Overlay
      ref={ref}
      className="fixed inset-0 z-40 bg-[#F0F0F0] opacity-90 animate-in fade-in duration-200 dark:opacity-70"
      {...props}
    />
  );
});

DialogOverlay.displayName = "DialogOverlay";

const DialogContent = forwardRef(
  (
    { children }: React.ComponentProps<"div">,
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    return (
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "bg-theme-grey-1 border-theme-grey-4 xs:max-w-[330px] fixed top-[50%] left-[50%] z-50 grid w-[330px] max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 border p-6 shadow-lg sm:w-full sm:max-w-[600px]",
          "animate-in fade-in zoom-in-95 duration-200",
        )}
      >
        <DialogClose>x</DialogClose>
        {children}
      </DialogPrimitive.Content>
    );
  },
);

DialogContent.displayName = "DialogContent";

function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return (
    <DialogPrimitive.Close
      data-slot="dialog-close"
      className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
      {...props}
    >
      <svg
        width="24"
        height="25"
        viewBox="0 0 24 25"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M18.75 5.75L5.25 19.25"
          stroke="#7A7A7A"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M18.75 19.25L5.25 5.75"
          stroke="#7A7A7A"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="sr-only">Close</span>
    </DialogPrimitive.Close>
  );
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        "font-theme-2 text-3xl leading-none font-bold text-[#333]",
        className,
      )}
      {...props}
    />
  );
}

export { DialogOverlay, DialogContent, DialogClose, DialogTitle };
