# Finance Tracker App

A complete personal finance management application with dual currency support (SAR & EGP).

## 🎯 Features

### ✅ **Currently Available (Phase 1)**
- Dashboard with income/expense overview for SAR & EGP
- Transaction management (add, edit, delete with filters)
- Budget Builder with visual progress bars and alerts
- Control Panel:
  - Category management (income & expense)
  - Payment method management (SAR & EGP)
  - Opening balance tracking per account
  - Exchange rate settings
- Transaction search and advanced filtering
- Mobile-responsive design

### 🚧 **Coming Soon (Phase 2)**
- Liabilities Tracker (auto-reducing debts/loans)
- Stock Portfolio (live prices, profit/loss tracking)
- Net Wealth Dashboard (total assets vs liabilities)
- Reports & Charts:
  - Spending by category (pie charts)
  - Income vs Expense trends (line charts)
  - Monthly comparisons
  - Data export (CSV/PDF)

## 🛠️ Tech Stack

**Frontend:**
- React 18
- Tailwind CSS
- Lucide React Icons
- Axios for API calls

**Backend:**
- Node.js + Express
- PostgreSQL Database
- JWT Authentication
- bcrypt for password hashing

**Deployment:**
- Frontend: Vercel
- Backend: Render
- Database: Supabase

## 📁 Project Structure
```
finance-tracker-app/
├── frontend/              # React application
│   ├── src/
│   │   ├── App.jsx       # Main app with all components
│   │   ├── index.js      # Entry point
│   │   └── index.css     # Global styles
│   ├── public/
│   │   └── index.html    # HTML template
│   └── package.json      # Frontend dependencies
│
├── backend/               # Node.js API
│   ├── server.js         # Express server + routes
│   ├── database.sql      # Database schema
│   ├── .env.example      # Environment variables template
│   └── package.json      # Backend dependencies
│
└── README.md             # This file
```

## 🎨 Key Features Explained

### Budget Builder
- Set monthly budgets per category
- Real-time spending tracking
- Color-coded progress bars:
  - 🟢 Green (0-79%): On track
  - 🟡 Yellow (80-99%): Warning
  - 🔴 Red (100%+): Over budget
- Separate budgets for SAR and EGP

### Control Panel
- **Categories:** Add custom income/expense categories
- **Payment Methods:** Manage banks, cards, wallets for both currencies
- **Opening Balances:** Set starting amounts for each account
- **Exchange Rate:** Update SAR↔EGP conversion rate

### Transaction Management
- Filter by currency, type, category, date range
- Search through descriptions
- Edit and delete transactions
- Transaction counter and summary

## 🚀 Setup Instructions

### Prerequisites
- Node.js 16+ installed
- PostgreSQL database or Supabase account
- GitHub account
- Vercel account (for frontend deployment)
- Render account (for backend deployment)

### Local Development

**Frontend:**
```bash
cd frontend
npm install
npm start
```
App runs on http://localhost:3000

**Backend:**
```bash
cd backend
npm install
node server.js
```
API runs on http://localhost:5000

### Environment Variables

Create `.env` file in backend folder:
```
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_random_secret_key
PORT=5000
```

## 📱 Deployment

### Deploy Frontend to Vercel
1. Connect GitHub repo to Vercel
2. Select `frontend` as root directory
3. Deploy automatically on push

### Deploy Backend to Render
1. Connect GitHub repo to Render
2. Select `backend` as root directory
3. Add environment variables
4. Deploy

### Setup Database (Supabase)
1. Create new Supabase project
2. Run `database.sql` in SQL editor
3. Copy connection string to backend `.env`

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Private repository (code not public)
- Environment variables for sensitive data
- HTTPS connections only

## 📊 Database Schema

- **users** - User accounts and authentication
- **transactions** - All financial transactions
- **categories** - Custom income/expense categories
- **payment_methods** - Bank accounts, cards, wallets
- **budgets** - Monthly budget allocations
- **opening_balances** - Starting balances per account

## 🎯 Roadmap

**Phase 1 (Current):** ✅ COMPLETE
- Basic transaction tracking
- Budget management
- Category & payment method customization

**Phase 2 (Next):** 🚧 IN PROGRESS
- Liabilities tracking
- Stock portfolio
- Net wealth calculator
- Advanced reporting

**Phase 3 (Future):** 📅 PLANNED
- Bill reminders
- Recurring transactions
- Multi-user support (family accounts)
- Mobile app (React Native)
- Bank integration (Open Banking API)

## 📞 Support

For issues or questions, create an issue in this repository.

## 📄 License

Private project - All rights reserved

---

**Built with ❤️ for personal finance management**
