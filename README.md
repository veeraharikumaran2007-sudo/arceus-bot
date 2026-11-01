# ⚡ Arceus Bot — WhatsApp & Biometric Automation Microservice

Standalone high-performance WhatsApp bot microservice designed for Gym & Fitness management applications. Integrates effortlessly with any frontend app, biometric attendance machine, and DBook ledger.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Arceus Bot Server
```bash
node server.js
```
The server will start on `http://localhost:5000`.

### 3. Connect Gym WhatsApp
1. Open your browser and visit: `http://localhost:5000`
2. Open WhatsApp on the gym mobile phone:
   - Go to **Linked Devices** ➔ **Link a Device**
3. Scan the QR code displayed on the screen.
4. **Done!** WhatsApp status will change to `Online & Active`.

---

## 🔌 API Documentation for the App Developer

All endpoints accept and return `application/json`.

Base URL: `http://localhost:5000/api` (or your deployed server domain).

---

### 1. Send Biometric Check-in DM
Triggered when a member punches their fingerprint at the biometric machine.

**Endpoint:** `POST /api/send-checkin`

**Request Body:**
```json
{
  "phone": "9876543210",
  "name": "Arun Kumar",
  "time": "07:15 AM",
  "gymName": "Arceus Fitness Studio"
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Check-in WhatsApp DM sent successfully!",
  "data": {
    "recipient": "919876543210@s.whatsapp.net",
    "timestamp": "2026-11-01T10:45:00.000Z"
  }
}
```

---

### 2. Send Fees Payment Receipt (DBook)
Triggered when the gym owner collects membership fees in cash, UPI, or card.

**Endpoint:** `POST /api/send-receipt`

**Request Body:**
```json
{
  "phone": "9876543210",
  "name": "Arun Kumar",
  "amount": 1500,
  "plan": "1 Month General Workout",
  "validTill": "05-Dec-2026",
  "billNo": "ARC-102",
  "gymName": "Arceus Fitness Studio"
}
```

---

### 3. Send Expiry Warning Reminder
Triggered 3 days or 1 day before membership expires.

**Endpoint:** `POST /api/send-expiry-warning`

**Request Body:**
```json
{
  "phone": "9876543210",
  "name": "Arun Kumar",
  "daysLeft": 3,
  "expiryDate": "05-Nov-2026",
  "amount": 1500,
  "upiLink": "upi://pay?pa=gym@upi&pn=ArceusGym",
  "gymName": "Arceus Fitness Studio"
}
```

---

### 4. Send Access Denied / Fees Due Alert
Triggered when a member whose subscription expired attempts to punch at the biometric machine.

**Endpoint:** `POST /api/send-blocked-alert`

**Request Body:**
```json
{
  "phone": "9876543210",
  "name": "Arun Kumar",
  "dueAmount": 1500,
  "gymName": "Arceus Fitness Studio"
}
```

---

### 5. Send Custom Message
Send any announcement, holiday notice, or offer.

**Endpoint:** `POST /api/send-custom`

**Request Body:**
```json
{
  "phone": "9876543210",
  "message": "Deepavali Offer! Pay for 6 months and get 2 months free!",
  "gymName": "Arceus Fitness Studio"
}
```

---

### 6. Check Bot Status
**Endpoint:** `GET /api/status`

**Response:**
```json
{
  "status": "connected",
  "connectedNumber": "919876543210",
  "qrAvailable": false
}
```

---

## 🛠️ Code Example for Frontend Developer (JavaScript Fetch)

```javascript
// Example in the app:
async function notifyCheckIn(memberPhone, memberName) {
  const response = await fetch('http://localhost:5000/api/send-checkin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      phone: memberPhone,
      name: memberName
    })
  });
  const data = await response.json();
  console.log('WhatsApp notification result:', data);
}
```

---

*Engineered by Arceus Technologies & Google Antigravity.*
