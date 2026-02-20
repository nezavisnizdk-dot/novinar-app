import React, { useState } from 'react';
import { authAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const ConnectionModal = ({ type, onClose }) => {
  const { user, refreshUser } = useAuth();
  const [formData, setFormData] = useState({
    // Facebook
    accessToken: '',
    pageId: '',
    // WordPress
    siteUrl: '',
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleConnect = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (type === 'facebook') {
        await authAPI.connectFacebook(formData.accessToken, formData.pageId);
        setSuccess('Facebook uspješno povezan!');
      } else {
        await authAPI.connectWordPress(formData.siteUrl, formData.username, formData.password);
        setSuccess('WordPress uspješno povezan!');
      }
      
      await refreshUser();
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Greška pri povezivanju');
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setLoading(true);
    setError('');

    try {
      if (type === 'facebook') {
        await authAPI.disconnectFacebook();
      } else {
        await authAPI.disconnectWordPress();
      }
      
      await refreshUser();
      onClose();
    } catch (err) {
      setError('Greška pri isključivanju');
    } finally {
      setLoading(false);
    }
  };

  const isConnected = type === 'facebook' ? user?.facebookConnected : user?.wordpressConnected;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <h2 className="modal-title">
          {type === 'facebook' ? 'Facebook Integracija' : 'WordPress Integracija'}
        </h2>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {isConnected ? (
          <div>
            <p style={{ marginBottom: '20px', color: '#28a745' }}>
              ✅ {type === 'facebook' ? 'Facebook' : 'WordPress'} je povezan
            </p>
            <button 
              onClick={handleDisconnect}
              className="btn btn-secondary"
              disabled={loading}
            >
              {loading ? 'Isključivanje...' : 'Isključi'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleConnect}>
            {type === 'facebook' ? (
              <>
                <div className="form-group">
                  <label className="form-label">Facebook Page Access Token</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.accessToken}
                    onChange={(e) => setFormData({...formData, accessToken: e.target.value})}
                    placeholder="Paste your Page Access Token"
                    required
                  />
                  <small style={{ color: '#6c757d', fontSize: '12px' }}>
                    Dobijte token sa: Facebook Developers → Graph API Explorer
                  </small>
                </div>

                <div className="form-group">
                  <label className="form-label">Facebook Page ID</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.pageId}
                    onChange={(e) => setFormData({...formData, pageId: e.target.value})}
                    placeholder="Your Page ID"
                    required
                  />
                </div>
              </>
            ) : (
              <>
                <div className="form-group">
                  <label className="form-label">WordPress Site URL</label>
                  <input
                    type="url"
                    className="form-input"
                    value={formData.siteUrl}
                    onChange={(e) => setFormData({...formData, siteUrl: e.target.value})}
                    placeholder="https://yoursite.wordpress.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Username</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Password / Application Password</label>
                  <input
                    type="password"
                    className="form-input"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                  />
                  <small style={{ color: '#6c757d', fontSize: '12px' }}>
                    NAPOMENA: WordPress.com free plan ne podržava API. Koristite copy-paste metodu.
                  </small>
                </div>
              </>
            )}

            <div className="modal-actions">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Povezivanje...' : 'Poveži'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ConnectionModal;
