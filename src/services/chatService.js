const destinationService = require('./destinationService');
const activityService = require('./activityService');

const greetings = ['hi', 'hello', 'hey', 'hii', 'howdy', 'namaste'];

function reply(message) {
  const msg = message.toLowerCase().trim();

  if (greetings.some(g => msg.includes(g))) {
    return 'Namaste! 🙏 Welcome to HP Travel. Ask me about destinations, activities, trekking, skiing, or anything about Himachal Pradesh!';
  }

  if (msg.includes('best time') || msg.includes('when to visit') || msg.includes('season')) {
    return '🗓️ Best time to visit Himachal Pradesh:\n• Summer (Mar–Jun): Pleasant weather, great for trekking\n• Monsoon (Jul–Sep): Lush greenery, avoid Spiti/Lahaul\n• Winter (Oct–Feb): Snow, skiing in Manali & Solang Valley';
  }

  if (msg.includes('trek') || msg.includes('trekking') || msg.includes('hike')) {
    const treks = activityService.getAll('trekking');
    const names = treks.map(t => `• ${t.name} (${t.location}) — ₹${t.price}`).join('\n');
    return `🥾 Popular treks in Himachal Pradesh:\n${names}`;
  }

  if (msg.includes('ski') || msg.includes('skiing') || msg.includes('snow')) {
    return '⛷️ Best skiing spots:\n• Solang Valley, Manali — beginner to intermediate slopes\n• Kufri, Shimla — short ski runs\n• Narkanda — less crowded, great powder snow';
  }

  if (msg.includes('paraglid') || msg.includes('fly') || msg.includes('bir')) {
    const pg = activityService.getAll('paragliding');
    const names = pg.map(a => `• ${a.name} — ₹${a.price}`).join('\n');
    return `🪂 Paragliding options:\n${names}\nBir Billing is the world's 2nd best paragliding site!`;
  }

  if (msg.includes('raft') || msg.includes('river') || msg.includes('water')) {
    return '🚣 River rafting is best at:\n• Beas River, Kullu — Grade 2-4 rapids\n• Best season: July to September';
  }

  if (msg.includes('manali')) {
    const d = destinationService.getById('1');
    return `🏔️ ${d.name}: ${d.description}\nRating: ⭐ ${d.rating} | From ₹${d.price}`;
  }

  if (msg.includes('shimla')) {
    const d = destinationService.getById('2');
    return `🏡 ${d.name}: ${d.description}\nRating: ⭐ ${d.rating} | From ₹${d.price}`;
  }

  if (msg.includes('spiti')) {
    const d = destinationService.getById('3');
    return `🌄 ${d.name}: ${d.description}\nRating: ⭐ ${d.rating} | From ₹${d.price}`;
  }

  if (msg.includes('dharamshala') || msg.includes('mcleod') || msg.includes('dalai')) {
    const d = destinationService.getById('4');
    return `🙏 ${d.name}: ${d.description}\nRating: ⭐ ${d.rating} | From ₹${d.price}`;
  }

  if (msg.includes('kasol') || msg.includes('parvati')) {
    const d = destinationService.getById('5');
    return `🌿 ${d.name}: ${d.description}\nRating: ⭐ ${d.rating} | From ₹${d.price}`;
  }

  if (msg.includes('destination') || msg.includes('place') || msg.includes('visit')) {
    const all = destinationService.getAll();
    const names = all.map(d => `• ${d.name} (${d.category})`).join('\n');
    return `📍 All destinations:\n${names}\nAsk me about any specific place for more details!`;
  }

  if (msg.includes('activit') || msg.includes('thing to do') || msg.includes('adventure')) {
    const all = activityService.getAll();
    const names = all.map(a => `• ${a.name} — ₹${a.price}`).join('\n');
    return `🎯 All activities:\n${names}`;
  }

  if (msg.includes('budget') || msg.includes('cheap') || msg.includes('cost') || msg.includes('price')) {
    return '💰 Budget tips:\n• Kasol & Kheerganga — very budget friendly (₹1000-2000/day)\n• Shimla — mid-range (₹2000-4000/day)\n• Spiti Valley — plan ₹5000+/day for remote areas\n• Book in advance for Manali during peak season!';
  }

  if (msg.includes('hotel') || msg.includes('stay') || msg.includes('accommodation')) {
    return '🏨 Accommodation options:\n• Hostels in Kasol & Manali from ₹400/night\n• Guesthouses in Dharamshala from ₹800/night\n• Luxury resorts in Shimla from ₹5000/night\n• Camping in Spiti from ₹1500/night';
  }

  if (msg.includes('food') || msg.includes('eat') || msg.includes('cuisine')) {
    return '🍽️ Must-try food in HP:\n• Dham — traditional Himachali feast\n• Siddu — steamed bread with ghee\n• Chha Gosht — lamb curry\n• Tudkiya Bhath — spiced rice\n• Tibetan momos in Dharamshala';
  }

  if (msg.includes('thank') || msg.includes('bye') || msg.includes('goodbye')) {
    return 'Happy travels! 🏔️ Come back anytime for more Himachal Pradesh tips. Jai Himachal!';
  }

  return "I'm not sure about that. Try asking about destinations, trekking, skiing, paragliding, best time to visit, budget, food, or accommodation in Himachal Pradesh! 🏔️";
}

module.exports = { reply };
