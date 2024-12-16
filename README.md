# Travel Booking Web Application

## Overview

This is a full-featured web application for a travel booking platform, allowing users to browse tour packages, make bookings, and providing an admin interface for package management.

## Features

### User-facing Features
- Browse available tour packages
- View detailed package information
- Book travel packages
- Generate PDF invoices for bookings

### Admin Features
- Secure admin login
- Create, edit, and delete travel packages
- Manage package inventory

## Tech Stack

### Frontend
- React.js
- React Router
- Tailwind CSS
- Axios for API requests
- jsPDF for invoice generation

### Context Providers
- AuthContext: Manages admin authentication
- ToastContext: Handles notification toasts

## Key Components

1. **PackageList**: Displays all available travel packages
2. **PackageDetails**: Allows users to view package details and make bookings
3. **AdminDashboard**: Enables admin to manage packages
4. **Invoice**: Generates and displays booking invoices
5. **AdminLogin**: Provides secure admin authentication

## Setup and Installation

### Prerequisites
- Node.js
- npm or yarn

### Installation Steps
1. Clone the repository
2. Install dependencies
   ```bash
   npm install
   ```
3. Set up environment variables
4. Start the development server
   ```bash
   npm start
   ```

## Environment Configuration

Ensure the following environment variables are set:
- `API`: Backend API base URL

## API Dependencies

- Requires a backend API with the following endpoints:
  - `/packages`: Retrieve packages
  - `/admin/login`: Admin authentication
  - `/admin/packages`: CRUD operations for packages
  - `/bookings`: Create new bookings

## Authentication

- Uses JSON Web Tokens (JWT) for admin authentication
- Token stored in local storage
- Protected routes for admin dashboard

## Error Handling

- Utilizes react-toastify for user-friendly error and success notifications
- Comprehensive error handling in API requests

## Deployment

- Can be deployed on platforms like Netlify, Vercel, or AWS Amplify
- Ensure proper environment variable configuration

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## Contact

akshat4575@gmail.com