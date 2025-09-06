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
- **React 19** for UI components with local state management
- **TypeScript** for type safety
- **Tailwind CSS v4** for styling
- **shadcn/ui** components built on Radix UI primitives
- **Simple form handling** with React useState
- **react-markdown** with remark-breaks for universal text formatting

### Application Architecture

#### Layout Structure
- **Root Layout** (`src/app/layout.tsx`) - Basic Next.js layout with font configuration
- **Main Page** (`src/app/page.tsx`) - Renders the QuizApp component
- **Quiz App** (`src/components/quiz-app.tsx`) - Main container with split-panel layout, manages quiz state
- **Left Panel** - Contains the quiz configuration form (fixed width: 384px)
- **Right Panel** - Displays the quiz questions and interactive elements (flexible width)

#### State Management
- **Local State Management** - Uses React useState in QuizApp component for quiz data
- **Quiz Data Flow**: Form → Props → Display Component
- **Type-safe interfaces** for quiz data structure with TypeScript

#### Key Components

**Quiz Configuration (`src/components/quiz-form.tsx`)**:
- Simple input fields for language, topic, difficulty, and number of questions
- Helpful placeholder text to guide users on what to enter
- AI prompt generation with clipboard copying and visual feedback
- JSON input textarea for pasting AI-generated quiz data
- Universal JSON format support via normalizer utility
- Basic form validation

**Quiz Display (`src/components/quiz-display.tsx`)**:
- Interactive multiple-choice questions with A/B/C/D options
- ReactMarkdown rendering with proper newline handling for code snippets
- Answer selection, scoring, and results display
- Show/hide answers with explanations functionality
- Quiz restart functionality to reset all selections
- Color-coded feedback (correct/incorrect answers)
- Navigation between questions with Previous/Next buttons

### UI Component System
- **shadcn/ui components** - All UI components must be added via `npx shadcn@latest add [component]`
- Built on Radix UI primitives for accessibility
- Uses class-variance-authority (cva) for component variants  
- Components follow consistent patterns with forwardRef and slot support
- Styling with Tailwind CSS v4 with inline theme configuration (`src/app/globals.css`)
- **Optimized Component Set**: Only essential components are included (5 total):
  - Core: button, input, textarea, card, badge
- **Text Formatting** - ReactMarkdown with remark-breaks plugin for proper newline handling

### Data Flow & User Workflow
1. **Configuration Phase**: User configures quiz settings in sidebar form
2. **Prompt Generation**: System generates AI prompt and copies to clipboard
3. **External AI Query**: User takes prompt to Claude/ChatGPT for quiz generation
4. **JSON Import**: User pastes AI-generated JSON back into textarea
5. **Quiz Display**: Parsed quiz data renders as interactive questions in main area
6. **Quiz Taking**: Users can select answers, view scores, and see explanations

### Key Files Structure
- `src/app/page.tsx` - Entry point that renders QuizApp component
- `src/components/quiz-app.tsx` - Main application container with split-panel layout and state management
- `src/components/quiz-form.tsx` - Left panel form with dynamic language-topic mapping and JSON processing
- `src/components/quiz-display.tsx` - Right panel quiz interface with ReactMarkdown rendering
- `src/components/ui/` - shadcn/ui components (button, input, textarea, card, badge)
- `src/utils/quiz-normalizer.ts` - Utility for handling different AI-generated JSON formats
- `src/utils/text-formatter.ts` - Utility for preprocessing text for proper markdown rendering
- `src/types/quiz.ts` - TypeScript interfaces for quiz data structure

### Import Aliases
- `@/*` maps to `src/*` for clean imports

### Important Notes
- **Component Source**: All new UI components must be added from shadcn/ui only
- **Codebase Optimization**: Components have been cleaned up - only 7 essential shadcn/ui components remain
- **Dependencies**: Uses minimal Radix UI dependencies
- **Simple Input Pattern**: All form fields use standard HTML input elements with helpful placeholders
- **JSON Structure**: Supports flexible formats - `choices` can be array or object `{A: "...", B: "...", C: "...", D: "..."}`
- **Text Formatting**: All text content rendered through ReactMarkdown with remark-breaks for proper newlines
- **Form Validation**: Uses simple JavaScript validation with clear error messages
- **State Management**: Quiz data managed locally in QuizApp component using useState, passed down via props
- **Styling System**: Uses Tailwind CSS v4 with inline theme configuration and tw-animate-css for animations
# important-instruction-reminders
Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.