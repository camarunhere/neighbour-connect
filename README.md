# NeighbourConnect

A community-focused web application that brings neighbours together. Residents can share local announcements, report lost and found items, and organise neighbourhood events — all in one place.

## Features

- **Announcements** — Post and browse community notices with optional image attachments
- **Lost & Found** — Report lost or found items; filter by status (Lost / Found / Claimed)
- **Events** — Create and view upcoming neighbourhood events with dates and descriptions
- **Authentication** — JWT-based login/register system; sessions persist across page reloads
- **Role-based access** — Admin users can delete any post; regular users can create posts
- **Image uploads** — Attach photos to any post (JPG, PNG, GIF, WEBP — up to 5 MB)
- **Home dashboard** — Preview of the 3 most recent posts from each section

## Tech Stack

| Layer    | Technology                       |
|----------|----------------------------------|
| Frontend | React 18, Vite, CSS              |
| Backend  | Node.js, Express                 |
| Database | MySQL 8                          |
| Auth     | bcryptjs, JSON Web Tokens (JWT)  |
| Uploads  | Multer                           |

## Architecture

```
neighbour/
├── server/              # Express REST API
│   ├── api/
│   │   ├── announcements/   # Announcements routes & logic
│   │   ├── lost-found/      # Lost & Found routes & logic
│   │   ├── events/          # Events routes & logic
│   │   ├── auth/            # Login & Register routes & logic
│   │   └── upload/          # Image upload route
│   ├── middleware/
│   │   └── auth.js          # JWT token verification
│   ├── migrations/          # SQL schema files
│   ├── uploads/             # Stored image files
│   ├── db.js                # Database connection settings
│   └── server.js            # Main entry point
└── client/
    └── neighbour_connect_client/   # React + Vite SPA
        └── src/
            ├── pages/       # Home, Announcements, Events, LostFound, Login, Signup
            ├── components/  # Navbar, PostCard, PostForm
            └── context/     # Auth state (React Context)
```

---

## Prerequisites

Make sure you have the following installed before proceeding:

- **Node.js** v18 or higher — [nodejs.org](https://nodejs.org) (choose the LTS version)
- **MySQL** v8.0 or higher — [MySQL Installer](https://dev.mysql.com/downloads/installer/)

Verify your installations:

```bash
node --version
mysql --version
```

---

## Installation

### 1. Set up the Database

Open a terminal and connect to MySQL:

```bash
mysql -u root -p
```

Create the database:

```sql
CREATE DATABASE neighbour_connect;
exit
```

> **Database connection defaults** — host: `localhost`, port: `3306`, user: `root`, password: `1234`.
> If your MySQL password differs, update it in `server/db.js`.

### 2. Install Dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd client/neighbour_connect_client
npm install
```

### 3. Run Migrations

All 3 migrations must be run once on first setup. From the `server/` directory:

```bash
cd server
npm run migrate
```

Expected output:

```
Connected to MySQL. Running migrations...

✔ Done    [posts table]
✔ Done    [users table]
✔ Done    [image_url column]

All migrations finished.
```

Migrations use `IF NOT EXISTS` so re-running is safe and will not destroy existing data.

<details>
<summary>What each migration does</summary>

| File | What it creates |
|------|----------------|
| `001_create_posts_table.sql` | `posts` table — stores all announcements, lost & found items, and events |
| `002_create_users_table.sql` | `users` table — stores registered accounts with roles (`user` / `admin`) |
| `003_add_image_url_to_posts.sql` | Adds `image_url` column to `posts` — enables image attachments |

</details>

---

## Running the App

You need **two terminals** running simultaneously.

**Terminal 1 — Backend:**

```bash
cd server
npm start
```

Expected output:
```
Server running on port 3000
Connected to MySQL
```

**Terminal 2 — Frontend:**

```bash
cd client/neighbour_connect_client
npm run dev
```

Expected output:
```
VITE ready in xxx ms
Local: http://localhost:5173/
```

Open your browser and navigate to **http://localhost:5173**

To stop, press `Ctrl + C` in each terminal.

---

## Usage

### Registering & Logging In

1. On the login page, click **Sign up**
2. Enter a username, email, and password then click **Sign Up**
3. You will be redirected to the login page — log in with your email and password

### Home

Shows a preview of the 3 most recent posts from each section. Click any section button to navigate to it.

### Announcements

- View all community announcements
- Click **+ New Announcement** to post — fill in Title, Description, Name (optional), and an optional image

### Lost & Found

- Use the filter buttons — **All / Lost / Found / Claimed** — to narrow posts
- Click **+ New Post** to report an item — select a Status (lost / found / claimed) along with Title, Description, and optional image

### Events

- View upcoming community events sorted by date
- Click **+ New Event** — fill in Title, Description, Event Date, and optional image

### Image Uploads

- Supported formats: JPG, PNG, GIF, WEBP
- Maximum size: 5 MB
- Uploaded files are stored in `server/uploads/`

---

## API Overview

Base URL: `http://localhost:3000`

| Resource        | Endpoints                         | Auth required |
|-----------------|-----------------------------------|---------------|
| Auth            | `POST /api/auth/register\|login`  | No            |
| Announcements   | CRUD `/api/announcements`         | Yes           |
| Lost & Found    | CRUD `/api/lost-found`            | Yes           |
| Events          | CRUD `/api/events`                | Yes           |
| Image upload    | `POST /api/upload`                | Yes           |
| Static files    | `GET /uploads/:filename`          | No            |

**Ports used:**
- `3000` — Backend server
- `5173` — Frontend dev server

---

## Roles

| Role  | Capabilities                       |
|-------|------------------------------------|
| User  | Register, login, create posts      |
| Admin | All of the above + delete any post |

Admins are identified with an orange **Admin** badge in the navbar and see a red **Delete** button on every post card.

### Promoting a User to Admin

```bash
mysql -u root -p
```

```sql
USE neighbour_connect;
UPDATE users SET role = 'admin' WHERE email = 'user@example.com';
```

The user must log out and back in for the change to take effect.

---

## Optional: Login Page Background Image

The login page supports a background image named `hey-neighbour.png`. To activate it, place the file at:

```
client/neighbour_connect_client/public/hey-neighbour.png
```

No restart needed — it applies immediately.

---

## Troubleshooting

| Error | Solution |
|-------|----------|
| `node is not recognized` | Node.js not installed. See Prerequisites. |
| `mysql is not recognized` | MySQL not in PATH. Re-run the installer and enable "Add MySQL to PATH". |
| `ECONNREFUSED 127.0.0.1:3306` | MySQL service not running. Open Services (`Win+R` → `services.msc`) and start **MySQL80**. |
| `Access denied for user root` | Wrong password in `server/db.js`. Update the `password` field. |
| `Table doesn't exist` | Migrations not run. Run `npm run migrate` from `server/`. |
| `EADDRINUSE :::3000` | Port 3000 is in use. Close the conflicting process or restart. |
| `Cannot find module` | `npm install` not run. Go to the folder in the error and run it. |
| Stuck on `Loading...` | Backend not running. Start it with `npm start` from `server/`. |
| Delete button not visible | You are not an admin. See the Roles section above. |
