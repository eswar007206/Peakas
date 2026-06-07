# Peakas

Peakas is a comprehensive real estate platform built for users looking to buy and sell properties. It provides an intuitive interface for browsing properties, a dedicated selling portal, and an administrative dashboard to track property views and clicks.

**Note: This project was specifically developed for a Japanese client.**

## Features

*   **Property Listings (Buy):** Users can browse available properties, view detailed information, and express interest.
*   **Property Selling (Sell):** A streamlined process for users to list their properties for sale.
*   **User Accounts (MyPage):** Personalized dashboard for registered users to manage their activities.
*   **Admin Dashboard:** Comprehensive tools for administrators to manage listings, track user engagement (page views, property clicks), and oversee platform activity.
*   **Authentication:** Secure user login and registration powered by Supabase.
*   **Company Information:** Dedicated company page for corporate details.

## Tech Stack

*   **Frontend Framework:** React 18 with TypeScript
*   **Build Tool:** Vite
*   **Routing:** React Router DOM
*   **Styling:** Tailwind CSS with shadcn/ui components (Radix UI)
*   **State Management:** Zustand, React Query (@tanstack/react-query)
*   **Backend & Authentication:** Supabase
*   **Icons:** Lucide React
*   **Forms:** React Hook Form with Zod validation

## Getting Started

### Prerequisites

*   Node.js (v18 or higher recommended)
*   npm (or bun / yarn)

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/eswar007206/Peakas.git
    cd Peakas
    ```

2.  Install dependencies:
    ```bash
    npm install
    # or bun install
    ```

3.  Set up environment variables:
    Create a `.env` file in the root directory and add your Supabase credentials. You will need:
    ```env
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  Start the development server:
    ```bash
    npm run dev
    ```

5.  Open your browser and navigate to the local URL provided by Vite (usually `http://localhost:8080` or `http://localhost:5173`).

## Scripts

*   `npm run dev`: Starts the development server.
*   `npm run build`: Builds the app for production.
*   `npm run lint`: Runs ESLint to check for code quality.
*   `npm run preview`: Previews the production build locally.
