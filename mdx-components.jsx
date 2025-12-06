import Image from "next/image";
import { PlaygroundWrapper } from "components/uikit/PlaygroundWrapper";

const PreComponent = (props) => (
  <div className="text-sm whitespace-pre-wrap">
    <pre {...props} />
  </div>
);

const isRemoteUrl = (src) => {
  if (!src) return false;
  return (
    src.startsWith("http://") ||
    src.startsWith("https://") ||
    src.startsWith("//")
  );
};

export function useMDXComponents(components) {
  return {
    ...components,
    Playground: PlaygroundWrapper,
    pre: PreComponent,
    img: (props) => {
      const { src, ...rest } = props;

      if (isRemoteUrl(src)) {
        return (
          <img
            src={src}
            loading="lazy"
            {...rest}
            style={{ width: "100%", height: "auto", ...rest.style }}
          />
        );
      }

      return (
        <Image
          {...props}
          width={800}
          height={400}
          style={{ width: "100%", height: "auto" }}
        />
      );
    },
  };
}
