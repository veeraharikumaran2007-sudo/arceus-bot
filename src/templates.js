/**
 * Arceus Bot — Massive Gym Command, Template & Motivation Library
 * Contains Birthday wishes, Streak milestones, Inactivity reminders, Diet tips, Workout splits, and Fees triggers.
 */

// Daily Motivational Quotes Bank (Rotates daily so messages are never repetitive!)
export const MOTIVATION_BANK = [
  "No pain, no gain! Push past your limits today! 💪",
  "The only bad workout is the one that didn't happen. Let's crush it! 🔥",
  "Action cures fear. Discipline builds champions. Keep grinding! 🏋️",
  "Your body can stand almost anything. It's your mind you have to convince! 🧠⚡",
  "Sweat is fat crying. Consistency is the magic formula! 💦",
  "Don't count the days, make the days count. Beast mode ON! 🦁",
  "Small daily improvements over time lead to stunning results. Stay consistent! 📈",
  "Excuses don't burn calories. Greatness requires sweat! 💥",
  "You don't have to be extreme, just consistent. Proud of your hustle! 🥇",
  "Today's soreness is tomorrow's strength! Keep pushing! 🚀"
];

// Diet & Nutrition Tips Bank
export const DIET_TIPS = {
  protein: `🍗 *Protein Guide:*
Aim for 1.6g to 2g of protein per kg of bodyweight daily.
• Eggs (6g protein per egg)
• Chicken breast / Paneer (20-25g per 100g)
• Soya chunks (50g protein per 100g)
• Greek yogurt / Curd & Dal`,

  preworkout: `⚡ *Pre-Workout Meal (30-45 mins before):*
• 1 Banana + 1 tbsp Peanut butter
• Black coffee (caffeine boost)
• Oats with half cup milk`,

  postworkout: `🥤 *Post-Workout Fuel (within 45 mins):*
• Whey protein scoop or 3 boiled egg whites + 1 whole egg
• 1 Sweet potato or bowl of white rice for glycogen replenishment!`,

  water: `💧 *Hydration Tip:*
Drink at least 3.5 to 4 Litres of water daily. Proper hydration increases muscle recovery by 30%!`
};

// Daily Workout Routine Splits
export const WORKOUT_ROUTINES = {
  monday: `🏋️ *Monday — Chest & Triceps:*
1. Barbell Flat Bench Press (4 sets x 8-12 reps)
2. Incline Dumbbell Press (3 sets x 10-12 reps)
3. Cable Chest Flyes (3 sets x 15 reps)
4. Tricep Rope Pushdowns (4 sets x 12 reps)
5. Skull Crushers (3 sets x 10 reps)`,

  tuesday: `🏋️ *Tuesday — Back & Biceps:*
1. Lat Pulldowns (4 sets x 10-12 reps)
2. Barbell Bent-over Rows (3 sets x 8-10 reps)
3. Seated Cable Rows (3 sets x 12 reps)
4. Dumbbell Hammer Curls (4 sets x 12 reps)
5. Barbell Bicep Curls (3 sets x 10 reps)`,

  wednesday: `🏋️ *Wednesday — Legs & Calves:*
1. Barbell Squats (4 sets x 8-10 reps)
2. Leg Press (4 sets x 12 reps)
3. Hamstring Leg Curls (3 sets x 12 reps)
4. Romanian Deadlifts (3 sets x 10 reps)
5. Standing Calf Raises (4 sets x 15 reps)`,

  thursday: `🏋️ *Thursday — Shoulders & Abs:*
1. Overhead Dumbbell Shoulder Press (4 sets x 8-12 reps)
2. Dumbbell Lateral Raises (4 sets x 15 reps)
3. Face Pulls for Rear Delts (3 sets x 15 reps)
4. Hanging Leg Raises (3 sets x 15 reps)
5. Plank (3 sets x 60 seconds)`,

  friday: `🏋️ *Friday — Arms & Core Gun-Show:*
1. Preacher Curls (3 sets x 12 reps)
2. Incline Dumbbell Curls (3 sets x 10 reps)
3. Overhead Tricep Extension (4 sets x 12 reps)
4. Dips (Bodyweight to failure - 3 sets)
5. Cable Ab Crunches (3 sets x 20 reps)`,

  saturday: `🔥 *Saturday — HIIT Cardio & Mobility:*
1. 15 mins Treadmill Incline Walk / Sprint intervals
2. 500m Rowing machine
3. Foam rolling & Full-body dynamic stretching
4. Rest & Recovery!`
};

