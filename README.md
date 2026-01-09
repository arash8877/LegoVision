# BrickVision

**BrickVision** is an advanced AI-powered companion for LEGO® enthusiasts. It leverages cutting-edge computer vision to identify a physical pile of loose bricks and intelligently suggests creative "micro-builds" that can be constructed using only the pieces identified in the original photo.

This project serves as a showcase of modern frontend engineering, sophisticated AI orchestration, and high-fidelity UI/UX design.

## 🚀 Key Features

- **Precision Computer Vision**: Analyzes uploaded photos to generate a pixel-perfect inventory of LEGO bricks, identifying exact dimensions (e.g., 1x4 vs 2x4) and quantities.
- **Strictly Feasible Suggestions**: Unlike standard AI chat interfaces, BrickVision enforces a "Physical Subset Rule"—all suggested builds must be 100% constructible with the specific bricks visible in the user's photo.
- **AI Blueprint Projection**: Dynamically generates stylized, cartoon-accurate 2.5D illustrations of the completed builds using generative image models.
- **Immersive "Bricky" UI**: A custom-designed interface featuring interactive 2.5D SVG-based bricks, scanning animations, and a vibrant palette inspired by classic building sets.
- **Mobile-Responsive Design**: Optimized for a seamless "snap and build" experience on any device.

## 🛠️ Technical Architecture

### Frontend
- **Framework**: [React](https://react.dev/) (v19) with [TypeScript](https://www.typescriptlang.org/) for robust type safety.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) for a modern, utility-first design system.
- **Animations**: Custom CSS keyframes and SVG transforms for the high-tech scanning effects and interactive components.

### AI Engine
- **Logic & Vision**: Powered by the **Gemini 3 Pro** model. It handles complex spatial reasoning to ensure build instructions are logically sound and physically possible.
- **Visuals**: Utilizes **Gemini 2.5 Flash Image** with refined prompt engineering to produce consistent, stylized build manuals.

### Design Principles
- **Separation of Concerns**: The codebase is strictly modularized into specialized components (e.g., `RealisticBrick`, `VisionModal`, `BuildCard`) and service modules for AI interactions.
- **Performance**: Efficient handling of base64 image data and asynchronous state management to provide a smooth user experience during heavy AI processing.

## 🏗️ Project Structure

```text
.
├── components/          # Reusable UI components
│   ├── BuildCard.tsx    # Individual build suggestion view
│   ├── RealisticBrick.tsx # Stylized SVG brick renderer
│   ├── VisionModal.tsx  # Camera/Upload interface
│   └── ...
├── services/            # Core logic and API integrations
│   └── geminiService.ts # Gemini API orchestration
├── types.ts             # Global TypeScript interfaces
├── App.tsx              # Main application entry and state
└── README.md            # You are here!
```

## 🛠️ Getting Started

1.  **Obtain an API Key**: Requires a Google Gemini API key.
2.  **Environment Setup**: Create a `.env` file in the root directory and add your key:
    ```env
    API_KEY=your_gemini_api_key_here
    ```
3.  **Run the App**: Open `index.html` in a modern browser (or serve via a local development server like Vite).

---

*Note: This project is a personal portfolio piece demonstrating the integration of Generative AI into functional, high-quality web applications. It is not affiliated with or endorsed by The LEGO Group.*