# Gate Pass Management System

A modern, secure, and real-time gate pass management solution built with Next.js, featuring comprehensive form validation, authentication, and interactive dashboards.

## 🚀 Features

- **Secure Authentication**:
  - Robust user management implemented using Clerk
  - Two-factor authentication (2FA) for added security
  - OAuth integration for Google and other providers
- **Real-time Dashboard**:
  - Interactive widgets for quick insights
  - Real-time data visualization using dynamic charts
- **Gate Pass Management**:
  - Create new gate passes with comprehensive form validation
  - View, search, and filter existing gate passes
  - Delete individual or multiple gate passes with confirmation dialogs
  - Real-time feedback for form validation errors
- **Responsive Design**:
  - Fully responsive UI optimized for mobile, tablet, and desktop screens
  - Built using Tailwind CSS and Hero UI components
- **Smooth Animations**:
  - Enhanced user experience with Framer Motion animations for transitions and UI interactions
- **Accessibility Features**:
  - ARIA labels and keyboard navigation support for better accessibility

## 🛠️ Tech Stack

- **Frontend & Backend**: [Next.js](https://nextjs.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (hosted on [NeonTech](https://neon.tech/))
- **Authentication**: [Clerk](https://clerk.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Components**: [Hero UI](https://heroicons.com/)
- **Form Validation**: [Zod](https://zod.dev/)
- **API Integration**: [Axios](https://axios-http.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Hosting**: [Vercel](https://vercel.com/)
- **Language**: TypeScript

## ⚙️ Prerequisites

Before running this project, ensure you have:

- Node.js (v16.x or later)
- npm (v7.x or later) or yarn

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/cipherprofessor/GatePassSystem.git
cd gatepass-management
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory with the following variables:

```env
DATABASE_URL=your_neontech_postgres_url
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

### 4. Run the development server

```bash
npm run dev
# or
yarn dev
```

### 5. Build for production

```bash
npm run build
# or
yarn build
```

## 🔐 Authentication

This project uses Clerk for authentication. Follow these steps to configure:

1. Sign up at [Clerk](https://clerk.dev/).
2. Create a new application in the Clerk dashboard.
3. Copy your API keys from the dashboard and paste them into your `.env.local` file.

## 📚 API Documentation

### Gate Pass Endpoints

- **Create a new gate pass**:
  ```http
  POST /api/gatepass
  ```
- **Retrieve all gate passes**:
  ```http
  GET /api/gatepass
  ```
- **Retrieve a specific gate pass**:
  ```http
  GET /api/gatepass/:id
  ```
- **Delete a specific gate pass**:
  ```http
  DELETE /api/gatepass/:id
  ```
- **Delete multiple gate passes**:
  ```http
  DELETE /api/gatepass
  ```

### Sample API Request

#### Create a New Gate Pass

```json
POST /api/gatepass
{
  "visitorName": "John Doe",
  "purpose": "Meeting",
  "entryTime": "2025-01-21T10:00:00Z",
  "exitTime": "2025-01-21T11:00:00Z"
}
```

## 🎨 UI Components

- **Tailwind CSS**:
  - Utility-first CSS framework for rapid UI development
- **Hero UI**:
  - Pre-built components for buttons, modals, and navigation
- **Framer Motion**:
  - Smooth animations and transitions for a polished user experience
- **Dark Mode**:
  - Optional dark mode toggle for user preference

## 🔄 Database Schema

### Users Table

| Column | Type   | Description            |
| ------ | ------ | ---------------------- |
| id     | UUID   | Unique user identifier |
| name   | String | User's full name       |
| email  | String | User's email address   |

### Gate Passes Table

| Column      | Type     | Description          |
| ----------- | -------- | -------------------- |
| id          | UUID     | Unique gate pass ID  |
| visitorName | String   | Visitor's name       |
| purpose     | String   | Purpose of the visit |
| entryTime   | DateTime | Entry timestamp      |
| exitTime    | DateTime | Exit timestamp       |

## 🚀 Deployment

To deploy this project on Vercel:

1. Push your code to a GitHub repository.
2. Connect your repository to Vercel.
3. Configure environment variables in the Vercel dashboard.
4. Click **Deploy**.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`feature/your-feature-name`).
3. Commit your changes (`git commit -m 'Add a new feature'`).
4. Push the branch (`git push origin feature/your-feature-name`).
5. Open a Pull Request.



