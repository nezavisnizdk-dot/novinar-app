// Simplified date formatting without external locale
export const bs = {
  locale: 'bs'
};

export const formatDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString('bs-BA');
};

export const formatTime = (date) => {
  const d = new Date(date);
  return d.toLocaleTimeString('bs-BA', { hour: '2-digit', minute: '2-digit' });
};
