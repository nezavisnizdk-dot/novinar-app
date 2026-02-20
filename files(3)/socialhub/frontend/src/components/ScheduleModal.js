import React, { useState } from 'react';
import { scheduleAPI } from '../utils/api';

const ScheduleModal = ({ article, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    startHour: '15',
    startMinute: '00',
    endHour: '23',
    endMinute: '50',
    interval: '10',
    scheduledDate: '',
    scheduledTime: '03:10'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const scheduledDateTime = `${formData.scheduledDate}T${formData.scheduledTime}`;
      
      await scheduleAPI.scheduleArticle(article._id, {
        scheduledStart: `${formData.scheduledDate}T${formData.startHour}:${formData.startMinute}`,
        scheduledEnd: `${formData.scheduledDate}T${formData.endHour}:${formData.endMinute}`,
        scheduledInterval: parseInt(formData.interval),
        scheduledTime: scheduledDateTime
      });

      alert('Članak uspješno zakazan!');
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Greška pri zakazivanju');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <h2 className="modal-title">{article.title}</h2>

        {error && (
          <div className="alert alert-error">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Početak objavljivanja:</label>
            <div className="time-inputs">
              <input
                type="number"
                className="form-input"
                value={formData.startHour}
                onChange={(e) => setFormData({...formData, startHour: e.target.value})}
                min="0"
                max="23"
                placeholder="HH"
              />
              <span className="time-separator">:</span>
              <input
                type="number"
                className="form-input"
                value={formData.startMinute}
                onChange={(e) => setFormData({...formData, startMinute: e.target.value})}
                min="0"
                max="59"
                placeholder="MM"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Kraj objavljivanja:</label>
            <div className="time-inputs">
              <input
                type="number"
                className="form-input"
                value={formData.endHour}
                onChange={(e) => setFormData({...formData, endHour: e.target.value})}
                min="0"
                max="23"
                placeholder="HH"
              />
              <span className="time-separator">:</span>
              <input
                type="number"
                className="form-input"
                value={formData.endMinute}
                onChange={(e) => setFormData({...formData, endMinute: e.target.value})}
                min="0"
                max="59"
                placeholder="MM"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Interval objavljivanja:</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="number"
                className="form-input"
                value={formData.interval}
                onChange={(e) => setFormData({...formData, interval: e.target.value})}
                min="1"
                max="1440"
                style={{ width: '100px' }}
              />
              <span>minuta</span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Vrijeme zadnje objave:</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="date"
                className="form-input"
                value={formData.scheduledDate}
                onChange={(e) => setFormData({...formData, scheduledDate: e.target.value})}
                required
              />
              <input
                type="time"
                className="form-input"
                value={formData.scheduledTime}
                onChange={(e) => setFormData({...formData, scheduledTime: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="modal-actions">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Zakazivanje...' : 'Sačuvaj promjene'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleModal;
