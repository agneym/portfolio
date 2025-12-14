const initial = {
  y: 10,
  opacity: 0,
} as const;

const animate = {
  y: 0,
  opacity: 1,
} as const;

export const getAnimateProps = ({
  delay,
  shouldReduceMotion = false,
}: {
  delay?: number;
  shouldReduceMotion?: boolean | null;
}) => ({
  initial: shouldReduceMotion ? false : initial,
  animate,
  transition: {
    type: "spring" as const,
    delay: delay ?? 0,
  },
});
