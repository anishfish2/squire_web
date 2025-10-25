# Squire Web - Landing Page & Waitlist

A modern, responsive landing page with waitlist signup functionality built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- **Modern Design**: Beautiful gradient background with glassmorphic components
- **Responsive Layout**: Works seamlessly on desktop, tablet, and mobile devices
- **Waitlist Signup**: Email validation and duplicate prevention
- **Real-time Feedback**: Loading states and success/error messages
- **Type Safety**: Full TypeScript implementation
- **API Route**: RESTful endpoint for handling waitlist submissions

## Tech Stack

- **Framework**: Next.js 15.0.3 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **React**: 18.3.1

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd squire_web
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
squire_web/
├── app/
│   ├── api/
│   │   └── waitlist/
│   │       └── route.ts      # API endpoint for waitlist
│   ├── globals.css           # Global styles with Tailwind
│   ├── layout.tsx            # Root layout component
│   └── page.tsx              # Landing page component
├── public/                   # Static assets
├── package.json              # Dependencies and scripts
├── tailwind.config.ts        # Tailwind configuration
├── tsconfig.json            # TypeScript configuration
└── next.config.ts           # Next.js configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server

## API Endpoints

### POST /api/waitlist
Submit an email to join the waitlist.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Success Response (201):**
```json
{
  "message": "Successfully added to waitlist",
  "email": "user@example.com"
}
```

**Error Responses:**
- 400: Invalid email format
- 409: Email already exists
- 500: Server error

### GET /api/waitlist
Get waitlist statistics (for admin purposes).

**Response:**
```json
{
  "count": 42,
  "message": "Waitlist statistics"
}
```

## Features to Add

For production deployment, consider adding:

1. **Database Integration**: Replace in-memory storage with a database (PostgreSQL, MongoDB, etc.)
2. **Email Service**: Send confirmation emails using SendGrid, AWS SES, or similar
3. **Rate Limiting**: Prevent abuse of the waitlist endpoint
4. **Analytics**: Add tracking for conversions and user behavior
5. **A/B Testing**: Test different copy and designs
6. **Environment Variables**: Store sensitive configuration in `.env` files
7. **Error Tracking**: Integrate Sentry or similar for error monitoring
8. **Admin Dashboard**: View and manage waitlist signups

## Deployment

The application is ready to deploy to:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- **Railway**
- **Render**

## License

MIT

## Support

For questions or issues, please open a GitHub issue.