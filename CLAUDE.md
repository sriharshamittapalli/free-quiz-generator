# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start the Next.js development server at http://localhost:3000
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint to check code quality

### Additional Commands
- Type checking: Run `npx tsc --noEmit` to check TypeScript types
- Install dependencies: `npm install`
- Add shadcn components: `npx shadcn@latest add [component-name]`

## Architecture

This is a **Quiz Generator Application** built with Next.js 15, featuring a sidebar-based quiz configuration interface and interactive quiz display. The application uses a two-step workflow: users generate AI prompts for quiz creation, then paste JSON responses to display interactive quizzes.

### Core Technologies
- **Next.js 15** with App Router architecture
- **React 19** for UI components with React Context for state management
- **TypeScript** for type safety
- **Tailwind CSS v4** for styling
- **shadcn/ui** components built on Radix UI primitives
- **React Hook Form** with Zod validation for form handling

### Application Architecture

#### Layout Structure
- **Root Layout** (`src/app/layout.tsx`) - Basic Next.js layout with font configuration
- **Main Page** (`src/app/page.tsx`) - Renders the QuizApp component
- **Quiz App** (`src/components/quiz-app.tsx`) - Main container with SidebarProvider, manages quiz state
- **Sidebar Layout** - Contains the quiz configuration form, always visible on desktop
- **Main Content Area** - Displays the quiz questions and interactive elements

#### State Management
- **Local State Management** - Uses React useState in QuizApp component for quiz data
- **Quiz Data Flow**: Form → Props → Display Component
- **Type-safe interfaces** for quiz data structure with TypeScript

#### Key Components

**Quiz Configuration (`src/components/quiz-form.tsx`)**:
- Dynamic language-specific topic mapping (Python, FastAPI, Next.js, React, TypeScript)
- Combobox components that allow both selection and custom input
- AI prompt generation with clipboard copying and visual feedback
- JSON input textarea for pasting AI-generated quiz data
- Form validation using Zod schemas and React Hook Form

**Quiz Display (`src/components/quiz-display.tsx`)**:
- Interactive multiple-choice questions with A/B/C/D options
- Answer selection, scoring, and results display
- Show/hide answers with explanations functionality
- Quiz restart functionality to reset all selections
- Color-coded feedback (correct/incorrect answers)

### UI Component System
- **shadcn/ui components** - All UI components must be added via `npx shadcn@latest add [component]`
- Built on Radix UI primitives for accessibility
- Uses class-variance-authority (cva) for component variants  
- Components follow consistent patterns with forwardRef and slot support
- Styling with Tailwind CSS v4 with inline theme configuration (`src/app/globals.css`)
- **Optimized Component Set**: Only essential components are included (13 total):
  - Core: button, form, label, input, textarea, select, card, badge
  - Navigation: sidebar (simplified), combobox (custom), command, popover, separator
- **Custom Combobox** (`src/components/ui/combobox.tsx`) - Allows both selection and typing custom values
- **Simplified Sidebar** - Contains only the 4 components used by the app: `SidebarProvider`, `Sidebar`, `SidebarHeader`, `SidebarInset`

### Data Flow & User Workflow
1. **Configuration Phase**: User configures quiz settings in sidebar form
2. **Prompt Generation**: System generates AI prompt and copies to clipboard
3. **External AI Query**: User takes prompt to Claude/ChatGPT for quiz generation
4. **JSON Import**: User pastes AI-generated JSON back into textarea
5. **Quiz Display**: Parsed quiz data renders as interactive questions in main area
6. **Quiz Taking**: Users can select answers, view scores, and see explanations

### Key Files Structure
- `src/app/page.tsx` - Entry point that renders QuizApp component
- `src/components/quiz-app.tsx` - Main application container with state management and sidebar layout
- `src/components/quiz-form.tsx` - Sidebar form with dynamic language-topic mapping and combobox components
- `src/components/quiz-display.tsx` - Interactive quiz interface with restart functionality
- `src/components/ui/combobox.tsx` - Custom component combining selection and text input
- `src/components/ui/` - shadcn/ui components (sidebar, form, select, command, popover, etc.)

### Import Aliases
- `@/*` maps to `src/*` for clean imports

### Important Notes
- **Component Source**: All new UI components must be added from shadcn/ui only
- **Codebase Optimization**: Components have been cleaned up - only 13 essential shadcn/ui components remain
- **Dependencies**: Uses minimal Radix UI dependencies (5 total): react-label, react-popover, react-select, react-separator, react-slot
- **Language Topics**: Topics are dynamically generated based on official documentation research
- **Combobox Pattern**: Use the custom Combobox for fields requiring both selection and custom input
- **JSON Structure**: Quiz JSON must have "questions" array with question, choices, answer (index), explanation
- **Form Validation**: Uses React Hook Form with Zod schemas for type-safe form handling
- **State Management**: Quiz data managed locally in QuizApp component using useState, passed down via props
- **Styling System**: Uses Tailwind CSS v4 with inline theme configuration and tw-animate-css for animations