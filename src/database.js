import { createClient } from '@libsql/client';

const TURSO_URL = process.env.TURSO_DATABASE_URL || 'libsql://arceus-veeraharikumaran2007-sudo.aws-ap-south-1.turso.io';
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN || 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3OTM1NDY3NTgsImlkIjoiMDFhMTk3YjYtMTcwMS03MjEzLTk1ZGUtOThkYWFkODhiMzY4Iiwia2lkIjoiSFJRaXItR0tpX2o4cml0TDJaWHJxNkl1WjVWRUc4eEQ1d19LUGp3NVQybyIsInJpZCI6IjA0MGU3YzgyLTg1YWMtNGEyOS05MWRmLTNmZDg3YWQ3M2I0NCJ9.FgoOBUh_PH2opEmql6CYuImIMZVa1oGpS7IzNQ2lr_ly2N-0MuWrG5lF4JBbMwXurefHoOvkwUEDYIqa_HCvCg';

export const turso = createClient({
  url: TURSO_URL,
  authToken: TURSO_AUTH_TOKEN
});

class GymDatabase {
  constructor() {
    this.client = turso;
  }

  getGymInfo() {
    return {
      name: "Arceus Fitness Studio",
      timing: "Mon - Sat: 5:30 AM to 10:30 PM | Sun: 6:00 AM to 12:00 PM",
      contact: "7448449679",
      upi: "arceusgym@upi"
    };
  }

  // 1. Get Member by Phone
  async getMemberByPhone(phone) {
    const cleaned = String(phone).replace(/\D/g, '');
    const result = await this.client.execute({
      sql: `SELECT * FROM gym_members WHERE phone LIKE ? OR ? LIKE ('%' || phone)`,
      args: [`%${cleaned}%`, cleaned]
    });
    return result.rows[0] || null;
  }

  // 2. Get Member by ID
  async getMemberById(id) {
    const result = await this.client.execute({
      sql: `SELECT * FROM gym_members WHERE id = ?`,
      args: [String(id)]
    });
    return result.rows[0] || null;
  }

  // 3. Save / Update Member
  async saveMember(member) {
    await this.client.execute({
      sql: `INSERT INTO gym_members (id, name, phone, dob, join_date, expiry_date, fees_status, fees_amount, streak_days) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET 
              name = excluded.name,
              phone = excluded.phone,
              dob = excluded.dob,
              expiry_date = excluded.expiry_date,
              fees_status = excluded.fees_status,
              fees_amount = excluded.fees_amount`,
      args: [
        String(member.id),
        member.name,
        member.phone,
        member.dob || '01-01',
        member.joinDate || new Date().toISOString().split('T')[0],
        member.expiryDate || '2026-12-01',
        member.feesStatus || 'PAID',
        member.feesAmount || 1500,
        member.streakDays || 0
      ]
    });
    return member;
  }

  // 4. Find Today's Birthdays (Runs at 8 AM)
  async getTodaysBirthdays() {
    const now = new Date();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const todayMMDD = `${mm}-${dd}`;

    const result = await this.client.execute({
      sql: `SELECT * FROM gym_members WHERE dob LIKE ?`,
      args: [`%${todayMMDD}`]
    });
    return result.rows;
  }

  // 5. Find Expiring Members (3 Days Before)
  async getExpiringMembers(daysBefore = 3) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysBefore);
    const targetStr = targetDate.toISOString().split('T')[0];

    const result = await this.client.execute({
      sql: `SELECT * FROM gym_members WHERE expiry_date = ? AND fees_status = 'PAID'`,
      args: [targetStr]
    });
    return result.rows;
  }

  // 6. Record Biometric Punch & Attendance
  async recordPunch(id, punchTime = new Date()) {
    const member = await this.getMemberById(id);
    if (!member) return null;

    const todayStr = punchTime.toISOString().split('T')[0];
    let newStreak = (member.streak_days || 0) + 1;

    if (member.last_punch_date !== todayStr) {
      await this.client.execute({
        sql: `UPDATE gym_members SET streak_days = ?, last_punch_date = ? WHERE id = ?`,
        args: [newStreak, todayStr, String(id)]
      });
    }

    await this.client.execute({
      sql: `INSERT INTO gym_attendance (member_id, member_name, punch_time, status) VALUES (?, ?, ?, ?)`,
      args: [String(id), member.name, punchTime.toISOString(), 'VERIFIED']
    });

    return { ...member, streak_days: newStreak, last_punch_date: todayStr };
  }
}

export const gymDB = new GymDatabase();
