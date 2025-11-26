
# Project Blueprint

## Overview

This project is a text comparison tool, similar to DiffChecker. It allows users to input two blocks of text, compare them, and view the differences.

## Design and Features

### Styling
- **Theme**: Dark and light modes.
- **Primary Color**: `#b52126`
- **Fonts**:
    - Display: Inter
    - Mono: Fira Code
- **UI Components**: shadcn/ui

### Features
- **Text Input**: Two text areas for the original and modified text.
- **Diff Execution**: A button to run the comparison.
- **Diff Results**: A view showing the differences between the two texts.
- **Diff Mode**: Toggle between Line, Word, and Character diffs.
- **View Mode**: Toggle between side-by-side and inline views.
- **Copy and Download**: Buttons to copy the diff result or download it as JSON.
- **Dark/Light Mode Toggle**: A button to switch between color themes.

## Development History

- **2024-05-21**: Initialized the project, set up shadcn/ui, and created the basic UI structure.
- **2024-05-21**: Implemented the diffing logic using the `diff` package and rendered the results.
- **2024-05-21**: Added functionality for copying the diff to the clipboard and downloading it as a JSON file.

## Final Version

The application is now feature-complete and ready for deployment.
