import { motion } from "motion/react";
import Link from "next/link";

const MotionLink = motion.create(Link);

type Variant = "small" | "medium" | "large";

export default function GetSpendsButton({ variant = "small" }: { variant?: Variant }) {
    const config = {
        small: {
            className: "px-5 py-2 text-sm border-2",
            shadow: "3px 3px 0px #282825",
            hover: { scale: 1.04 },
        },
        medium: {
            className: "px-8 py-4 text-lg border-[3px] w-fit",
            shadow: "4px 4px 0px #282825",
            hover: { x: -2, y: -2, boxShadow: "6px 6px 0px #282825" },
        },
        large: {
            className: "px-9 py-5 text-lg border-[3px] shrink-0",
            shadow: "5px 5px 0px #282825",
            hover: { x: -3, y: -3, boxShadow: "8px 8px 0px #282825" },
        },
    };

    const { className, shadow, hover } = config[variant];

    return (
        <MotionLink
            href="https://drive.google.com/file/d/1GTghNIKWgSDtCTYYmybnRmXRYSjHb1Ps/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={hover}
            whileTap={variant === "small" ? { scale: 0.97 } : { scale: 0.97, x: 0, y: 0 }}
            className={`bg-[#F7CB46] text-[#282825] font-black inline-block cursor-pointer border-[#282825] ${className}`}
            style={{
                fontFamily: "var(--font-jetbrains-mono)",
                boxShadow: shadow,
                letterSpacing: variant === "small" ? "normal" : "0.04em",
            }}
        >
            Get SPENDS
        </MotionLink>
    );
}