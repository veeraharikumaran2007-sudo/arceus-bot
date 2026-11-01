import { gymDB } from './database.js';
import { DIET_TIPS, WORKOUT_ROUTINES, getRandomMotivation } from './templates.js';
import { askGeminiFitnessCoach } from './ai.js';

export async function handleIncomingCommand(senderPhone, messageText) {
  const text = (messageText || '').trim();
  const lower = text.toLowerCase();
  const member = gymDB.getMemberByPhone(senderPhone);
  const memberName = member ? member.name : 'Bro';
  const gymInfo = gymDB.getGymInfo();

  // 1. Help / Menu
  if (lower === '!menu' || lower === '!help') {
    return `🏋️ *${gymInfo.name} — AI Fitness Assistant*

Hi *${memberName}*, neenga enna doubt venumnalum direct-ah enkitta Tamil / Tanglish / English-la kekkalaam! 🤖

*Quick System Commands:*
📌 *!fees* — Check membership expiry & due
📌 *!workout* — Today's workout routine & split
📌 *!streak* — Your consecutive gym streak days
📌 *!timing* — Gym open & close hours
📌 *!pay* — UPI renewal payment details

💡 *Or Just Ask Anything:*
_Example: "Bro 5kg kuraiya enna diet sapdanum?", "Creatine eppo edukanum?", "Chest workout la bench press form sollu"_

Enkitta direct-ah kelunga, ungalukku instant AI guidance tharen! 💪🔥`;
  }

  // 2. Fees & Expiry Check
  if (lower === '!fees' || lower === '!due') {
    if (!member) {
      return `Hi! Unga mobile number register aagala. Please reception counter-la unga number verify pannikonga.`;
    }
    const today = new Date();
    const expiry = new Date(member.expiryDate);
    const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

    return `🧾 *${gymInfo.name} — Membership Status*

👤 *Member:* ${member.name}
📋 *Plan Status:* ${member.feesStatus === 'PAID' ? '✅ ACTIVE' : '❌ EXPIRED'}
📅 *Valid Till:* ${member.expiryDate} (${diffDays > 0 ? `${diffDays} days left` : 'Expired!'})
💰 *Renewal Amount:* ₹${member.feesAmount || 1500}

${diffDays <= 3 ? `⚠️ Please renew soon to avoid biometric access block! UPI: ${gymInfo.upi}` : 'Keep crushing your workouts! 💪'}`;
  }

  // 3. Today's Workout Routine Shortcut
  if (lower === '!workout') {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const currentDay = days[new Date().getDay()];

    if (currentDay === 'sunday') {
      return `☀️ *Sunday — Active Rest & Recovery!*
Stretch, drink plenty of water, sleep well, and prep for Monday beast mode! 🧘`;
    }

    return WORKOUT_ROUTINES[currentDay] || WORKOUT_ROUTINES.monday;
  }

  // 4. Streak Check
  if (lower === '!streak') {
    const streak = member ? (member.streakDays || 1) : 1;
    return `🔥 *Iron Streak: ${streak} Days!*

Mass *${memberName}*! You have checked in for *${streak} days*!
Consistency builds champions. Keep the flame burning! 🏆`;
  }

  // 5. Gym Timings
  if (lower === '!timing' || lower === '!time') {
    return `⏰ *${gymInfo.name} Timings:*

${gymInfo.timing}

Come anytime during these hours and smash your workout! 💥`;
  }

  // 6. UPI Payment Details
  if (lower === '!pay' || lower === '!upi') {
    return `📲 *Instant Renewal UPI:*

• *UPI ID:* \`${gymInfo.upi}\`
• *Amount:* ₹${member?.feesAmount || 1500}
• *Google Pay / PhonePe / Paytm* moolama pay pannittu, screenshot-ah front desk-la share pannunga! 🚀`;
  }

  // 7. ANY OTHER QUESTION ➔ ROUTE TO GEMINI AI TRAINER! 🧠⚡
  // Gemini will answer in natural Tamil / Tanglish / English!
  const aiReply = await askGeminiFitnessCoach(text, memberName);
  return aiReply;
}
