# Diff Checker Application

## Overview

A simple, intuitive web application for comparing two blocks of text and highlighting the differences. It provides multiple comparison modes (line, word, character) and views (side-by-side, inline) to suit various use cases, from code review to document analysis. The application is built with a high-performance diffing engine to ensure fast and accurate results.

## Implemented Features

### Core Functionality
*   **Text Input:** Two main text areas for pasting the "Original" and "Modified" text.
*   **Diff Engine:** Utilizes Google's **`diff-match-patch`** library, which employs the high-performance Myers diff algorithm to produce fast and accurate comparisons.
*   **Run Diff Button:** A primary button to initiate the text comparison.

### Comparison Modes
*   **Line Diff:** The default mode, which compares the texts line by line.
*   **Word Diff:** Compares the texts word by word.
*   **Character Diff:** The most granular comparison, showing character-by-character changes.

### Viewing Options
*   **Side-by-Side View:** Displays the original and modified text in two separate panes. Additions and deletions are highlighted, and modified lines show granular, inline changes on the same row. This view includes merge controls to select which version to keep.
*   **Inline View:** Shows a single, unified view of the text with color-coded highlighting for additions and deletions.

### Results & Output
*   **Interactive Results Pane:** The differences are displayed in a clear, easy-to-read format.
*   **Copy to Clipboard:** Allows users to copy the raw diff output (with `+` and `-` prefixes) to their clipboard.
*   **Download as JSON:** Provides an option to download the raw diff data as a structured JSON file.
*   **Merge Functionality:** Users can select which changes to keep and then copy the merged result to their clipboard.

### Design & UI
*   **Modern Aesthetics:** Clean, modern design with a focus on usability.
*   **Dark/Light Mode:** Includes a theme toggler for user preference.
*   **Responsive Layout:** Adapts to various screen sizes for a seamless experience on desktop and mobile.
*   **Optimized Diff View:** The side-by-side comparison view is optimized with reduced line height for a more compact and readable presentation.
*   **Icons & Tooltips:** Uses `lucide-react` icons and tooltips to provide clear, concise guidance to the user.

### Styling & Components
*   **Framework:** Built with Next.js and React.
*   **Styling:** Uses Tailwind CSS for a utility-first styling approach.
*   **UI Components:** Leverages the `shadcn/ui` component library for pre-built, accessible, and customizable components like `Button`, `Textarea`, `Card`, `Tabs`, and `Tooltip`.
*   **Global Styles:** Includes a well-defined set of global styles and CSS variables for consistent theming and animations.

## Latest Update: Performance & UI Refactor

*   **Upgraded Diff Engine:** Replaced the `diff` library with Google's `diff-match-patch` library. This provides more efficient and accurate diffing using the Myers algorithm.
*   **Refactored Core Logic:** The primary diffing and rendering functions (`runDiff`, `getAlignedLineDiff`) were completely rewritten to integrate the new library and improve maintainability.
*   **Fixed Line Height:** Resolved a UI issue where the side-by-side view had excessive line height, making the diff view more compact and easier to read.
