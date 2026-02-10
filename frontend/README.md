# EchoVerse Frontend

Modern React TypeScript frontend for the EchoVerse text-to-speech platform.

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router v7** - Routing with future flags
- **TanStack Query** - Server state management
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Radix UI** - Accessible primitives
- **Lucide React** - Icons

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

### Testing

```bash
npm test
```

## Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── ui/         # shadcn/ui components
│   │   └── ...         # Custom components
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utilities and helpers
│   ├── pages/          # Page components
│   ├── App.tsx         # Main app component
│   ├── main.tsx        # Entry point
│   └── index.css       # Global styles
├── index.html          # HTML entry point
├── package.json        # Dependencies and scripts
├── vite.config.ts      # Vite configuration
├── tailwind.config.ts  # Tailwind configuration
└── tsconfig.json       # TypeScript configuration
```

## Features

- **Text-to-Speech** - Convert text to natural-sounding speech
- **PDF Upload** - Extract text from PDFs and convert to audio
- **Voice Selection** - Choose from multiple voices
- **Speed Control** - Adjust playback speed
- **Audio Preview** - Preview and download generated audio
- **Responsive Design** - Works on all devices
- **Dark Mode Ready** - Prepared for theme switching

## API Integration

The frontend connects to the backend API at `http://localhost:8000` (configurable).

### Endpoints

- `POST /api/tts` - Text-to-speech conversion
- `POST /api/pdf` - PDF to speech conversion

## Configuration

### Environment Variables

Create a `.env` file:

```env
VITE_API_URL=http://localhost:8000
```

## Development Guidelines

### Code Style

- Use TypeScript for all new files
- Follow ESLint rules
- Use Prettier for formatting
- Use functional components with hooks
- Prefer named exports over default exports

### Component Guidelines

- Keep components small and focused
- Use composition over inheritance
- Extract reusable logic into custom hooks
- Use shadcn/ui components when possible

### State Management

- Use TanStack Query for server state
- Use React hooks (useState, useReducer) for local state
- Avoid prop drilling with context when needed

## Troubleshooting

### Port already in use

If port 5173 is in use, Vite will automatically try the next available port.

### Build errors

Clear node_modules and reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
```

## License

MIT
