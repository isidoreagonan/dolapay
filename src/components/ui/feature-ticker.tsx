import { cn } from "@/lib/utils"
import { motion, useAnimationFrame, useMotionValue } from "framer-motion"
import type React from "react"
import { useEffect, useRef, useState } from "react"

interface InfiniteTickerProps {
    children: React.ReactNode[]
    speed?: number
    className?: string
    pauseOnHover?: boolean
    align?: "center" | "start" | "end"
    gap?: string
}

const FeatureTicker = ({
    children,
    speed = 50,
    className,
    pauseOnHover = true,
    align = "center",
    gap = "6" }:
    InfiniteTickerProps) => {
    const [containerWidth, setContainerWidth] = useState(0)
    const [contentWidth, setContentWidth] = useState(0)
    const containerRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)

    const x = useMotionValue(0)
    const [isPaused, setIsPaused] = useState(false)

    useEffect(() => {
        if (containerRef.current && contentRef.current) {
            setContainerWidth(containerRef.current.offsetWidth)
            setContentWidth(contentRef.current.scrollWidth)
        }

        const handleResize = () => {
            if (containerRef.current && contentRef.current) {
                setContainerWidth(containerRef.current.offsetWidth)
                setContentWidth(contentRef.current.scrollWidth)
            }
        }

        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [children])

    useAnimationFrame((t, delta) => {
        if (isPaused || contentWidth === 0) return

        const moveBy = (speed * delta) / 1000
        let newX = x.get() - moveBy

        // Reset when the first set of content has moved off screen
        if (newX <= -contentWidth) {
            newX += contentWidth
        }

        x.set(newX)
    })

    const clonesNeeded = contentWidth > 0 ? Math.ceil(containerWidth / contentWidth) + 1 : 1

    return (
        <div
            ref={containerRef}
            className={cn("relative overflow-hidden whitespace-nowrap", className)}
            onMouseEnter={() => pauseOnHover && setIsPaused(true)}
            onMouseLeave={() => pauseOnHover && setIsPaused(false)}
        >
            <motion.div style={{ x }} className={cn(`flex items-end gap-${gap} md:py-10 py-6`, align === "center" && "justify-center", align === "start" && "justify-start", align === "end" && "justify-end")}>
                <div ref={contentRef} className={cn(`flex items-end gap-${gap} shrink-0`, align === "center" && "justify-center", align === "start" && "justify-start", align === "end" && "justify-end")}>
                    {children}
                </div>
                {/* Render clones */}
                {Array.from({ length: clonesNeeded }).map((_, i) => (
                    <div key={i} className={cn(`flex items-end gap-${gap} shrink-0`, align === "center" && "justify-center", align === "start" && "justify-start", align === "end" && "justify-end")}>
                        {children}
                    </div>
                ))}
            </motion.div>

            {/* Gradient masks for smooth edges */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent pointer-events-none z-10" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent pointer-events-none z-10" />
        </div>
    )
}

export default FeatureTicker