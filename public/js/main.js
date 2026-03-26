const API = '/api';

// State
let allDestinations = [];
let allActivities = [];
let activeFilter = 'all';

// DOM helpers
const $ = id => document.getElementById(id);

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function renderDestinations(list) {
  const grid = $('destinations-grid');
  if (!list.length) { grid.innerHTML = '<p class="error-msg">No destinations found.</p>'; return; }
  grid.innerHTML = list.map(d => `
    <div class="card" onclick="openDetail('destination', '${d.id}')">
      <div class="card-img">${d.emoji || '🏔️'}</div>
      <div class="card-body">
        <h3>${d.name}</h3>
        <p class="location">📍 ${d.region}</p>
        <p class="rating">⭐ ${d.rating} &nbsp; <span style="color:#888">(${d.reviews} reviews)</span></p>
        <span class="tag">${d.category}</span>
        <p class="price">From ₹${d.price?.toLocaleString('en-IN') ?? 'Free'}</p>
      </div>
    </div>`).join('');
}

function renderActivities(list) {
  const grid = $('activities-grid');
  if (!list.length) { grid.innerHTML = '<p class="error-msg">No activities found.</p>'; return; }
  grid.innerHTML = list.map(a => `
    <div class="card" onclick="openDetail('activity', '${a.id}')">
      <div class="card-img" style="background:linear-gradient(135deg,#f093fb,#f5576c)">${a.emoji || '🎯'}</div>
      <div class="card-body">
        <h3>${a.name}</h3>
        <p class="location">📍 ${a.location}</p>
        <p class="rating">⭐ ${a.rating} &nbsp; <span style="color:#888">(${a.reviews} reviews)</span></p>
        <span class="tag">${a.category}</span>
        <p class="price">₹${a.price?.toLocaleString('en-IN') ?? 'Free'} per person</p>
      </div>
    </div>`).join('');
}

async function loadDestinations() {
  $('destinations-grid').innerHTML = '<p class="loading">Loading destinations...</p>';
  try {
    const data = await fetchJSON(`${API}/destinations`);
    allDestinations = data.destinations;
    renderDestinations(allDestinations);
  } catch (e) {
    $('destinations-grid').innerHTML = '<p class="error-msg">Failed to load destinations.</p>';
  }
}

async function loadActivities() {
  $('activities-grid').innerHTML = '<p class="loading">Loading activities...</p>';
  try {
    const data = await fetchJSON(`${API}/activities`);
    allActivities = data.activities;
    renderActivities(allActivities);
  } catch (e) {
    $('activities-grid').innerHTML = '<p class="error-msg">Failed to load activities.</p>';
  }
}

function applyFilter(category) {
  activeFilter = category;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.toggle('active', b.dataset.filter === category));
  const filtered = category === 'all' ? allDestinations : allDestinations.filter(d => d.category === category);
  renderDestinations(filtered);
}

async function handleSearch() {
  const q = $('search-input').value.trim();
  if (!q) { renderDestinations(allDestinations); renderActivities(allActivities); return; }
  try {
    const [dRes, aRes] = await Promise.all([
      fetchJSON(`${API}/destinations?search=${encodeURIComponent(q)}`),
      fetchJSON(`${API}/activities?search=${encodeURIComponent(q)}`)
    ]);
    renderDestinations(dRes.destinations);
    renderActivities(aRes.activities);
  } catch (e) {
    console.error(e);
  }
}

function openDetail(type, id) {
  window.location.href = `/detail.html?type=${type}&id=${id}`;
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  loadDestinations();
  loadActivities();

  $('search-btn').addEventListener('click', handleSearch);
  $('search-input').addEventListener('keydown', e => { if (e.key === 'Enter') handleSearch(); });

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => applyFilter(btn.dataset.filter));
  });
});
