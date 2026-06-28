import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { l as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/Reveal-BBiBtf47.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Reveal({ children, delay = 0, y = 24, className = "", as: Tag = "div" }) {
	const ref = (0, import_react.useRef)(null);
	const [state, setState] = (0, import_react.useState)("ssr");
	(0, import_react.useEffect)(() => {
		if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
			setState("visible");
			return;
		}
		const el = ref.current;
		if (!el) return;
		const rect = el.getBoundingClientRect();
		const vh = window.innerHeight || document.documentElement.clientHeight;
		if (rect.top < vh * .9 && rect.bottom > 0) {
			setState("visible");
			return;
		}
		setState("hidden");
		const io = new IntersectionObserver((entries) => {
			for (const e of entries) if (e.isIntersecting) {
				setState("visible");
				io.disconnect();
				break;
			}
		}, {
			threshold: .12,
			rootMargin: "0px 0px -8% 0px"
		});
		io.observe(el);
		return () => io.disconnect();
	}, []);
	const hidden = state === "hidden";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
		ref,
		style: {
			transform: hidden ? `translate3d(0, ${y}px, 0)` : "none",
			opacity: hidden ? 0 : 1,
			transition: state === "ssr" ? void 0 : `opacity 700ms cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 800ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
			willChange: "opacity, transform"
		},
		className,
		children
	});
}
//#endregion
export { Reveal as t };
