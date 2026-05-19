# Express API Gateway — Tanit Talent AI Backend

This is the backend API gateway for the **Tanit Talent AI** recruitment platform. It is built on Node.js using Express, Mongoose, JWT authentication, Multer for file uploads, and acts as a central proxy to the Python NLP Flask service.

---

## 🛠️ Technology Stack & Dependencies
* **Core:** Node.js, Express.js
* **Database:** MongoDB (via Mongoose ODM)
* **Security:** JWT (JSON Web Tokens), BCrypt.js (Password Salting)
* **File Uploads:** Multer (handling PDF/DOC resume attachments)
* **Deployment:** Pre-configured for Vercel Serverless Functions (`vercel.json` routing)

---

## ⚙️ Environment Variables

Create a `.env` file in the root of this folder with the following variables:

```ini
PORT=5000
MONGODB_URI=mongodb://localhost:27017/tanit-talent
JWT_SECRET=your_jwt_signing_key_here
AI_SERVICE_URL=http://localhost:8000
NODE_ENV=development
```

---

## 🗄️ Database Seeding

To get started with ready-to-test listings, run the automated database seeder utility. This creates a Candidate account, a Recruiter account, and 4 high-quality engineering jobs in your local MongoDB:

```bash
node src/seeder.js
```

### Seeded Credentials
*   **Recruiter Account:** `recruiter@tanit.com` / `password123`
*   **Candidate Account:** `candidate@tanit.com` / `password123`

---

## 🔑 REST API Endpoints

### 1. Authentication (`/api/auth`)
| HTTP Method | Path | Access | Description |
| :--- | :--- | :--- | :--- |
| **POST** | `/register` | Public | Registers a new Candidate or Recruiter |
| **POST** | `/login` | Public | Returns a JWT token and user metadata |
| **GET** | `/me` | Protected | Retrieves current authenticated profile |

### 2. Jobs (`/api/jobs`)
| HTTP Method | Path | Access | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/` | Public | Lists all active job offers (searchable) |
| **POST** | `/` | Recruiter | Publishes a new job offer |
| **GET** | `/:id` | Public | Gets detailed information for a job |

### 3. Applications (`/api/applications`)
| HTTP Method | Path | Access | Description |
| :--- | :--- | :--- | :--- |
| **POST** | `/apply/:jobId` | Candidate | Submits a resume, parses NLP score, and applies |
| **GET** | `/my-applications` | Candidate | Lists job applications submitted by the user |
| **GET** | `/job/:jobId` | Recruiter | Lists and ranks candidates by AI matching score |

### 4. Reviews & Sentiment (`/api/reviews`)
| HTTP Method | Path | Access | Description |
| :--- | :--- | :--- | :--- |
| **POST** | `/` | Candidate | Submits candidate reviews for NLP sentiment scoring |
| **GET** | `/stats` | Admin/Recruiter| Aggregates overall platform sentiment metrics |

---

## 🚀 Deployment to Vercel

The backend has been configured to deploy seamlessly as a **Vercel Serverless Function** using a custom routing layer:

1. **Required Files Pre-configured:**
   * `api/index.js` — Initializes Mongoose and exports the Express app listener.
   * `vercel.json` — Tells Vercel to route all `/api/*` traffic to our serverless wrapper.
2. **Launch CLI Deploy:**
   ```bash
   vercel --prod
   ```
   *Make sure to configure your `MONGODB_URI`, `JWT_SECRET`, and `AI_SERVICE_URL` in the Vercel dashboard variables.*
=======
# Tanit-Talent-AI
