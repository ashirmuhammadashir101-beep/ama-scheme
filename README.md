# AMA Scheme - Betting Quiz Platform

A full-stack web application where users pay ₦4,700 to attempt a 12-question quiz for a chance to win ₦2,300,000.

## 🎯 Features

### User Features
- **User Registration & Login** - Secure authentication with JWT tokens
- **12-Question Quiz** - Interactive quiz interface with real-time progress tracking
- **Payment System** - Integration with Opay for ₦4,700 entry fee
- **Dashboard** - View account stats, quiz attempts, and winnings
- **Withdrawal System** - Request withdrawals to bank accounts
- **Analytics** - Track personal quiz performance and statistics

### Admin Features
- **Admin Dashboard** - View system statistics and overview
- **Withdrawal Management** - Approve/reject user withdrawal requests
- **System Analytics** - Daily reports and performance metrics
- **User Management** - Manage user accounts and permissions

## 💻 Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Backend:** Node.js with Express.js
- **Database:** SQLite3
- **Authentication:** JWT (JWT-Simple)
- **Password Hashing:** bcryptjs
- **API:** RESTful API with CORS support

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

## 🚀 Installation & Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
The `.env` file is already configured with default settings. Update these values for production:
```
PORT=3000
DB_PATH=./data/amascheme.db
JWT_SECRET=your_secret_key_here_change_in_production
OPAY_MERCHANT_ID=your_opay_merchant_id
OPAY_API_KEY=your_opay_api_key
OPAY_SECRET_KEY=your_opay_secret_key
NODE_ENV=development
```

### 3. Create Data Directory
```bash
mkdir data
```

### 4. Start the Server
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

The server will run on `http://localhost:3000`

## 📁 Project Structure

```
ama-scheme/
├── backend/
│   ├── controllers/        # Business logic
│   ├── middleware/         # Authentication middleware
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── database.js        # Database initialization
│   └── server.js          # Express server setup
├── frontend/
│   ├── css/
│   │   └── style.css      # Global styles
│   ├── js/
│   │   ├── app.js         # Utility functions
│   │   ├── auth.js        # Auth logic
│   │   ├── dashboard.js   # Dashboard
│   │   ├── quiz.js        # Quiz logic
│   │   ├── withdrawal.js  # Withdrawal logic
│   │   ├── analytics.js   # Analytics
│   │   ├── admin.js       # Admin dashboard
│   │   ├── admin-withdrawals.js
│   │   ├── admin-analytics.js
│   │   └── admin-users.js
│   ├── pages/
│   │   ├── login.html
│   │   ├── register.html
│   │   ├── dashboard.html
│   │   ├── quiz.html
│   │   ├── withdrawal.html
│   │   ├── analytics.html
│   │   ├── admin.html
│   │   ├── admin-withdrawals.html
│   │   ├── admin-analytics.html
│   │   └── admin-users.html
│   └── index.html         # Homepage
├── .env                   # Environment variables
├── .gitignore            # Git ignore rules
├── package.json          # Dependencies
└── README.md            # This file
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Quiz
- `POST /api/quiz/start` - Start new quiz attempt
- `POST /api/quiz/submit` - Submit quiz answers
- `GET /api/quiz/history` - Get quiz history

### Payment
- `POST /api/payment/initiate` - Initiate payment
- `POST /api/payment/verify` - Verify payment
- `GET /api/payment/history` - Payment history

### Withdrawal
- `POST /api/withdrawal/request` - Request withdrawal
- `GET /api/withdrawal/history` - Withdrawal history

### Dashboard
- `GET /api/dashboard/data` - Get dashboard data

### Analytics
- `GET /api/analytics/user` - User analytics
- `GET /api/analytics/overview` - System overview (admin)
- `GET /api/analytics/daily` - Daily analytics (admin)

### Admin
- `GET /api/admin/withdrawals` - All withdrawals (admin)
- `POST /api/admin/withdrawals/approve` - Approve withdrawal (admin)
- `POST /api/admin/withdrawals/reject` - Reject withdrawal (admin)
- `GET /api/admin/stats` - System stats (admin)
- `GET /api/admin/users` - All users (admin)
- `POST /api/admin/create-admin` - Create admin (admin)

## 💳 Payment Integration

The platform uses Opay for payment processing. To integrate:

1. Sign up at Opay
2. Get your Merchant ID and API keys
3. Update the `.env` file with your credentials
4. Modify the payment controller to implement actual Opay API calls

## 🗄️ Database Schema

### Tables
- **users** - User accounts with authentication
- **quiz_attempts** - Quiz attempt records
- **quiz_answers** - Individual question answers
- **questions** - Quiz questions database
- **payments** - Payment records
- **withdrawals** - Withdrawal requests
- **admins** - Admin users
- **analytics** - Daily analytics data

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- CORS protection
- Input validation
- Admin role-based access control

## 📝 Sample Quiz Questions

The database is initialized with a structure to store quiz questions. To add sample questions:

```sql
INSERT INTO questions (question_text, option_a, option_b, option_c, option_d, correct_answer) 
VALUES ('Question text', 'Option A', 'Option B', 'Option C', 'Option D', 'A');
```

## 🎮 How It Works

1. **User Registration** → Create account with email, phone, password
2. **Login** → Get JWT token for authentication
3. **Dashboard** → View account info and quiz history
4. **Start Quiz** → Pay ₦4,700 via Opay
5. **Answer Questions** → Complete 12-question quiz
6. **Check Results** → View score and prize (if won)
7. **Withdrawal** → Request payout to bank account

## 🏆 Winning Conditions

- Answer ALL 12 questions correctly → Win ₦2,300,000
- Answer fewer than 12 correctly → No prize (payment is entry fee only)

## 📊 Admin Features

- View all users and their statistics
- Manage withdrawal requests
- View system-wide analytics
- Daily performance reports
- User management and admin assignment

## 🐛 Troubleshooting

### Database Error
If you get database errors, ensure the `data/` folder exists and is writable.

### CORS Error
Make sure the frontend is accessing the correct API URL. Check `API_URL` in `frontend/js/app.js`

### Port Already in Use
Change the PORT in `.env` file to an available port.

## 📞 Support

For issues or questions, contact the development team.

## 📄 License

This project is proprietary. All rights reserved.

---

**Happy Gaming! 🎯**
