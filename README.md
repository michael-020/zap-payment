# Zap Payment ⚡

Welcome to Zap Payment! This project provides a secure, streamlined, and token-based payment interface for "Zap Pro - One-time lifetime access." Built with modern web technologies, it ensures a smooth and authenticated checkout experience for your users.

## ✨ Features

*   🔒 **Secure Token-Based Access**: Validates a unique token via URL parameters to authorize payment initiation.
*   👤 **Personalized User Experience**: Fetches the user's email based on the provided token for a tailored checkout.
*   💳 **Seamless Payment Gateway Integration**: Fully integrated with Razorpay for secure and reliable online transactions.
*   💸 **Dedicated Product Checkout**: Specifically designed for "Zap Pro - One-time lifetime access" with a fixed payment amount.
*   🚀 **Modern Frontend**: Delivers a dynamic and responsive user experience with client-side driven payment flow, loading states, and error handling.

## 🛠️ Technologies Used

### Frontend
*   **Next.js 14** (App Router)
*   **React**
*   **Tailwind CSS**
*   **next/font** (Vercel's Geist Font)
*   **Razorpay Client-Side SDK** (dynamically loaded)

### Backend (Interacted with via APIs)
*   Backend API for token verification (`/api/verify-payment-token`)
*   Backend API for email retrieval (`/api/get-email`)
*   Backend API for order creation (`/api/create-order`)

*(Note: This project primarily focuses on the Next.js frontend application and its interaction with a separate backend API layer.)*

## 🚀 Getting Started

Follow these steps to get the Zap Payment application up and running on your local machine.

### Prerequisites

*   Node.js (LTS version recommended)
*   npm or Yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd zap-payment
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

### Configuration

Create a `.env.local` file in the root of the project and add your Razorpay Key ID:

```
RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXXXXXX
```

*(You will need a Razorpay account to obtain your `RAZORPAY_KEY_ID`.)*

### Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

The application will typically be accessed with a token parameter, e.g., `http://localhost:3000?token=YOUR_SECURE_TOKEN_HERE`.