export const LANGUAGE_TOPICS = {
  python: [
    { value: "variables-data-types", label: "Variables & Data Types" },
    { value: "control-flow", label: "Control Flow (if/else, loops)" },
    { value: "functions", label: "Functions & Parameters" },
    { value: "data-structures", label: "Data Structures (lists, dicts)" },
    { value: "oop", label: "Object-Oriented Programming" },
    { value: "error-handling", label: "Error Handling & Exceptions" },
    { value: "modules-packages", label: "Modules & Packages" },
    { value: "file-io", label: "File I/O Operations" },
    { value: "libraries", label: "Popular Libraries (pandas, numpy)" }
  ],
  fastapi: [
    { value: "basic-setup", label: "Basic Setup & Installation" },
    { value: "path-operations", label: "Path Operations & Routing" },
    { value: "request-response", label: "Request & Response Models" },
    { value: "pydantic-models", label: "Pydantic Data Validation" },
    { value: "dependency-injection", label: "Dependency Injection System" },
    { value: "authentication", label: "Authentication & Security" },
    { value: "async-await", label: "Async/Await & Performance" },
    { value: "database-integration", label: "Database Integration" },
    { value: "testing-debugging", label: "Testing & Debugging" }
  ],
  nextjs: [
    { value: "app-router", label: "App Router & Routing" },
    { value: "server-components", label: "Server & Client Components" },
    { value: "rendering", label: "SSR, SSG & ISR" },
    { value: "api-routes", label: "API Routes & Route Handlers" },
    { value: "data-fetching", label: "Data Fetching Strategies" },
    { value: "styling", label: "Styling (CSS, Tailwind)" },
    { value: "image-optimization", label: "Image & Performance Optimization" },
    { value: "middleware", label: "Middleware & Authentication" },
    { value: "deployment", label: "Deployment & Production" }
  ],
  react: [
    { value: "components-jsx", label: "Components & JSX" },
    { value: "hooks", label: "React Hooks (useState, useEffect)" },
    { value: "state-management", label: "State Management" },
    { value: "props-context", label: "Props & Context API" },
    { value: "event-handling", label: "Event Handling" },
    { value: "lifecycle", label: "Component Lifecycle" },
    { value: "forms-controlled", label: "Forms & Controlled Components" },
    { value: "performance", label: "Performance Optimization" },
    { value: "testing", label: "Testing React Components" }
  ],
  typescript: [
    { value: "basic-types", label: "Basic Types & Type Annotations" },
    { value: "interfaces", label: "Interfaces & Object Types" },
    { value: "functions", label: "Function Types & Parameters" },
    { value: "generics", label: "Generics & Type Parameters" },
    { value: "union-intersection", label: "Union & Intersection Types" },
    { value: "classes", label: "Classes & Inheritance" },
    { value: "modules", label: "Modules & Namespaces" },
    { value: "utility-types", label: "Utility Types & Mapped Types" },
    { value: "type-guards", label: "Type Guards & Type Narrowing" }
  ]
} as const

export const FORM_OPTIONS = {
  languages: [
    { value: "python", label: "Python" },
    { value: "fastapi", label: "FastAPI" },
    { value: "nextjs", label: "Next.js" },
    { value: "react", label: "React" },
    { value: "typescript", label: "TypeScript" }
  ],
  difficulties: [
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" }
  ],
  questionCounts: [
    { value: "5", label: "5" },
    { value: "10", label: "10" },
    { value: "15", label: "15" },
    { value: "20", label: "20" },
    { value: "25", label: "25" },
    { value: "30", label: "30" }
  ]
}

export const DEFAULT_FORM_VALUES = {
  language: "python" as keyof typeof LANGUAGE_TOPICS,
  topic: "variables-data-types",
  difficulty: "intermediate",
  questions: "5"
}