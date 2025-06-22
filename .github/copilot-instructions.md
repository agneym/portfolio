### Guidelines for REACT

- Implement useId() for generating unique IDs for accessibility attributes
- Use the new use hook for data fetching in React 19+ projects
- Leverage Server Components for data_fetching_heavy_components when using React with Next.js or similar frameworks
- Consider using the new useOptimistic hook for optimistic UI updates in forms
- Use useTransition for non-urgent state updates to keep the UI responsive

#### NEXT_JS

- Use App Router and Server Components for improved performance and SEO
- Implement route handlers for API endpoints instead of the pages/api directory
- Use server actions for form handling and data mutations from Server Components
- Leverage Next.js Image component with proper sizing for core web vitals optimization
- Implement the Metadata API for dynamic SEO optimization
- Use React Server Components for {{data_fetching_operations}} to reduce client-side JavaScript
- Implement Streaming and Suspense for improved loading states
- Use the new Link component without requiring a child <a> tag
- Leverage parallel routes for complex layouts and parallel data fetching
- Implement intercepting routes for modal patterns and nested UIs
