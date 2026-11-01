import makeWASocket, { DisconnectReason, useMultiFileAuthState, fetchLatestBaileysVersion } from '@whiskeysockets/baileys';
import pino from 'pino';
import QRCode from 'qrcode';
import qrcodeTerminal from 'qrcode-terminal';
import path from 'path';
import { fileURLToPath } from 'url';
import { formatPhoneNumber } from './templates.js';
import { handleIncomingCommand } from './commands.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const AUTH_DIR = path.join(__dirname, '../auth_info');

export class WhatsAppService {
  constructor() {
    this.sock = null;
    this.qrCode = null;
    this.qrDataUrl = null;
    this.connectionStatus = 'disconnected'; // 'disconnected' | 'connecting' | 'connected' | 'qr_ready'
    this.userNumber = null;
    this.retryCount = 0;
  }

  async init() {
    const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);
    const { version } = await fetchLatestBaileysVersion();

    const logger = pino({ level: 'silent' });

    this.sock = makeWASocket({
      version,
      logger,
      printQRInTerminal: false,
      auth: state,
      browser: ['Arceus Bot', 'Chrome', '1.0.0'],
      syncFullHistory: false
    });

    this.connectionStatus = 'connecting';

    this.sock.ev.on('creds.update', saveCreds);

    // Listen for incoming messages from gym members (Interactive 2-Way Commands)
    this.sock.ev.on('messages.upsert', async (chatUpdate) => {
      try {
        const msg = chatUpdate.messages[0];
        if (!msg.message || msg.key.fromMe) return;

        const senderJid = msg.key.remoteJid;
        const senderPhone = senderJid.split('@')[0];
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text || '';

        if (text) {
          console.log(`📩 Incoming message from ${senderPhone}: "${text}"`);
          const reply = handleIncomingCommand(senderPhone, text);
          if (reply) {
            await this.sock.sendMessage(senderJid, { text: reply });
            console.log(`🤖 Auto-replied to ${senderPhone}`);
          }
        }
      } catch (err) {
        console.error('Error handling incoming WhatsApp message:', err);
      }
    });

    this.sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        this.qrCode = qr;
        this.connectionStatus = 'qr_ready';
        try {
          this.qrDataUrl = await QRCode.toDataURL(qr);
          console.log('\n==========================================');
          console.log('📲 ARCEUS BOT: Scan this QR with Gym WhatsApp');
          console.log('==========================================\n');
          qrcodeTerminal.generate(qr, { small: true });
        } catch (err) {
          console.error('Failed to generate QR data URL:', err);
        }
      }

      if (connection === 'close') {
        const statusCode = lastDisconnect?.error?.output?.statusCode;
        const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
        this.connectionStatus = 'disconnected';
        this.qrCode = null;
        this.qrDataUrl = null;
        this.userNumber = null;

        console.log(`⚠️ Connection closed (Status: ${statusCode}). Reconnecting: ${shouldReconnect}`);

        if (shouldReconnect) {
          setTimeout(() => this.init(), 3000);
        } else {
          console.log('❌ Device logged out. Please restart and scan QR again.');
        }
      } else if (connection === 'open') {
        this.connectionStatus = 'connected';
        this.qrCode = null;
        this.qrDataUrl = null;
        this.userNumber = this.sock.user?.id ? this.sock.user.id.split(':')[0] : 'Connected';
        console.log(`\n✅ ARCEUS BOT IS ONLINE! Connected as: ${this.userNumber}\n`);
      }
    });

    return this.sock;
  }

  getStatus() {
    return {
      status: this.connectionStatus,
      connectedNumber: this.userNumber,
      qrAvailable: !!this.qrDataUrl,
      qrDataUrl: this.qrDataUrl
    };
  }

  async sendTextMessage(phone, text) {
    if (this.connectionStatus !== 'connected' || !this.sock) {
      throw new Error('WhatsApp Bot is not connected. Please scan QR code first.');
    }

    const jid = formatPhoneNumber(phone);
    const result = await this.sock.sendMessage(jid, { text });
    return {
      success: true,
      recipient: jid,
      messageId: result?.key?.id,
      timestamp: new Date().toISOString()
    };
  }
}

export const waService = new WhatsAppService();
