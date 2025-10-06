import { useState, useEffect } from 'react';
import { History, Search, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { getMessageHistory, clearMessageHistory } from '../utils/storage';

function MessageHistory() {
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredMessages(messages);
    } else {
      const filtered = messages.filter(msg => 
        msg.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMessages(filtered);
    }
  }, [searchTerm, messages]);

  const loadMessages = () => {
    const history = getMessageHistory();
    setMessages(history);
    setFilteredMessages(history);
  };

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear all message history? This cannot be undone.')) {
      clearMessageHistory();
      loadMessages();
    }
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <History className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-gray-900">Message History</h2>
          </div>
          {messages.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Clear History
            </button>
          )}
        </div>

        {/* Search Bar */}
        {messages.length > 0 && (
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by phone number or message content..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
        )}

        {/* Messages List */}
        {filteredMessages.length === 0 ? (
          <div className="text-center py-12">
            <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {messages.length === 0 ? 'No messages yet' : 'No matching messages'}
            </h3>
            <p className="text-gray-600">
              {messages.length === 0 
                ? 'Start a campaign to see your message history here'
                : 'Try adjusting your search terms'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredMessages.map((msg) => (
              <div
                key={msg.id}
                className={`
                  border rounded-lg p-4 transition-all
                  ${msg.status === 'sent' 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                  }
                `}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {msg.status === 'sent' ? (
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="font-semibold text-gray-900">
                            {msg.phoneNumber}
                          </span>
                          <span className={`
                            px-2 py-1 text-xs font-medium rounded
                            ${msg.status === 'sent' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-red-100 text-red-700'
                            }
                          `}>
                            {msg.status === 'sent' ? 'Sent' : 'Failed'}
                          </span>
                          <span className="text-sm text-gray-600">
                            {formatDate(msg.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-8 space-y-2">
                      {msg.message && (
                        <div className="bg-white rounded p-3 border border-gray-200">
                          <p className="text-sm text-gray-900">{msg.message}</p>
                        </div>
                      )}
                      
                      {msg.error && (
                        <div className="bg-red-100 rounded p-3 border border-red-300">
                          <p className="text-sm text-red-800">
                            <strong>Error:</strong> {msg.error}
                          </p>
                        </div>
                      )}
                      
                      <div className="flex gap-4 text-xs text-gray-600">
                        <span>Provider: <strong>{msg.provider}</strong></span>
                        <span>Model: <strong>{msg.model}</strong></span>
                        <span>Language: <strong>{msg.language}</strong></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        {messages.length > 0 && (
          <div className="mt-6 pt-6 border-t">
            <div className="flex gap-8 text-sm">
              <div>
                <span className="text-gray-600">Total Messages:</span>{' '}
                <strong className="text-gray-900">{messages.length}</strong>
              </div>
              <div>
                <span className="text-gray-600">Sent:</span>{' '}
                <strong className="text-green-600">
                  {messages.filter(m => m.status === 'sent').length}
                </strong>
              </div>
              <div>
                <span className="text-gray-600">Failed:</span>{' '}
                <strong className="text-red-600">
                  {messages.filter(m => m.status === 'failed').length}
                </strong>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MessageHistory;
