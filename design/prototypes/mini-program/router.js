const ROUTES = {
  home: '01-home.html',
  category: '02-category.html',
  'product-list': '03-product-list.html',
  store: '03-store.html',
  'store-products': '04-store-products.html',
  'product-detail': '05-product-detail.html',
  'booking-submit': '06-booking-submit.html',
  'booking-success': '07-booking-success.html',
  'booking-list': '08-booking-list.html',
  profile: '09-profile.html',
  'booking-detail': '10-booking-detail.html',
  'booking-history': '17-booking-history.html',
  about: '11-about.html',
  feedback: '12-feedback.html',
  contact: '13-contact.html',
  join: '14-join-us.html',
  agreement: '15-user-agreement.html',
  privacy: '16-privacy-policy.html'
};

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('*').forEach((node) => {
    const text = (node.textContent || '').trim();
    if (text === '预约' || text === '购物车') {
      node.textContent = '预约单';
    }
  });
});

function go(page) {
  if (window.parent !== window) {
    window.parent.postMessage({ type: 'navigate', page }, '*');
    return;
  }
  const file = ROUTES[page] || page;
  window.location.href = file;
}

function setSelectedStore(store) {
  sessionStorage.setItem('selectedStore', JSON.stringify(store));
}

function getSelectedStore() {
  try {
    return JSON.parse(sessionStorage.getItem('selectedStore') || 'null');
  } catch (err) {
    return null;
  }
}

function setDraftBooking(payload) {
  sessionStorage.setItem('draftBooking', JSON.stringify(payload));
}

function getDraftBooking() {
  try {
    return JSON.parse(sessionStorage.getItem('draftBooking') || 'null');
  } catch (err) {
    return null;
  }
}

function ensureDraftBooking() {
  const draft = getDraftBooking();
  if (draft && Array.isArray(draft.items)) return draft;
  const base = { items: [] };
  setDraftBooking(base);
  return base;
}

function addBookingItem(item) {
  const draft = ensureDraftBooking();
  const items = Array.isArray(draft.items) ? draft.items : [];
  const found = items.find(existing =>
    existing.name === item.name &&
    (existing.spec || '') === (item.spec || '')
  );
  if (found) {
    found.quantity = (found.quantity || 1) + (item.quantity || 1);
  } else {
    items.push({
      name: item.name,
      price: item.price,
      spec: item.spec || '',
      quantity: item.quantity || 1,
      icon: item.icon || '📦'
    });
  }
  draft.items = items;
  setDraftBooking(draft);
  return draft;
}

function countBookingItems() {
  const draft = getDraftBooking();
  if (!draft || !Array.isArray(draft.items)) return 0;
  return draft.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
}

function clearBookingItems() {
  const draft = ensureDraftBooking();
  draft.items = [];
  setDraftBooking(draft);
}

function setLastReservation(payload) {
  sessionStorage.setItem('lastReservation', JSON.stringify(payload));
}

function getLastReservation() {
  try {
    return JSON.parse(sessionStorage.getItem('lastReservation') || 'null');
  } catch (err) {
    return null;
  }
}

function getReservationHistory() {
  try {
    const data = JSON.parse(sessionStorage.getItem('reservationHistory') || '[]');
    return Array.isArray(data) ? data : [];
  } catch (err) {
    return [];
  }
}

function setReservationHistory(items) {
  sessionStorage.setItem('reservationHistory', JSON.stringify(items));
}

function submitCurrentBooking(formData) {
  const draft = ensureDraftBooking();
  const items = Array.isArray(draft.items) ? draft.items.filter(Boolean) : [];
  const bookingNo = 'LH' + Date.now().toString().slice(-8);
  const reservation = {
    bookingNo,
    items,
    storeName: formData.storeName || draft.storeName || '',
    visitDate: formData.visitDate || '',
    timeSlot: formData.timeSlot || '',
    carModel: formData.carModel || '',
    phone: formData.phone || '',
    remark: formData.remark || '',
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  const history = getReservationHistory();
  history.unshift(reservation);
  setReservationHistory(history);
  setLastReservation(reservation);
  draft.items = [];
  setDraftBooking(draft);
  return reservation;
}
