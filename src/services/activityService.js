const DomainError = require('./DomainError');

const activities = [
  { id: '1', name: 'Rohtang Pass Trek', location: 'Manali', category: 'trekking', rating: 4.8, reviews: 3200, price: 1500, duration: '1 day', emoji: '🥾', description: 'Trek to the iconic Rohtang Pass at 13,050 ft.' },
  { id: '2', name: 'Solang Valley Skiing', location: 'Manali', category: 'skiing', rating: 4.6, reviews: 2800, price: 2500, duration: '4 hours', emoji: '⛷️', description: 'Ski on pristine slopes in Solang Valley.' },
  { id: '3', name: 'Bir Billing Paragliding', location: 'Bir Billing', category: 'paragliding', rating: 4.9, reviews: 4100, price: 3500, duration: '2 hours', emoji: '🪂', description: 'Tandem paragliding from world-class launch site.' },
  { id: '4', name: 'Beas River Rafting', location: 'Kullu', category: 'rafting', rating: 4.5, reviews: 5600, price: 800, duration: '3 hours', emoji: '🚣', description: 'White-water rafting on the Beas River.' },
  { id: '5', name: 'Triund Trek', location: 'Dharamshala', category: 'trekking', rating: 4.7, reviews: 6200, price: 1200, duration: '2 days', emoji: '⛺', description: 'Overnight trek to Triund with Dhauladhar views.' },
  { id: '6', name: 'Spiti Valley Camping', location: 'Spiti', category: 'camping', rating: 4.9, reviews: 1800, price: 4000, duration: '3 days', emoji: '🏕️', description: 'Camp under the stars in the cold desert.' },
  { id: '7', name: 'Shimla Heritage Walk', location: 'Shimla', category: 'sightseeing', rating: 4.3, reviews: 8900, price: 500, duration: '3 hours', emoji: '🚶', description: 'Guided walk through colonial-era Shimla.' },
  { id: '8', name: 'Kheerganga Trek', location: 'Kasol', category: 'trekking', rating: 4.6, reviews: 4700, price: 1000, duration: '2 days', emoji: '♨️', description: 'Trek to natural hot springs at Kheerganga.' },
];

function getAll(search) {
  if (search) {
    const q = search.toLowerCase();
    return activities.filter(a =>
      a.name.toLowerCase().includes(q) ||
      a.location.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q)
    );
  }
  return activities;
}

function getById(id) {
  const activity = activities.find(a => a.id === id);
  if (!activity) throw new DomainError(`Activity with id '${id}' not found`, 404);
  return activity;
}

function create(data) {
  if (activities.find(a => a.name.toLowerCase() === data.name.toLowerCase())) {
    throw new DomainError(`Activity '${data.name}' already exists`, 409);
  }
  const newActivity = { id: String(activities.length + 1), ...data };
  activities.push(newActivity);
  return newActivity;
}

module.exports = { getAll, getById, create };
