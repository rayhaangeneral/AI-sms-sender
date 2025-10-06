import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Users, FileText } from 'lucide-react';
import { getAgents, deleteAgent } from '../utils/storage';
import AgentEditor from './AgentEditor';

function MyAgents() {
  const [agents, setAgents] = useState([]);
  const [editingAgent, setEditingAgent] = useState(null);
  const [showEditor, setShowEditor] = useState(false);

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = () => {
    setAgents(getAgents());
  };

  const handleCreateNew = () => {
    setEditingAgent(null);
    setShowEditor(true);
  };

  const handleEdit = (agent) => {
    setEditingAgent(agent);
    setShowEditor(true);
  };

  const handleDelete = (agentId) => {
    if (confirm('Are you sure you want to delete this agent template?')) {
      deleteAgent(agentId);
      loadAgents();
    }
  };

  const handleSaveComplete = () => {
    setShowEditor(false);
    setEditingAgent(null);
    loadAgents();
  };

  if (showEditor) {
    return (
      <AgentEditor
        agent={editingAgent}
        onSave={handleSaveComplete}
        onCancel={() => setShowEditor(false)}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold text-gray-900">My Agents</h2>
        </div>
        <button
          onClick={handleCreateNew}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
        >
          <Plus className="w-4 h-4" />
          Create New Agent
        </button>
      </div>

      {agents.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No agents yet</h3>
          <p className="text-gray-600 mb-6">
            Create your first AI agent template to get started with campaigns
          </p>
          <button
            onClick={handleCreateNew}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            Create Your First Agent
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {agent.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded">
                      {agent.provider}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded">
                      {agent.persona}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="text-sm">
                  <span className="text-gray-600">Model:</span>{' '}
                  <span className="font-medium text-gray-900">{agent.model}</span>
                </div>
                {agent.documents && agent.documents.length > 0 && (
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <FileText className="w-4 h-4" />
                    <span>{agent.documents.length} document(s)</span>
                  </div>
                )}
                <p className="text-sm text-gray-600 line-clamp-2">
                  {agent.messagePrompt}
                </p>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <button
                  onClick={() => handleEdit(agent)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(agent.id)}
                  className="flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyAgents;
