import express from 'express';
import { waService } from './whatsapp.js';
import { templates } from './templates.js';

export const router = express.Router();

// 1. Connection Health & Status
router.get('/status', (req, res) => {
  res.json(waService.getStatus());
});

// 2. Get QR Code directly
router.get('/qr', (req, res) => {
  const status = waService.getStatus();
  if (status.status === 'connected') {
    return res.json({ message: 'WhatsApp already connected!', connected: true, number: status.connectedNumber });
  }
  if (!status.qrDataUrl) {
    return res.status(503).json({ message: 'QR code generating, please retry in 2 seconds...', connected: false });
  }
  res.json({ connected: false, qrDataUrl: status.qrDataUrl });
});

// 3. Biometric Check-in Attendance DM
router.post('/send-checkin', async (req, res) => {
  try {
    const { phone, name, time, gymName } = req.body;
    if (!phone || !name) {
      return res.status(400).json({ error: 'phone and name are required' });
    }

    const punchTime = time || new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    const text = templates.checkIn({ name, time: punchTime, gymName });

    const result = await waService.sendTextMessage(phone, text);
    res.json({ success: true, message: 'Check-in WhatsApp DM sent successfully!', data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 4. Fees Payment Receipt DM
router.post('/send-receipt', async (req, res) => {
  try {
    const { phone, name, amount, plan, validTill, billNo, gymName } = req.body;
    if (!phone || !name || !amount) {
      return res.status(400).json({ error: 'phone, name, and amount are required' });
    }

    const text = templates.feeReceipt({
      name,
      amount,
      plan: plan || 'Monthly Fitness Plan',
      validTill: validTill || '30 Days from today',
      billNo: billNo || Math.floor(1000 + Math.random() * 9000),
      gymName
    });

    const result = await waService.sendTextMessage(phone, text);
    res.json({ success: true, message: 'Receipt WhatsApp DM sent successfully!', data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 5. Expiry Reminder Alert DM
router.post('/send-expiry-warning', async (req, res) => {
  try {
    const { phone, name, daysLeft, expiryDate, amount, upiLink, gymName } = req.body;
    if (!phone || !name) {
      return res.status(400).json({ error: 'phone and name are required' });
    }

    const text = templates.expiryWarning({
      name,
      daysLeft: daysLeft || 3,
      expiryDate: expiryDate || 'Upcoming weekend',
      amount: amount || '1,500',
      upiLink,
      gymName
    });

    const result = await waService.sendTextMessage(phone, text);
    res.json({ success: true, message: 'Expiry warning WhatsApp DM sent successfully!', data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 6. Access Denied / Fees Due Alert DM
router.post('/send-blocked-alert', async (req, res) => {
  try {
    const { phone, name, dueAmount, gymName } = req.body;
    if (!phone || !name) {
      return res.status(400).json({ error: 'phone and name are required' });
    }

    const text = templates.blockedAlert({ name, dueAmount, gymName });
    const result = await waService.sendTextMessage(phone, text);
    res.json({ success: true, message: 'Blocked entry alert sent successfully!', data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 7. Custom Broadcast / Manual Message
router.post('/send-custom', async (req, res) => {
  try {
    const { phone, message, gymName } = req.body;
    if (!phone || !message) {
      return res.status(400).json({ error: 'phone and message are required' });
    }

    const text = templates.custom({ message, gymName });
    const result = await waService.sendTextMessage(phone, text);
    res.json({ success: true, message: 'Custom WhatsApp message sent!', data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
