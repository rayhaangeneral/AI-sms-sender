import { useState } from 'react';
import { MessageSquare, Users, History, Settings, Send, LogOut } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';
import MyAgents from './components/MyAgents';
import MessageHistory from './components/MessageHistory';
import SettingsPage from './components/SettingsPage';
import CampaignProgress from './components/CampaignProgress';

function App() {
  const { user, loading, signOut } = useAuth();
  const [showLogin, setShowLogin] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');
  const [activeCampaign, setActiveCampaign] = useState(null);

  const navigation = [
    { id: 'home', name: 'Home', icon: Send },
    { id: 'agents', name: 'My Agents', icon: Users },
    { id: 'history', name: 'Message History', icon: History },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      await signOut();
      setCurrentPage('home');
      setActiveCampaign(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleStartCampaign = (campaignData) => {
    setActiveCampaign(campaignData);
    setCurrentPage('campaign');
  };

  const handleCampaignComplete = () => {
    setActiveCampaign(null);
    setCurrentPage('history');
  };

  const renderPage = () => {
    if (currentPage === 'campaign' && activeCampaign) {
      return <CampaignProgress campaign={activeCampaign} onComplete={handleCampaignComplete} />;
    }

    switch (currentPage) {
      case 'home':
        return <Home onStartCampaign={handleStartCampaign} />;
      case 'agents':
        return <MyAgents />;
      case 'history':
        return <MessageHistory />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <Home onStartCampaign={handleStartCampaign} />;
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth pages if not logged in
  if (!user) {
    if (showLogin) {
      return <Login onSwitchToSignup={() => setShowLogin(false)} />;
    } else {
      return <Signup onSwitchToLogin={() => setShowLogin(true)} />;
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-primary" />
              <h1 className="text-2xl font-bold text-gray-900">AI SMS Agent</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{user.email}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  disabled={currentPage === 'campaign'}
                  className={`
                    flex items-center gap-2 px-3 py-4 text-sm font-medium border-b-2 transition-colors
                    ${isActive
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                    ${currentPage === 'campaign' ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
