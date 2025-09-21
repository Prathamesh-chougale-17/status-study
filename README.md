# Study Dashboard

A beautiful and comprehensive study dashboard to organize your interview preparation and career growth resources in one place. Built with Next.js, MongoDB, and shadcn/ui components.

## Features

- 📚 **Organized Study Topics**: Separate sections for Interview Prep and Career Growth
- 🎯 **Resource Management**: Add, organize, and track your study resources
- 📊 **Progress Tracking**: Monitor your daily, weekly, monthly, and yearly progress
- 🎨 **Beautiful UI**: Modern design with shadcn/ui components
- 💾 **MongoDB Integration**: Persistent data storage
- 📱 **Responsive Design**: Works perfectly on all devices

## Study Topics Included

### Interview Prep
- Data Structures & Algorithms
- Low Level Design
- Core Computer Science
- Behavioral Interview Questions

### Career Growth
- System Design
- Software Engineering Best Practices

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB Atlas account or local MongoDB instance
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd status-study
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/study-dashboard?retryWrites=true&w=majority
NODE_ENV=development
```

4. Run the development server:
```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Dashboard**: View all your study topics organized by category
2. **Topic Pages**: Click on any topic card to manage resources for that topic
3. **Add Resources**: Use the "Add Resource" button to add new study materials
4. **Track Progress**: Update resource status as you complete them
5. **Progress Overview**: Monitor your overall progress in the sidebar

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI Components**: shadcn/ui, Tailwind CSS
- **Database**: MongoDB
- **Icons**: Lucide React
- **Styling**: Tailwind CSS with custom gradients

## Project Structure

```
├── app/
│   ├── api/           # API routes for MongoDB operations
│   ├── topic/[id]/    # Individual topic pages
│   ├── layout.tsx     # Root layout
│   └── page.tsx       # Main dashboard
├── components/ui/     # shadcn/ui components
├── lib/
│   ├── mongodb.ts     # MongoDB connection
│   ├── types.ts       # TypeScript interfaces
│   └── utils.ts       # Utility functions
└── hooks/             # Custom React hooks
```

## API Endpoints

- `GET /api/topics` - Fetch all study topics
- `POST /api/topics` - Create a new topic
- `GET /api/topics/[id]` - Fetch a specific topic
- `PUT /api/topics/[id]` - Update a topic
- `DELETE /api/topics/[id]` - Delete a topic
- `POST /api/resources` - Add a resource to a topic
- `GET /api/progress` - Fetch progress data
- `PUT /api/progress` - Update progress data

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).
