import { motion, useTransform } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

const TestimonialCard = ({ testimonial, progress, index, total }) => {

  const start = index / total;
  const end = (index + 1) / total;

  const translateY = useTransform(progress, [start, end], [0, -1200]);
  const opacity = useTransform(progress, [start, end], [1, 0]);
  const scale = useTransform(progress, [start, end], [1, 0.9]);

  return (
    <motion.div
      style={{
        y: translateY,
        opacity: opacity,
        scale: scale,
        rotate: testimonial.rotation,
        zIndex: total - index,
      }}
      className="absolute inset-x-0 top-0 bottom-0 flex items-center justify-center p-4 h-screen"
    >
      <div className="rounded-2xl p-8 md:p-12 w-full max-w-[775px] shadow-2xl relative overflow-hidden group bg-[url(/images/common/testimonial-bg.webp)] bg-cover">

        <div className="flex flex-col gap-8 md:gap-12">
          <div className="flex justify-between items-start">
            <div className="flex gap-1.5">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-white/10" />
              ))}
            </div>
            <div className="text-white/40 font-bold tracking-tighter text-xl italic uppercase">
              {testimonial.logo}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="h3">
              {testimonial.title}
            </h3>
            <p className="text-muted-foreground text-lg">
              "{testimonial.quote}"
            </p>
          </div>

          <div className="flex items-center gap-4 mt-4">
            <Avatar>
              <AvatarImage src={testimonial.avatar} alt={testimonial.author} className="object-cover" />
              <AvatarFallback>{testimonial.author.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-muted-foreground">{testimonial.author}</span>
              <span className="text-sm text-muted-foreground">{testimonial.role}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TestimonialCard