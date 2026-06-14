# BizPilot AI

BizPilot AI is a comprehensive, multi-platform Artificial Intelligence Business Operating System built specifically for small-to-medium enterprises (SMEs). It automates customer communication via WhatsApp, handles order management, tracks inventory, generates PDF quotations, and provides AI-driven business analytics.

## 🚀 Features

* **WhatsApp AI Integration**: Uses WaAPI and Groq (Llama 3) to parse customer intents, query live inventory, and respond instantly.
* **React Web Dashboard**: A Notion-style Admin SaaS dashboard to manage Orders, Customers, Inventory, and Settings.
* **Flutter Mobile App**: A pocket-sized companion app for business owners to track metrics on the go.
* **Automated PDF Quotations**: Generates professional PDF quotations dynamically based on customer WhatsApp requests.
* **Advanced AI capabilities**: 
  * OCR Document Reader (Tesseract.js) for supplier invoices.
  * Voice Command engine for hands-free management.
  * Business Analytics AI endpoint.
* **Secure Architecture**: JWT-based authentication, Role-Based Access Control (RBAC), and PostgreSQL database.

## 🏗️ Tech Stack

* **Monorepo**: NPM Workspaces
* **Backend**: Node.js, Express.js, TypeScript
* **Database**: PostgreSQL with Prisma ORM
* **Frontend (Web)**: React.js, Vite, Tailwind CSS, Shadcn UI
* **Frontend (Mobile)**: Flutter, Dart
* **AI & External APIs**: Groq (Llama 3 8B), WaAPI (WhatsApp API), Tesseract.js (OCR)

---

## ⚙️ Prerequisites

Before running the application, ensure you have the following installed on your machine:
* **Node.js** (v18 or higher)
* **Docker Desktop** (for running PostgreSQL & Redis)
* **Flutter SDK** (for the mobile application)
* **Ngrok** (for testing WhatsApp webhooks locally)

---

## 🛠️ Installation & Setup

### 1. Clone & Install Dependencies
Navigate to the root directory and install dependencies for the entire monorepo:
```bash
npm install
```

### 2. Start the Database
Start the PostgreSQL database using Docker Compose:
```bash
docker-compose up -d
```

### 3. Environment Variables
Ensure you have configured your `.env` files. 
Inside `apps/backend/.env`:
```env
PORT=4000
DATABASE_URL="postgresql://admin:password123@localhost:5432/bizpilot?schema=public"
GROQ_API_KEY="your_groq_api_key"
WAAPI_TOKEN="your_waapi_token"
WAAPI_INSTANCE_ID="your_waapi_instance_id"
JWT_SECRET="your_secure_jwt_secret"
```

### 4. Database Setup
Push the Prisma schema to the database and seed it with initial data:
```bash
cd apps/backend
npx prisma db push
npx ts-node seed.ts
```

---

## 🏃‍♂️ Running the Application

### Backend API
To start the Node.js Express server:
```bash
cd apps/backend
npm run dev
```
*The API will run on http://localhost:4000*

### Web Dashboard
To start the React Admin Dashboard:
```bash
cd apps/web
npm run dev
```
*The Dashboard will run on http://localhost:5173*

### Mobile Application
To launch the Flutter mobile app in an emulator:
```bash
cd apps/mobile
flutter pub get
flutter run
```

---

## 🔗 Connecting WhatsApp Webhook

Since the WaAPI service requires a public internet address to forward messages to, you need to expose your local backend server using Ngrok:

1. Run the backend server (`npm run dev` in `apps/backend`).
2. Open a new terminal and run:
   ```bash
   ngrok http 4000
   ```
3. Copy the secure Ngrok URL (e.g., `https://1234-abcd.ngrok-free.app`).
4. Paste it into your WaAPI Webhook Settings page appended with the route: 
   `https://1234-abcd.ngrok-free.app/api/webhook/whatsapp`

---

## 📂 Project Structure

```text
bizpilot-ai/
├── apps/
│   ├── backend/        # Express.js API, Prisma Schema, AI Logic
│   ├── web/            # React.js Admin Dashboard
│   └── mobile/         # Flutter Mobile Application
├── packages/           # Shared libraries (future scaling)
├── docker-compose.yml  # Database infrastructure
└── package.json        # Root monorepo configuration
```


