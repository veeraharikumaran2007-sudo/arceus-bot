import { createClient } from '@libsql/client';

const TURSO_URL = 'libsql://arceus-veeraharikumaran2007-sudo.aws-ap-south-1.turso.io';
const TURSO_AUTH_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3OTM1NDY3NTgsImlkIjoiMDFhMTk3YjYtMTcwMS03MjEzLTk1ZGUtOThkYWFkODhiMzY4Iiwia2lkIjoiSFJRaXItR0tpX2o4cml0TDJaWHJxNkl1WjVWRUc4eEQ1d19LUGp3NVQybyIsInJpZCI6IjA0MGU3YzgyLTg1YWMtNGEyOS05MWRmLTNmZDg3YWQ3M2I0NCJ9.FgoOBUh_PH2opEmql6CYuImIMZVa1oGpS7IzNQ2lr_ly2N-0MuWrG5lF4JBbMwXurefHoOvkwUEDYIqa_HCvCg';

export const turso = createClient({
  url: TURSO_URL,
  authToken: TURSO_AUTH_TOKEN
});

async function initTables() {
  console.log('⚡ Connecting to Arceus Central Cloud Database on Turso (Mumbai)...');

  try {
    // 1. Gym Members Table
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS gym_members (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        dob TEXT,
        join_date TEXT,
        expiry_date TEXT,
        fees_status TEXT DEFAULT 'PAID',
        fees_amount REAL DEFAULT 1500,
        streak_days INTEGER DEFAULT 0,
        last_punch_date TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Table Created: gym_members');

    // 2. Gym Attendance Table
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS gym_attendance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        member_id TEXT NOT NULL,
        member_name TEXT,
        punch_time DATETIME DEFAULT CURRENT_TIMESTAMP,
        status TEXT DEFAULT 'VERIFIED',
        device TEXT DEFAULT 'MAIN_GATE'
      );
    `);
    console.log('✅ Table Created: gym_attendance');

    // 3. Gym Fees Transactions Ledger Table
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS gym_transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        member_id TEXT NOT NULL,
        amount REAL NOT NULL,
        plan TEXT,
        valid_till TEXT,
        bill_no TEXT,
        payment_mode TEXT DEFAULT 'CASH',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Table Created: gym_transactions');

    // 4. Arceus Company Clients Table (Master CRM)
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS arceus_clients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        company_name TEXT NOT NULL,
        contact_person TEXT,
        phone TEXT,
        email TEXT,
        niche TEXT,
        tier TEXT,
        project_status TEXT DEFAULT 'LEAD',
        contract_amount REAL,
        advance_paid REAL,
        balance_due REAL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Table Created: arceus_clients');

    // 5. Arceus Outreach Leads Table
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS arceus_leads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        business_name TEXT NOT NULL,
        category TEXT,
        phone TEXT NOT NULL,
        city TEXT,
        has_website INTEGER DEFAULT 0,
        outreach_status TEXT DEFAULT 'PENDING',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Table Created: arceus_leads');

    // Insert a sample member if not exists
    await turso.execute({
      sql: `INSERT OR IGNORE INTO gym_members (id, name, phone, dob, join_date, expiry_date, fees_status, fees_amount, streak_days) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: ['101', 'Arun Kumar', '919876543210', '11-01', '2026-01-15', '2026-11-05', 'PAID', 1500, 14]
    });

    console.log('\n========================================================');
    console.log('🎉 ARCEUS COMPANY CLOUD DATABASE INITIALIZED SUCCESSFULLY!');
    console.log('========================================================\n');
  } catch (err) {
    console.error('❌ Failed to initialize Turso database:', err);
  }
}

initTables();