export function getRandomMotivation() {
  return MOTIVATION_BANK[Math.floor(Math.random() * MOTIVATION_BANK.length)];
}

export const templates = {
  // 1. Birthday Wish Trigger (Automated 8:00 AM)
  birthdayWish: ({ name, gymName = 'Arceus Fitness' }) => {
    return `🎂🎉 *HAPPY BIRTHDAY ${name.toUpperCase()}!* 🎈🎁

On behalf of the entire *${gymName} Family & Trainers*, we wish you a phenomenal birthday!

May this year bring you unstoppable health, peak strength, and mind-blowing gains! 💪

🎁 *Special Birthday Gift:*
Enjoy a *FREE Protein Shake* or *₹200 Birthday Discount* on your next renewal! Just show this message at the front desk.

Have an absolute blast today bro! 🔥`;
  },

  // 2. Attendance Streak Milestones
  streakMilestone: ({ name, streakDays, gymName = 'Arceus Fitness' }) => {
    return `🔥🏆 *UNSTOPPABLE STREAK!* 🏆🔥

Mass bro *${name}*!
Neenga continuous-ah *${streakDays} DAYS* gym-ku vandhu record create pannirukkeenga!

Consistencies make champions. Keep this iron discipline going!
— *Team ${gymName}*`;
  },

  // 3. Inactivity Alert (Missing member 3 / 7 days)
  inactivityAlert: ({ name, daysInactive, gymName = 'Arceus Fitness' }) => {
    return `👋 *Bro ${name}, Everything okay?*

Namma gym-la unga workout slot kaathirukku! You haven't visited the gym for the last *${daysInactive} days*.

Fitness is a marathon, not a sprint. Don't let your hard-earned progress slide!
Come back today, let's restart the rhythm! 💪🔥
— *Team ${gymName}*`;
  },

  // 4. Biometric Check-in
  checkIn: ({ name, time, gymName = 'Arceus Fitness' }) => {
    const quote = getRandomMotivation();
    return `🏋️ *${gymName} — Check-in Confirmed!*

வணக்கம் *${name}*,
✅ Unga workout entry register aagirukku!
⏰ *Punch Time:* ${time}

🔥 _"${quote}"_`;
  },

  // 5. Fees Payment Receipt (DBook)
  feeReceipt: ({ name, amount, plan = 'Monthly Membership', validTill, billNo, gymName = 'Arceus Fitness' }) => {
    return `🧾 *${gymName} — Payment Receipt*

வணக்கம் *${name}*,
Unga fees payment successfully receive aagirukku!

💵 *Amount Paid:* ₹${amount}
📋 *Plan:* ${plan}
📅 *Valid Till:* ${validTill}
🔢 *Receipt No:* #${billNo}

Nandri! We appreciate your commitment to your fitness! 🚀`;
  },

  // 6. Membership Expiry Reminder
  expiryWarning: ({ name, daysLeft, expiryDate, amount, upiLink, gymName = 'Arceus Fitness' }) => {
    return `⚠️ *${gymName} — Membership Renewal Alert*

Hi *${name}*,
Unga gym membership innum *${daysLeft} days-la (${expiryDate})* expire aagudhu!

Thadavu illama workout continue panna, please renew pannikkonga:
💰 *Renewal Fees:* ₹${amount}
${upiLink ? `📲 *Instant UPI Pay:* ${upiLink}` : '📍 Front desk-la pay pannalaam.'}

Keep that fitness streak alive! 💪`;
  },

  // 7. Access Denied / Blocked
  blockedAlert: ({ name, dueAmount, gymName = 'Arceus Fitness' }) => {
    return `⛔ *${gymName} — Access Denied / Fees Due*

Hi *${name}*,
Unga membership date expire aanadhaala biometric attendance *Block* aagirukku.

⚠️ *Renewal Amount:* ₹${dueAmount || 'Fees Due'}
Please reception counter-la renew pannikonga. System automatic-ah unlock pannidum!

Thank you! 🙌`;
  }
};
