declare module "*.svg?react" {
  import type { ComponentType, SVGProps } from "react";
  const SVGComponent: ComponentType<
    SVGProps<SVGSVGElement> & { title?: string }
  >;
  export default SVGComponent;
}
