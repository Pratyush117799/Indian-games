# Astra Card Game - Local Setup Instructions

## Prerequisites
Since the automated setup could not run `npm install` (Node.js was not detected in the environment), you must perform the following steps manually.

1.  **Install Node.js**: Download and install the latest LTS version from [nodejs.org](https://nodejs.org/).
2.  **Verify Installation**: Open a command prompt and run `node -v` and `npm -v`.

## Installation & Running

1.  Open your terminal in this directory:
    ```powershell
    cd "c:\Users\USER\Desktop\Astra Card\astra-game"
    ```

2.  Install dependencies:
    ```powershell
    npm install
    ```

3.  Start the Development Server:
    ```powershell
    npm run dev
    ```
    - Open your browser to `http://localhost:5173`.

4.  Run Remotion Video Studio:
    ```powershell
    npm run video
    ```
    - This will open the Remotion player to view the "Card Reveal" animation.

## Project Structure
- `src/components/Card.tsx`: The 3D card component.
- `src/data/weapons.json`: The database of weapons (currently containing the first 6).
- `src/video/`: Contains the Remotion video composition files.
- `src/App.tsx`: The main game layout.
