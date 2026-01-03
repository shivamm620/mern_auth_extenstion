# 🔐 Universal Auth Web Extension

A **secure authentication web extension** built using the **MERN stack**, designed to work across **Chrome, Brave, Firefox, and other Chromium-based browsers**.  
This extension enables **secure login, token handling, and encrypted session management** without relying on `localStorage`.

---

## 🚀 Features

- ✅ Secure authentication using **JWT (Access + Refresh Tokens)**
- 🧠  tokens stored in **browser storage (not localStorage)**
- 🌐 Works across **Chrome, Brave, Firefox**
- 🔄 Automatic token refresh flow
- 🧩 Built to integrate with:
  - Web Apps
  - Browser Extensions
  - Desktop Apps (future)
  - Mobile Apps (future)
- ⚙️ Manifest V3 compatible
- 🛡️ No sensitive data exposed to content scripts

---

## 🏗️ Tech Stack

### Frontend (Extension UI)
- React
- JavaScript
- Browser Extension APIs (`chrome` / `browser`)

### Backend (Auth Server)
- Node.js
- Express.js
- MongoDB / PostgreSQL
- JWT
- bcrypt

