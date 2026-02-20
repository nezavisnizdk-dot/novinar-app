import React, { useState } from 'react';
import { FaWordpress, FaFacebook, FaInstagram, FaCopy, FaCheck } from 'react-icons/fa';

const ContentPreviewModal = ({ article, onClose }) => {
  const [activeTab, setActiveTab] = useState('wordpress');
  const [copied, setCopied] = useState(null);

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const generateFacebookPost = () => {
    const content = article.cleanedContent || article.content;
    // Facebook limit je ~63,206 karaktera, ali koristimo 5000 za čitljivost
    const truncated = content.substring(0, 5000);
    return `${truncated}${content.length > 5000 ? '...' : ''}\n\nČitaj više: ${article.link}`;
  };

  const generateInstagramCaption = () => {
    // Instagram limit je 2,200 karaktera
    const title = article.title;
    const emoji = '📰';
    return `${emoji} ${title}\n\n#vijesti #${article.sourceName?.toLowerCase().replace(/\s/g, '')}`;
  };

  const tabs = [
    { id: 'wordpress', label: 'WordPress', icon: FaWordpress, color: '#21759b' },
    { id: 'facebook', label: 'Facebook', icon: FaFacebook, color: '#1877f2' },
    { id: 'instagram', label: 'Instagram', icon: FaInstagram, color: '#e4405f' }
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content preview-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <h2 className="modal-title">{article.title}</h2>

        {/* Tab Navigation */}
        <div className="preview-tabs">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`preview-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
                style={activeTab === tab.id ? { borderBottomColor: tab.color, color: tab.color } : {}}
              >
                <Icon /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="preview-content">
          {activeTab === 'wordpress' && (
            <div className="preview-section">
              <div className="preview-header">
                <h3>WordPress - Očišćen Tekst</h3>
                <button 
                  className="copy-btn"
                  onClick={() => copyToClipboard(article.cleanedContent || article.content, 'wordpress')}
                >
                  {copied === 'wordpress' ? (
                    <>
                      <FaCheck style={{ color: '#28a745' }} /> Kopirano!
                    </>
                  ) : (
                    <>
                      <FaCopy /> Kopiraj
                    </>
                  )}
                </button>
              </div>

              <div className="preview-box">
                <p className="preview-text">
                  {article.cleanedContent || article.content}
                </p>
              </div>

              <div className="preview-info">
                <small>
                  <strong>Dužina:</strong> {(article.cleanedContent || article.content).length} karaktera
                  <br />
                  <strong>Riječi:</strong> ~{Math.round((article.cleanedContent || article.content).split(' ').length)}
                </small>
              </div>

              <div className="preview-instructions">
                <p><strong>Koraci:</strong></p>
                <ol>
                  <li>Klikni "Kopiraj" dugme</li>
                  <li>Idi na svoj WordPress.com admin panel</li>
                  <li>Posts → Add New</li>
                  <li>Paste tekst u editor</li>
                  <li>Dodaj Featured Image (optional)</li>
                  <li>Publish!</li>
                </ol>
              </div>
            </div>
          )}

          {activeTab === 'facebook' && (
            <div className="preview-section">
              <div className="preview-header">
                <h3>Facebook Post</h3>
                <button 
                  className="copy-btn"
                  onClick={() => copyToClipboard(generateFacebookPost(), 'facebook')}
                >
                  {copied === 'facebook' ? (
                    <>
                      <FaCheck style={{ color: '#28a745' }} /> Kopirano!
                    </>
                  ) : (
                    <>
                      <FaCopy /> Kopiraj
                    </>
                  )}
                </button>
              </div>

              <div className="preview-box facebook-preview">
                <div className="fb-post-header">
                  <div className="fb-avatar"></div>
                  <div>
                    <div className="fb-page-name">Vaša Stranica</div>
                    <div className="fb-time">Upravo sad</div>
                  </div>
                </div>
                
                <p className="preview-text">
                  {generateFacebookPost()}
                </p>

                {article.images && article.images[0] && (
                  <div className="fb-image-placeholder">
                    <img src={article.images[0]} alt="Preview" style={{ maxWidth: '100%', borderRadius: '8px' }} />
                  </div>
                )}
              </div>

              <div className="preview-info">
                <small>
                  <strong>Dužina:</strong> {generateFacebookPost().length} karaktera (max 63,206)
                  <br />
                  <strong>Link:</strong> Automatski dodat na kraj
                </small>
              </div>
            </div>
          )}

          {activeTab === 'instagram' && (
            <div className="preview-section">
              <div className="preview-header">
                <h3>Instagram Caption</h3>
                <button 
                  className="copy-btn"
                  onClick={() => copyToClipboard(generateInstagramCaption(), 'instagram')}
                >
                  {copied === 'instagram' ? (
                    <>
                      <FaCheck style={{ color: '#28a745' }} /> Kopirano!
                    </>
                  ) : (
                    <>
                      <FaCopy /> Kopiraj
                    </>
                  )}
                </button>
              </div>

              <div className="preview-box instagram-preview">
                <div className="ig-post-header">
                  <div className="ig-avatar"></div>
                  <div>
                    <div className="ig-username">vaš_account</div>
                  </div>
                </div>

                {article.images && article.images[0] && (
                  <div className="ig-image-placeholder">
                    <img src={article.images[0]} alt="Preview" style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover' }} />
                  </div>
                )}

                <p className="preview-text" style={{ marginTop: '12px' }}>
                  {generateInstagramCaption()}
                </p>
              </div>

              <div className="preview-info">
                <small>
                  <strong>Dužina:</strong> {generateInstagramCaption().length} karaktera (max 2,200)
                  <br />
                  <strong>Napomena:</strong> Instagram zahtijeva sliku - objavi preko mobilne aplikacije
                </small>
              </div>

              <div className="preview-instructions">
                <p><strong>Koraci:</strong></p>
                <ol>
                  <li>Klikni "Kopiraj" dugme</li>
                  <li>Otvori Instagram app na mobitelu</li>
                  <li>+ → Post</li>
                  <li>Odaberi sliku (download sa {article.link})</li>
                  <li>Paste caption</li>
                  <li>Share!</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        <div className="preview-footer">
          <a href={article.link} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
            Otvori Original Članak
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContentPreviewModal;
