const DomainError = require('./DomainError');

// In-memory data store — replace with DB in production
const destinations = [
  { id: '1', name: 'Manali', region: 'Kullu', category: 'hill-station', rating: 4.7, reviews: 12400, price: 3500, emoji: '🏔️', description: 'Gateway to Rohtang Pass and Solang Valley.' },
  { id: '2', name: 'Shimla', region: 'Shimla', category: 'hill-station', rating: 4.5, reviews: 18200, price: 2800, emoji: '🏡', description: 'Former summer capital of British India.' },
  { id: '3', name: 'Spiti Valley', region: 'Lahaul & Spiti', category: 'adventure', rating: 4.9, reviews: 5600, price: 6000, emoji: '🌄', description: 'Cold desert mountain valley at 12,500 ft.' },
  { id: '4', name: 'Dharamshala', region: 'Kangra', category: 'religious', rating: 4.6, reviews: 9800, price: 2500, emoji: '🙏', description: 'Home of the Dalai Lama and Tibetan culture.' },
  { id: '5', name: 'Kasol', region: 'Kullu', category: 'nature', rating: 4.4, reviews: 7300, price: 1800, emoji: '🌿', description: 'Mini Israel of India on the Parvati River.' },
  { id: '6', name: 'Kullu', region: 'Kullu', category: 'adventure', rating: 4.3, reviews: 6100, price: 2200, emoji: '🌊', description: 'Famous for river rafting and the Kullu Dussehra.' },
  { id: '7', name: 'Chail', region: 'Solan', category: 'heritage', rating: 4.2, reviews: 3400, price: 2000, emoji: '🏰', description: 'Home to the world\'s highest cricket ground.' },
  { id: '8', name: 'Bir Billing', region: 'Kangra', category: 'adventure', rating: 4.8, reviews: 4200, price: 4500, emoji: '🪂', description: 'World\'s second-best paragliding site.' },
];

function getAll(search) {
  if (search) {
    const q = search.toLowerCase();
    return destinations.filter(d =>
      d.name.toLowerCase().includes(q) ||
      d.region.toLowerCase().includes(q) ||
      d.category.toLowerCase().includes(q)
    );
  }
  return destinations;
}

function getById(id) {
  const dest = destinations.find(d => d.id === id);
  if (!dest) throw new DomainError(`Destination with id '${id}' not found`, 404);
  return dest;
}

function create(data) {
  if (destinations.find(d => d.name.toLowerCase() === data.name.toLowerCase())) {
    throw new DomainError(`Destination '${data.name}' already exists`, 409);
  }
  const newDest = { id: String(destinations.length + 1), ...data };
  destinations.push(newDest);
  return newDest;
}

module.exports = { getAll, getById, create };
