import { gymDB } from './database.js';
import { DIET_TIPS, WORKOUT_ROUTINES, getRandomMotivation } from './templates.js';

export function handleIncomingCommand(senderPhone, messageText) {
  const text = (messageText || '').trim().toLowerCase();
  const member = gymDB.getMemberByPhone(senderPhone);
  const memberName = member ? member.name : 'Gym Bro';
  const gymInfo = gymDB.getGymInfo();

  // 1. Help / Menu
  if (text === '!menu' || text === '!help' || text === 'menu' || text === 'hi' || text === 'hello') {
    return `🏋️ *Welcome to ${gymInfo.name} WhatsApp Assistant!*

Hi *${memberName}*, type any command below to get instant info:

📌 *!fees* — Check membership expiry & due
📌 *!workout* — Today's workout routine & split
📌 *!diet* — High protein diet & meal tips
📌 *!streak* — Your consecutive gym streak days
📌 *!timing* — Gym open & close hours
📌 *!pay* — UPI renewal payment details
📌 *!trainer* — Gym trainer support
📌 *!motivate* — Daily fitness motivation quote

_Reply with any command like *!fees* or *!workout*_ 🔥`;
  }

  // 2. Fees & Expiry Check
  if (text === '!fees' || text === '!due' || text === 'fees') {
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

  // 3. Today's Workout Routine
  if (text === '!workout' || text === '!today' || text === 'workout') {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const currentDay = days[new Date().getDay()];

    if (currentDay === 'sunday') {
      return `☀️ *Sunday — Active Rest & Recovery!*
Stretch, drink plenty of water, sleep well, and prep for Monday beast mode! 🧘`;
    }

    return WORKOUT_ROUTINES[currentDay] || WORKOUT_ROUTINES.monday;
  }

  // 4. Diet & Nutrition
  if (text.startsWith('!diet') || text === 'diet') {
    return `🥗 *${gymInfo.name} — Nutrition Blueprint*

${DIET_TIPS.protein}

${DIET_TIPS.preworkout}

${DIET_TIPS.postworkout}

${DIET_TIPS.water}`;
  }

  // 5. Streak Check
  if (text === '!streak' || text === 'streak') {
    const streak = member ? (member.streakDays || 1) : 1;
    return `🔥 *Iron Streak: ${streak} Days!*

Mass *${memberName}*! You have checked in for *${streak} days*!
Consistency builds champions. Keep the flame burning! 🏆`;
  }

  // 6. Gym Timings
  if (text === '!timing' || text === '!time' || text === 'timing') {
    return `⏰ *${gymInfo.name} Timings:*

${gymInfo.timing}

Come anytime during these hours and smash your workout! 💥`;
  }

  // 7. UPI Payment Details
  if (text === '!pay' || text === '!upi' || text === 'pay') {
    return `📲 *Instant Renewal UPI:*

• *UPI ID:* \`${gymInfo.upi}\`
• *Amount:* ₹${member?.feesAmount || 1500}
• *Google Pay / PhonePe / Paytm* moolama pay pannittu, screenshot-ah front desk-la kaatunga. Instant-ah receipt vandhudum! 🚀`;
  }

  // 8. Motivation
  if (text === '!motivate' || text === 'quote') {
    return `🔥 *Daily Fuel for ${memberName}:*

"${getRandomMotivation()}"

Now get up and move that iron! 🏋️`;
  }

  // 9. Trainer & Staff Contact
  if (text === '!trainer') {
    return `📞 *${gymInfo.name} Trainer Support:*

Front Desk & Certified Trainers:
📱 Phone: ${gymInfo.contact}
📍 Fitness floor guidance & personal training slots available. Speak to our head trainer today!`;
  }

  // Fallback default message
  return null;
}
