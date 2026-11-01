import { gymDB } from './database.js';
import { templates } from './templates.js';
import { waService } from './whatsapp.js';

class AutomatedScheduler {
  constructor() {
    this.intervalId = null;
    this.sentBirthdaysToday = new Set();
    this.sentRemindersToday = new Set();
  }

  start() {
    console.log('⏰ Automated Gym Scheduler started (Birthdays, Expiry Reminders, Streaks)');

    // Run check every 30 minutes
    this.intervalId = setInterval(() => this.runScheduledChecks(), 30 * 60 * 1000);
    
    // Initial run on boot
    setTimeout(() => this.runScheduledChecks(), 5000);
  }

  async runScheduledChecks() {
    const now = new Date();
    const currentHour = now.getHours();
    const todayDateStr = now.toISOString().split('T')[0];

    // Reset daily tracker at midnight
    if (currentHour === 0) {
      this.sentBirthdaysToday.clear();
      this.sentRemindersToday.clear();
    }

    // 1. Morning 8 AM - 10 AM: Birthday Wishes Auto-Dispatcher
    if (currentHour >= 8 && currentHour <= 20) {
      await this.dispatchBirthdayWishes(todayDateStr);
    }

    // 2. Morning 9 AM - 11 AM: Fees Expiry Warnings
    if (currentHour >= 9 && currentHour <= 18) {
      await this.dispatchExpiryWarnings(todayDateStr);
    }
  }

  // Auto-send Birthday Wishes
  async dispatchBirthdayWishes(todayStr) {
    if (waService.connectionStatus !== 'connected') return;

    const bdayMembers = await gymDB.getTodaysBirthdays();
    for (const member of bdayMembers) {
      const key = `${todayStr}_${member.id}`;
      if (!this.sentBirthdaysToday.has(key)) {
        try {
          const text = templates.birthdayWish({ name: member.name });
          await waService.sendTextMessage(member.phone, text);
          console.log(`🎂 Auto-sent Birthday Wish to: ${member.name} (${member.phone})`);
          this.sentBirthdaysToday.add(key);
        } catch (err) {
          console.error(`Failed to send birthday wish to ${member.name}:`, err.message);
        }
      }
    }
  }

  // Auto-send Fees Expiry Warnings (3 days before)
  async dispatchExpiryWarnings(todayStr) {
    if (waService.connectionStatus !== 'connected') return;

    const expiringMembers = await gymDB.getExpiringMembers(3);
    for (const member of expiringMembers) {
      const key = `${todayStr}_${member.id}`;
      if (!this.sentRemindersToday.has(key)) {
        try {
          const text = templates.expiryWarning({
            name: member.name,
            daysLeft: 3,
            expiryDate: member.expiryDate,
            amount: member.feesAmount || 1500
          });
          await waService.sendTextMessage(member.phone, text);
          console.log(`⚠️ Auto-sent Expiry Warning to: ${member.name} (${member.phone})`);
          this.sentRemindersToday.add(key);
        } catch (err) {
          console.error(`Failed to send expiry warning to ${member.name}:`, err.message);
        }
      }
    }
  }
}

export const scheduler = new AutomatedScheduler();
