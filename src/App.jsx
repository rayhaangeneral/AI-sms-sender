import { useState } from 'react';
import { MessageSquare, Users, History, Settings, Send } from 'lucide-react';
import Home from './components/Home';
import MyAgents from './components/MyAgents';
import MessageHistory from './components/MessageHistory';
import SettingsPage from './components/SettingsPage';
import CampaignProgress from './components/CampaignProgress';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [activeCampaign, setActiveCampaign] = useState(null);

  const navigation = [
    { id: 'home', name: 'Home', icon: Send },
    { id: 'agents', name: 'My Agents', icon: Users },
    { id: 'history', name: 'Message History', icon: History },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold text-gray-900">AI SMS Agent</h1>
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
