# TaskMaster

A modern, full-stack todo application built with React, TypeScript, and MongoDB.

## Tech Stack

### Frontend
- React with TypeScript
- Vite for build tooling
- TailwindCSS for styling
- Shadcn/ui for UI components
- React Query for state management

### Backend
- Node.js with TypeScript
- MongoDB for database
- Mongoose for ODM

## Features

- Create, read, update, and delete todos
- Mark todos as complete/incomplete
- Responsive design with mobile support
- Modern UI components
- Type-safe API interactions

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB installed and running
- npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd TaskMaster
```

2. Install dependencies:
```bash
npm install
```

3. Set up your environment variables:
Create a `.env` file in the root directory with the following variables:
```env
MONGODB_URI=your_mongodb_connection_string
```

4. Start the development servers:


```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
TaskMaster/
├── client/             # Frontend React application
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── hooks/     # Custom React hooks
│   │   ├── lib/       # Utility functions
│   │   └── pages/     # Page components
├── server/            # Backend Node.js application
│   ├── db/           # Database configuration
│   ├── models/       # Mongoose models
│   └── routes.ts     # API routes
└── shared/           # Shared TypeScript types
```

