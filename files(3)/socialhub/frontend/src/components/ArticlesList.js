import React, { useState } from 'react';
import { FaGlobe, FaPaperPlane, FaEye } from 'react-icons/fa';
import { format } from 'date-fns';
import ContentPreviewModal from './ContentPreviewModal';

const ArticlesList = ({ articles, onSchedule, onRefresh }) => {
  const [previewArticle, setPreviewArticle] = useState(null);
  
  const getStatusClass = (status) => {
    const map = {
      'neobjavljeno': 'status-pending',
      'obrada': 'status-obrada',
      'za_zakazivanje': 'status-pending',
      'ceka_facebook': 'status-pending',
      'objavljeno': 'status-objavljeno',
      'neuspjesno': 'status-neuspjesno'
    };
    return map[status] || 'status-pending';
  };

  const getStatusIcon = (status) => {
    const map = {
      'neobjavljeno': '⭕',
      'obrada': '⚙️',
      'za_zakazivanje': '📅',
      'ceka_facebook': '⏸',
      'objavljeno': '✅',
      'neuspjesno': '❌'
    };
    return map[status] || '⭕';
  };

  const groupByDate = (articles) => {
    const groups = {};
    
    articles.forEach(article => {
      const date = new Date(article.createdAt).toLocaleDateString('bs-BA');
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(article);
    });

    return groups;
  };

  const grouped = groupByDate(articles);

  if (articles.length === 0) {
    return (
      <div className="empty-state">
        <h3>Nema članaka</h3>
        <p>Nema članaka u ovoj kategoriji. Dohvatite nove članke ili provjerite druge kategorije.</p>
      </div>
    );
  }

  return (
    <div>
      {Object.entries(grouped).map(([date, dateArticles]) => (
        <div key={date}>
          <div className="date-header">
            Danas: {date} • Zadnji članak: {new Date(dateArticles[0].createdAt).toLocaleTimeString('bs-BA', { hour: '2-digit', minute: '2-digit' })}
          </div>

          <div className="articles-list">
            {dateArticles.map(article => (
              <div key={article._id} className="article-card">
                <div className={`article-status-icon ${getStatusClass(article.status)}`}>
                  {getStatusIcon(article.status)}
                </div>

                <div className="article-content">
                  <div className="article-title">{article.title}</div>
                  <div className="article-meta">
                    {article.isNew && (
                      <span className="badge badge-novo">NOVO</span>
                    )}
                    <span className="badge badge-pending">PENDING</span>
                    <span>{article.sourceName}</span>
                  </div>
                </div>

                <div className="article-actions">
                  <button 
                    className="action-btn"
                    onClick={() => setPreviewArticle(article)}
                    title="Pregledaj sadržaj"
                  >
                    <FaEye />
                  </button>
                  <button 
                    className="action-btn"
                    onClick={() => window.open(article.link, '_blank')}
                    title="Otvori original"
                  >
                    <FaGlobe />
                  </button>
                  <button 
                    className="action-btn primary"
                    onClick={() => onSchedule(article)}
                    title="Zakaži objavu"
                  >
                    <FaPaperPlane />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Content Preview Modal */}
      {previewArticle && (
        <ContentPreviewModal
          article={previewArticle}
          onClose={() => setPreviewArticle(null)}
        />
      )}
    </div>
  );
};

export default ArticlesList;
