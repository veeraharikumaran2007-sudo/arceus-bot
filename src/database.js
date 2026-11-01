import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, '../data/gym_database.json');

// Ensure data folder exists
const dataDir = path.dirname(DB_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initial default schema if file doesn't exist
if (!fs.existsSync(DB_FILE)) {
  const initialData = {
    gymInfo: {
      name: "Arceus Fitness Studio",
      timing: "Mon - Sat: 5:30 AM to 10:30 PM | Sun: 6:00 AM to 12:00 PM",
      contact: "9876543210",
      upi: "arceusgym@upi"
    },
    members: [
      {
        id: "101",
        name: "Arun Kumar",
        phone: "919876543210",
        dob: "11-01", // MM-DD for birthday wish
        joinDate: "2026-01-15",
        expiryDate: "2026-11-05",
        feesStatus: "PAID",
        feesAmount: 1500,
        streakDays: 14,
        lastPunchDate: "2026-11-01"
      }
    ],
    attendanceLogs: [],
    feeTransactions: []
  };
  fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
}

class GymDatabase {
  constructor() {
    this.filePath = DB_FILE;
  }

  _read() {
    try {
      const content = fs.readFileSync(this.filePath, 'utf-8');
      return JSON.parse(content);
    } catch (e) {
      console.error('Error reading gym database:', e);
      return { gymInfo: {}, members: [], attendanceLogs: [], feeTransactions: [] };
    }
  }

  _write(data) {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
    } catch (e) {
      console.error('Error writing gym database:', e);
    }
  }

  getGymInfo() {
    return this._read().gymInfo;
  }

  getAllMembers() {
    return this._read().members || [];
  }

  getMemberByPhone(phone) {
    const cleaned = String(phone).replace(/\D/g, '');
    const members = this.getAllMembers();
    return members.find(m => {
      const mPhone = String(m.phone).replace(/\D/g, '');
      return mPhone.endsWith(cleaned) || cleaned.endsWith(mPhone);
    });
  }

  getMemberById(id) {
    const members = this.getAllMembers();
    return members.find(m => String(m.id) === String(id));
  }

  saveMember(member) {
    const db = this._read();
    const index = db.members.findIndex(m => String(m.id) === String(member.id));
    if (index >= 0) {
      db.members[index] = { ...db.members[index], ...member };
    } else {
      db.members.push(member);
    }
    this._write(db);
    return member;
  }

  // 1. Find all members who have Birthday Today
  getTodaysBirthdays() {
    const now = new Date();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const todayMMDD = `${mm}-${dd}`;

    const members = this.getAllMembers();
    return members.filter(m => m.dob && m.dob.endsWith(todayMMDD));
  }

  // 2. Find members whose fees expire in X days
  getExpiringMembers(daysBefore = 3) {
    const today = new Date();
    const targetDate = new Date();
    targetDate.setDate(today.getDate() + daysBefore);
    const targetStr = targetDate.toISOString().split('T')[0];

    const members = this.getAllMembers();
    return members.filter(m => m.expiryDate === targetStr && m.feesStatus === 'PAID');
  }

  // 3. Find members who haven't visited in X days
  getInactiveMembers(daysThreshold = 3) {
    const today = new Date();
    const members = this.getAllMembers();
    
    return members.filter(m => {
      if (!m.lastPunchDate) return false;
      const last = new Date(m.lastPunchDate);
      const diffTime = Math.abs(today - last);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays >= daysThreshold;
    });
  }

  // 4. Record Biometric Punch & Streak
  recordPunch(id, punchTime = new Date()) {
    const db = this._read();
    const member = db.members.find(m => String(m.id) === String(id));
    if (!member) return null;

    const todayStr = punchTime.toISOString().split('T')[0];
    if (member.lastPunchDate !== todayStr) {
      member.streakDays = (member.streakDays || 0) + 1;
      member.lastPunchDate = todayStr;
    }

    db.attendanceLogs.push({
      memberId: id,
      name: member.name,
      timestamp: punchTime.toISOString()
    });

    this._write(db);
    return member;
  }
}

export const gymDB = new GymDatabase();
