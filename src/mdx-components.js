export function useMDXComponents(components) {
  return {
    ...components,
    Playground: () => null,
  };
}
