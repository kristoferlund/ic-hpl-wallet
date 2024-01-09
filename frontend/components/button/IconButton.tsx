import { VariantProps, cva } from "cva";
import { ButtonHTMLAttributes, ReactNode } from "react";

const iconButtonCVA = cva(["bg-acceptButtonColor", "m-0", "rounded-md"], {
  variants: {
    color: {
      inherit: [],
      primary: ["bg-AccpetButtonColor"],
      secondary: [],
      success: [],
      error: [],
      info: [],
      warning: [],
    },
    enabled: {
      false: ["opacity-50 cursor-not-allowed"],
      true: [],
    },
    size: {
      small: ["p-0.5"],
      medium: ["p-1"],
      large: ["p-2"],
    },
  },
  compoundVariants: [],
  defaultVariants: {
    color: "primary",
    enabled: true,
    size: "small",
  },
});

export interface IconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color">,
    VariantProps<typeof iconButtonCVA> {
  icon: ReactNode;
}

export default function IconButton(props: IconButtonProps) {
  const { icon, className, onClick } = props;

  return (
    <button className={iconButtonCVA({ className })} onClick={onClick}>
      {icon}
    </button>
  );
}
