/**
 * Arceus Bot - Message Templates Engine
 * High-conversion WhatsApp templates for Gym Attendance & Fee Ledger
 */

export function formatPhoneNumber(phone) {
  // Clean phone number: remove non-digits
  let cleaned = String(phone).replace(/\D/g, '');
  
  // If Indian 10-digit number without country code, prepend 91
  if (cleaned.length === 10) {
    cleaned = '91' + cleaned;
  }
  
  // WhatsApp JID format: 919876543210@s.whatsapp.net
  return cleaned.endsWith('@s.whatsapp.net') ? cleaned : `${cleaned}@s.whatsapp.net`;
}

export const templates = {
  // 1. Biometric Check-in (Instant attendance mark)
  checkIn: ({ name, time, gymName = 'Arceus Fitness' }) => {
    return `🏋️ *${gymName} — Check-in Confirmed!*

வணக்கம் *${name}*,
✅ Unga workout entry register aagirukku!
⏰ *Punch Time:* ${time}

🔥 _"Success starts with self-discipline. Have a beast workout today!"_ 💪`;
  },

  // 2. Fees Payment Receipt (Instant DBook invoice)
  feeReceipt: ({ name, amount, plan = 'Monthly Membership', validTill, billNo, gymName = 'Arceus Fitness' }) => {
    return `🧾 *${gymName} — Payment Receipt*

வணக்கம் *${name}*,
Unga fees payment successfully receive aagirukku!

💵 *Amount Paid:* ₹${amount}
📋 *Plan:* ${plan}
📅 *Valid Till:* ${validTill}
🔢 *Receipt No:* #${billNo}

Nandri! We appreciate your dedication. Keep pushing! 🚀`;
  },

  // 3. Membership Expiry Reminder (Sent 3 days / 1 day before)
  expiryWarning: ({ name, daysLeft, expiryDate, amount, upiLink, gymName = 'Arceus Fitness' }) => {
    return `⚠️ *${gymName} — Membership Renewal Alert*

Hi *${name}*,
Unga gym membership innum *${daysLeft} days-la (${expiryDate})* expire aagudhu!

Thadavu illama workout continue panna, please renew pannikkonga:
💰 *Renewal Fees:* ₹${amount}
${upiLink ? `📲 *Instant UPI Pay:* ${upiLink}` : '📍 Front desk-la pay pannalaam.'}

Don't break your fitness streak! 🔥`;
  },

  // 4. Biometric Blocked / Access Denied Alert
  blockedAlert: ({ name, dueAmount, gymName = 'Arceus Fitness' }) => {
    return `⛔ *${gymName} — Access Denied / Fees Due*

Hi *${name}*,
Unga membership date expire aanadhaala biometric attendance *Block* aagirukku.

⚠️ *Pending Renewal:* ₹${dueAmount || 'Fees Due'}
Please reception counter-la contact panni renewal pannikonga. System automatic-ah 1 minute-la unga attendance unlock pannidum!

Thank you! 🙌`;
  },

  // 5. Custom Announcement / Broadcast Message
  custom: ({ message, gymName = 'Arceus Fitness' }) => {
    return `📢 *${gymName} Update*

${message}

Stay fit, stay strong! 💪`;
  }
};
