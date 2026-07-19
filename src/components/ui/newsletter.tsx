import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

export interface NewsletterProps extends React.FormHTMLAttributes<HTMLFormElement> {
  placeholder?: string;
  className?: string;
}

const Newsletter = React.forwardRef<HTMLFormElement, NewsletterProps>(
  ({ placeholder = "Enter Your Email", className, ...props }, ref) => {
    const [email, setEmail] = React.useState("");
    const [submitted, setSubmitted] = React.useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
      setSubmitted(true);
      toast.success("You're on the list!", {
        description: "We'll email you as soon as early access opens.",
      });
    };

    if (submitted) {
      return (
        <div
          role="status"
          aria-live="polite"
          className={cn(
            "flex items-center gap-3 w-full max-w-[490px] min-h-[58px] rounded-[56px]",
            "bg-[rgba(255,255,255,0.1)] border-[1.12698px] border-solid border-[rgba(255,255,255,0.2)]",
            "px-[22px] py-3 text-white",
            className
          )}
        >
          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" aria-hidden="true" />
          <span className="text-[16px]">Thanks — you're on the early access list.</span>
        </div>
      );
    }

    return (
      <form
        ref={ref}
        onSubmit={handleSubmit}
        className={cn(
          "flex items-center w-full max-w-[490px] h-[58px] rounded-[56px]",
          "bg-[rgba(255,255,255,0.1)] border-[1.12698px] border-solid border-[rgba(255,255,255,0.1)]",
          "px-[22px] py-[6px] pr-[2px]",
          "font-normal text-[18px] leading-[140%] tracking-[-0.02em] text-white",
          className
        )}
        {...props}
      >
        <label htmlFor="newsletter-email" className="sr-only">Email address</label>
        <input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "flex-1 h-full w-full bg-transparent border-0 outline-none",
            "text-white placeholder:text-white/70",
            "font-normal text-[18px] leading-[140%] tracking-[-0.02em]",
            "pr-2"
          )}
          style={{
            fontFamily: "'Inter Tight', sans-serif",
          }}
        />
        <Button
          type="submit"
          variant="form"
          className="flex-shrink-0"
        >
          Send Code
        </Button>
      </form>
    );
  }
);

Newsletter.displayName = "Newsletter";

export { Newsletter };

