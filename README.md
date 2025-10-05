# 💰 Gastaro

<div align="center">
  <img src="public/logo.svg" alt="Gastaro Logo" width="120" height="120">
  
  ### Smart Expense Tracking Made Simple
  
  [![Laravel](https://img.shields.io/badge/Laravel-11.x-FF2D20?style=flat&logo=laravel&logoColor=white)](https://laravel.com)
  [![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
  [![Inertia.js](https://img.shields.io/badge/Inertia.js-1.x-9553E9?style=flat&logo=inertia&logoColor=white)](https://inertiajs.com)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
  
  [Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Tech Stack](#-tech-stack) • [License](#-license)
</div>

---

## 📖 About

**Gastaro** is a modern, full-stack expense tracking application designed to help you manage your finances effortlessly. Built with Laravel and React, it offers a seamless user experience across all devices with real-time updates and intuitive UI.

### ✨ Why Gastaro?

- 🎯 **Simple & Intuitive** - Clean interface that anyone can use
- 📱 **Mobile-First Design** - Beautiful responsive UI optimized for mobile
- 🔒 **Secure Authentication** - Google OAuth & Two-Factor Authentication
- 💳 **Multiple Payment Methods** - Track expenses across different payment sources
- 📊 **Visual Analytics** - Understand your spending patterns at a glance
- 🌐 **Multi-Currency Support** - Track expenses in your preferred currency
- 🔔 **Smart Notifications** - Stay updated on your financial activities
- 👥 **Shared Expenses** - Split bills and track shared costs with friends

---

## 🚀 Features

### 💸 Expense Management
- ✅ Quick expense entry with custom categories
- 📸 Receipt image upload and storage
- 📅 Custom date selection with beautiful calendar UI
- 🏷️ Flexible categorization (Food, Transport, Entertainment, etc.)
- 💳 Multiple payment method tracking
- 📝 Add notes and descriptions to expenses

### 💰 Income Tracking
- ✅ Record multiple income sources (Salary, Freelance, Investments, etc.)
- 📊 Visualize income vs expenses
- 💼 Track different payment methods for income

### 📊 Dashboard & Analytics
- 📈 Real-time expense statistics
- 🎯 Monthly, weekly, and daily expense summaries
- 📉 Visual charts and graphs
- 💡 Spending insights and trends

### 👤 User Management
- 🔐 Secure authentication with Laravel Fortify
- 🔑 Google OAuth integration
- 🛡️ Two-Factor Authentication (2FA) with QR codes
- 👨‍💼 Custom user profiles with avatars
- 🎨 Appearance customization (themes, currency)

### 🤝 Social Features
- 👥 User search by unique code
- 🔗 Connect with friends and family
- 💸 Shared expense tracking
- 📱 View shared expenses in a beautiful carousel

### 💳 Gastaro Pay
- 🎴 Virtual payment card interface
- 💰 Integrated payment tracking
- 🔄 Flip card animation for card details
- 📜 Transaction history

### 🔔 Notifications
- 📬 Real-time notifications for activities
- 🔔 Unread notification count
- ✉️ Email verification system
- 🔕 Notification preferences

---

## 🎨 Screenshots

<div align="center">
  
### Dashboard
*Track your expenses at a glance*

### Mobile Experience
*Beautiful mobile-first design with floating navigation*

### Expense Entry
*Quick and intuitive expense creation*

### Analytics
*Visualize your spending patterns*

</div>

---

## 🛠️ Tech Stack

### Backend
- **[Laravel 11.x](https://laravel.com)** - Modern PHP framework
- **[Laravel Fortify](https://laravel.com/docs/fortify)** - Authentication scaffolding
- **[Laravel Socialite](https://laravel.com/docs/socialite)** - OAuth authentication
- **[Inertia.js](https://inertiajs.com)** - Modern monolithic SPA framework
- **SQLite/MySQL** - Database

### Frontend
- **[React 18](https://reactjs.org)** - UI library
- **[TypeScript](https://www.typescriptlang.org)** - Type safety
- **[Tailwind CSS](https://tailwindcss.com)** - Utility-first CSS
- **[shadcn/ui](https://ui.shadcn.com)** - Re-usable components
- **[Lucide Icons](https://lucide.dev)** - Beautiful icon set
- **[Headless UI](https://headlessui.com)** - Unstyled, accessible UI components

### Tools & DevOps
- **[Vite](https://vitejs.dev)** - Lightning-fast build tool
- **[Laravel Pint](https://laravel.com/docs/pint)** - PHP code style fixer
- **[Prettier](https://prettier.io)** - Code formatter
- **[ESLint](https://eslint.org)** - JavaScript linter
- **[Pest](https://pestphp.com)** - Testing framework

---

## 📦 Installation

### Prerequisites

- PHP >= 8.2
- Composer
- Node.js >= 18.x
- npm or yarn
- SQLite or MySQL

### 1. Clone the repository

```bash
git clone https://github.com/Devdprivity/gastaro.git
cd gastaro
```

### 2. Install PHP dependencies

```bash
composer install
```

### 3. Install Node dependencies

```bash
npm install
```

### 4. Environment setup

```bash
cp .env.example .env
php artisan key:generate
```

### 5. Configure your `.env` file

```env
APP_NAME=Gastaro
APP_URL=http://localhost:8000

DB_CONNECTION=sqlite
# Or use MySQL:
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=gastaro
# DB_USERNAME=root
# DB_PASSWORD=

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI="${APP_URL}/auth/google/callback"
```

### 6. Database setup

```bash
# Create SQLite database
touch database/database.sqlite

# Run migrations
php artisan migrate

# (Optional) Seed with sample data
php artisan db:seed
```

### 7. Generate user codes for existing users

```bash
php artisan users:generate-codes
```

### 8. Build frontend assets

```bash
# Development
npm run dev

# Production
npm run build
```

### 9. Start the development server

```bash
php artisan serve
```

Visit [http://localhost:8000](http://localhost:8000) 🎉

---

## 🧪 Testing

Run the test suite with Pest:

```bash
# Run all tests
php artisan test

# Run specific test file
php artisan test --filter=UserCodeTest

# Run with coverage
php artisan test --coverage
```

---

## 🎯 Usage

### Creating Your First Expense

1. Click the **"+"** button in the mobile navigation
2. Enter the amount and description
3. Select a category and payment method
4. (Optional) Upload a receipt image
5. Click **"Guardar Gasto"**

### Connecting with Friends

1. Go to **"Buscar"** in the navigation
2. Enter a friend's unique user code
3. View shared expenses in the carousel
4. Click any expense card to see details

### Setting Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable Google+ API
4. Create OAuth credentials
5. Add credentials to `.env` file

### Enabling Two-Factor Authentication

1. Go to **Settings** → **Security**
2. Click **"Enable 2FA"**
3. Scan the QR code with your authenticator app
4. Enter the verification code
5. Save your recovery codes

---

## 🏗️ Project Structure

```
gastaro/
├── app/
│   ├── Console/Commands/      # Artisan commands
│   ├── Helpers/               # Helper classes
│   ├── Http/
│   │   ├── Controllers/       # Application controllers
│   │   ├── Middleware/        # HTTP middleware
│   │   └── Requests/          # Form requests
│   ├── Models/                # Eloquent models
│   ├── Policies/              # Authorization policies
│   └── Services/              # Business logic services
├── database/
│   ├── factories/             # Model factories
│   ├── migrations/            # Database migrations
│   └── seeders/               # Database seeders
├── resources/
│   ├── css/                   # Stylesheets
│   ├── js/
│   │   ├── actions/           # Wayfinder actions
│   │   ├── components/        # React components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── layouts/           # Layout components
│   │   ├── pages/             # Page components
│   │   ├── routes/            # Route definitions
│   │   └── types/             # TypeScript types
│   └── views/                 # Blade templates
├── routes/
│   ├── auth.php               # Authentication routes
│   ├── settings.php           # Settings routes
│   └── web.php                # Web routes
└── tests/
    ├── Feature/               # Feature tests
    └── Unit/                  # Unit tests
```

---

## 🔑 Key Features Explained

### Unique User Codes
Each user gets a unique 8-character alphanumeric code for easy searching and connecting with other users.

### Mobile-First Navigation
Beautiful floating navigation bar with rounded corners, featuring:
- Home dashboard
- User search
- Central income button (elevated design)
- Settings
- Gastaro Pay

### Custom Calendar
Compact, iPhone-style calendar for date selection with:
- Month navigation
- Current date highlighting
- Selected date indication
- Touch-optimized interactions

### Shared Expenses
Track expenses shared with friends:
- Horizontal carousel display
- Detailed expense views
- User avatars
- Amount and description preview

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

**Devdprivity**
- GitHub: [@Devdprivity](https://github.com/Devdprivity)
- Email: davidbadell42@gmail.com

---

## 🙏 Acknowledgments

- [Laravel](https://laravel.com) - The PHP Framework for Web Artisans
- [React](https://reactjs.org) - A JavaScript library for building user interfaces
- [Inertia.js](https://inertiajs.com) - The Modern Monolith
- [Tailwind CSS](https://tailwindcss.com) - A utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com) - Beautifully designed components
- [Lucide](https://lucide.dev) - Beautiful & consistent icon pack

---

<div align="center">
  
### ⭐ Star this repo if you find it helpful!

Made with ❤️ by [Devdprivity](https://github.com/Devdprivity)

</div>

#   G a s t a r o  
 