# Diff Checker Application

## Overview

A simple, intuitive web application for comparing two blocks of text and highlighting the differences. It provides multiple comparison modes (line, word, character) and views (side-by-side, inline) to suit various use cases, from code review to document analysis.

## Implemented Features

### Core Functionality
*   **Text Input:** Two main text areas for pasting the "Original" and "Modified" text.
*   **Diff Engine:** Utilizes the `diff` library to perform the comparison.
*   **Run Diff Button:** A primary button to initiate the text comparison.

### Comparison Modes
*   **Line Diff:** The default mode, which compares the texts line by line.
*   **Word Diff:** Compares the texts word by word.
*   **Character Diff:** The most granular comparison, showing character-by-character changes.

### Viewing Options
*   **Side-by-Side View:** Displays the original and modified text in two separate panes, with additions and deletions highlighted. This view includes merge controls to select which version to keep.
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
*   **Icons & Tooltips:** Uses `lucide-react` icons and tooltips to provide clear, concise guidance to the user.

### Styling & Components
*   **Framework:** Built with Next.js and React.
*   **Styling:** Uses Tailwind CSS for a utility-first styling approach.
*   **UI Components:** Leverages the `shadcn/ui` component library for pre-built, accessible, and customizable components like `Button`, `Textarea`, `Card`, `Tabs`, and `Tooltip`.
*   **Global Styles:** Includes a well-defined set of global styles and CSS variables for consistent theming and animations.
