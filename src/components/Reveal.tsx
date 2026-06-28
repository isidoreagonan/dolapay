import { Children, useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
};

export function Reveal({ children, delay = 0, y = 24, className = "", as: Tag = "div" }: Props) {
  const ref = useRef<HTMLElement | null>(null);
  // Start "visible" so SSR markup is paint-stable and there's no flash.
  // After hydration we decide whether to animate in.
  const [state, setState] = useState<"ssr" | "hidden" | "visible">("ssr");

  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setState("visible");
      return;
    }
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const alreadyInView = rect.top < vh * 0.9 && rect.bottom > 0;

    if (alreadyInView) {
      setState("visible");
      return;
    }

    setState("hidden");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setState("visible");
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const hidden = state === "hidden";
  const style: React.CSSProperties = {
    transform: hidden ? `translate3d(0, ${y}px, 0)` : "none",
    opacity: hidden ? 0 : 1,
    transition:
      state === "ssr"
        ? undefined
        : `opacity 700ms cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 800ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
    willChange: "opacity, transform",
  };

  // @ts-expect-error dynamic tag
  return <Tag ref={ref} style={style} className={className}>{children}</Tag>;
}

type StaggerProps = {
  children: ReactNode;
  stagger?: number;
  startDelay?: number;
  y?: number;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
  childAs?: keyof React.JSX.IntrinsicElements;
};

/**
 * Wraps each direct child in a Reveal with an incremental delay,
 * for premium scroll-in choreography between sibling elements.
 */
export function Stagger({
  children,
  stagger = 90,
  startDelay = 0,
  y = 20,
  className = "",
  as: Tag = "div",
  childAs = "div",
}: StaggerProps) {
  const items = Children.toArray(children);
  const Wrapper = Tag as unknown as React.ElementType;
  return (
    <Wrapper className={className}>
      {items.map((child, i) => (
        <Reveal key={i} delay={startDelay + i * stagger} y={y} as={childAs}>
          {child}
        </Reveal>
      ))}
    </Wrapper>
  );
}

export default Reveal;
