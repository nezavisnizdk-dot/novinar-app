import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { articlesAPI, rssAPI } from '../utils/api';
import { 
  FaHome, FaPen, FaChartBar, FaRedo, FaBell, FaImage,
  FaSignOutAlt, FaFacebook, FaWordpress, FaGlobe, 
  FaPaperPlane, FaClock
} from 'react-icons/fa';
import ArticlesList from './ArticlesList';
import ScheduleModal from './ScheduleModal';
import ConnectionModal from './ConnectionModal';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [articles, setArticles] = useState([]);
  const [counts, setCounts] = useState({});
  const [feeds, setFeeds] = useState([]);
  const [selectedFeed, setSelectedFeed] = useState('all');
  const [activeTab, setActiveTab] = useState('neobjavljeno');
  const [loading, setLoading] = useState(true);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [connectionType, setConnectionType] = useState(null);

  useEffect(() => {
    loadData();
    loadFeeds();
  }, []);

  useEffect(() => {
    loadArticles();
  }, [activeTab]);

  const loadData = async () => {
    await loadArticles();
  };

  const loadArticles = async () => {
    try {
      const response = await articlesAPI.getArticles(activeTab);
      setArticles(response.data.articles);
      setCounts(response.data.counts);
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFeeds = async () => {
    try {
      const response = await rssAPI.getFeeds();
      setFeeds(response.data.feeds);
    } catch (error) {
      console.error('Error loading feeds:', error);
    }
  };

  const handleFetchAll = async () => {
    setLoading(true);
    try {
      const response = await rssAPI.fetchAll();
      alert(`Dohvaćeno ${response.data.totalNew} novih članaka!`);
      loadArticles();
    } catch (error) {
      alert('Greška pri dohvaćanju članaka');
    } finally {
      setLoading(false);
    }
  };

  const handleSchedule = (article) => {
    setSelectedArticle(article);
    setShowScheduleModal(true);
  };

  const openConnectionModal = (type) => {
    setConnectionType(type);
    setShowConnectionModal(true);
  };

  const tabs = [
    { id: 'neobjavljeno', label: 'Neobjavljeno', icon: '📧' },
    { id: 'obrada', label: 'Obrada', icon: '⚙️' },
    { id: 'za_zakazivanje', label: 'Za zakazivanje', icon: '📅' },
    { id: 'ceka_facebook', label: 'Čeka Facebook', icon: '⏸' },
    { id: 'objavljeno', label: 'Objavljeno', icon: '✅' },
    { id: 'neuspjesno', label: 'Neuspješno', icon: '❌' }
  ];

  return (
    <div>
      {/* Header */}
      <header className="app-header">
        <div className="header-icons">
          <button className="header-icon" title="Početna">
            <FaHome />
          </button>
          <button className="header-icon" title="Uredi">
            <FaPen />
          </button>
          <button className="header-icon" title="Statistika">
            <FaChartBar />
          </button>
          <button className="header-icon" onClick={handleFetchAll} title="Osvježi">
            <FaRedo />
          </button>
          <button className="header-icon" title="Notifikacije">
            <FaBell />
          </button>
          <button className="header-icon" title="Slike">
            <FaImage />
          </button>
        </div>

        <div className="header-right">
          <div className="user-info">
            <span>{user?.username}</span>
          </div>
          
          <div className="connection-status">
            <button 
              className={`connection-btn ${user?.facebookConnected ? 'connected' : ''}`}
              onClick={() => openConnectionModal('facebook')}
              title="Facebook"
            >
              <FaFacebook />
            </button>
            <button 
              className={`connection-btn ${user?.wordpressConnected ? 'connected' : ''}`}
              onClick={() => openConnectionModal('wordpress')}
              title="WordPress"
            >
              <FaWordpress />
            </button>
          </div>

          <button className="header-icon" onClick={logout} title="Odjavi se">
            <FaSignOutAlt />
          </button>
        </div>
      </header>

      {/* Source Selector */}
      <div className="source-selector">
        <div className="source-dropdown">
          <select 
            value={selectedFeed}
            onChange={(e) => setSelectedFeed(e.target.value)}
          >
            <option value="all">Svi izvori</option>
            {feeds.map(feed => (
              <option key={feed._id} value={feed._id}>
                {feed.name}
              </option>
            ))}
          </select>

          <div className="source-actions">
            <button className="btn-icon" onClick={handleFetchAll}>
              <FaRedo /> Osvježi
            </button>
          </div>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="status-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span>{tab.icon}</span>
            {tab.label}
            <span className="tab-count">
              ({counts[tab.id] || 0})
            </span>
          </button>
        ))}
      </div>

      {/* Articles List */}
      <div className="articles-container">
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Učitavanje...</p>
          </div>
        ) : (
          <ArticlesList 
            articles={articles}
            onSchedule={handleSchedule}
            onRefresh={loadArticles}
          />
        )}
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && selectedArticle && (
        <ScheduleModal
          article={selectedArticle}
          onClose={() => {
            setShowScheduleModal(false);
            setSelectedArticle(null);
          }}
          onSuccess={loadArticles}
        />
      )}

      {/* Connection Modal */}
      {showConnectionModal && (
        <ConnectionModal
          type={connectionType}
          onClose={() => {
            setShowConnectionModal(false);
            setConnectionType(null);
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
