import { useState, useEffect, useRef } from 'react';
import { Loader2, CheckCircle, XCircle, Clock, MessageSquare } from 'lucide-react';
import { generateMessage } from '../utils/aiProviders';
import { sendSMS } from '../utils/twilioSender';
import { saveMessage } from '../utils/storage';

function CampaignProgress({ campaign, onComplete }) {
  const [phoneStatuses, setPhoneStatuses] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const processingRef = useRef(false); // Prevent double execution

  useEffect(() => {
    // Initialize phone statuses
    const initialStatuses = campaign.phoneNumbers.map(number => ({
      phoneNumber: number,
      status: 'queued',
      message: '',
      error: null
    }));
    setPhoneStatuses(initialStatuses);
  }, [campaign.phoneNumbers]);

  useEffect(() => {
    if (!isRunning || currentIndex >= campaign.phoneNumbers.length || processingRef.current) {
      if (currentIndex >= campaign.phoneNumbers.length && !processingRef.current) {
        setIsRunning(false);
        setTimeout(() => {
          onComplete();
        }, 2000);
      }
      return;
    }

    const processNextNumber = async () => {
      // Prevent double execution
      if (processingRef.current) return;
      processingRef.current = true;
      const phoneNumber = campaign.phoneNumbers[currentIndex];
      
      // Update status to processing
      setPhoneStatuses(prev => {
        const updated = [...prev];
        updated[currentIndex] = { ...updated[currentIndex], status: 'processing' };
        return updated;
      });

      try {
        // Generate AI message
        const message = await generateMessage(
          {
            provider: campaign.provider,
            model: campaign.model,
            messagePrompt: campaign.messagePrompt,
            persona: campaign.persona,
            documents: campaign.documents,
            apiKeys: campaign.apiKeys
          },
          phoneNumber,
          campaign.language
        );

        // Send SMS via Twilio
        const result = await sendSMS(
          campaign.apiKeys.twilio,
          phoneNumber,
          message
        );

        // Update status
        setPhoneStatuses(prev => {
          const updated = [...prev];
          updated[currentIndex] = {
            ...updated[currentIndex],
            status: result.success ? 'sent' : 'failed',
            message: message,
            error: result.error || null
          };
          return updated;
        });

        // Save to message history
        saveMessage({
          phoneNumber,
          message,
          status: result.success ? 'sent' : 'failed',
          error: result.error,
          provider: campaign.provider,
          model: campaign.model,
          language: campaign.language
        });

        // Wait a bit before processing next number (to avoid rate limits)
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        processingRef.current = false; // Reset flag
        setCurrentIndex(prev => prev + 1);
      } catch (error) {
        console.error('Error processing number:', error);
        
        setPhoneStatuses(prev => {
          const updated = [...prev];
          updated[currentIndex] = {
            ...updated[currentIndex],
            status: 'failed',
            error: error.message
          };
          return updated;
        });

        // Save failed message to history
        saveMessage({
          phoneNumber,
          message: '',
          status: 'failed',
          error: error.message,
          provider: campaign.provider,
          model: campaign.model,
          language: campaign.language
        });

        await new Promise(resolve => setTimeout(resolve, 1000));
        processingRef.current = false; // Reset flag
        setCurrentIndex(prev => prev + 1);
      }
    };

    processNextNumber();
  }, [currentIndex, isRunning, campaign, onComplete]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'queued':
        return <Clock className="w-5 h-5 text-gray-400" />;
      case 'processing':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'sent':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'queued':
        return 'Queued';
      case 'processing':
        return 'Processing...';
      case 'sent':
        return 'Sent';
      case 'failed':
        return 'Failed';
      default:
        return 'Queued';
    }
  };

  const sentCount = phoneStatuses.filter(p => p.status === 'sent').length;
  const failedCount = phoneStatuses.filter(p => p.status === 'failed').length;
  const totalCount = phoneStatuses.length;
  const progressPercentage = totalCount > 0 ? ((sentCount + failedCount) / totalCount) * 100 : 0;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center gap-3 mb-6">
          <MessageSquare className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold text-gray-900">Campaign in Progress</h2>
        </div>

        {/* Progress Summary */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Overall Progress</span>
            <span className="text-sm font-medium text-gray-900">
              {sentCount + failedCount} / {totalCount}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="flex gap-6 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-gray-700">Sent: <strong>{sentCount}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-500" />
              <span className="text-gray-700">Failed: <strong>{failedCount}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-gray-700">
                Pending: <strong>{totalCount - sentCount - failedCount}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Phone Numbers List */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Messages</h3>
          <div className="max-h-96 overflow-y-auto space-y-2">
            {phoneStatuses.map((item, index) => (
              <div
                key={index}
                className={`
                  flex items-start justify-between p-4 rounded-lg border transition-all
                  ${item.status === 'sent' ? 'bg-green-50 border-green-200' : ''}
                  ${item.status === 'failed' ? 'bg-red-50 border-red-200' : ''}
                  ${item.status === 'processing' ? 'bg-blue-50 border-blue-200' : ''}
                  ${item.status === 'queued' ? 'bg-gray-50 border-gray-200' : ''}
                `}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    {getStatusIcon(item.status)}
                    <span className="font-medium text-gray-900">{item.phoneNumber}</span>
                  </div>
                  <div className="ml-8">
                    <span className={`
                      text-sm font-medium
                      ${item.status === 'sent' ? 'text-green-700' : ''}
                      ${item.status === 'failed' ? 'text-red-700' : ''}
                      ${item.status === 'processing' ? 'text-blue-700' : ''}
                      ${item.status === 'queued' ? 'text-gray-600' : ''}
                    `}>
                      {getStatusText(item.status)}
                    </span>
                    {item.message && (
                      <p className="text-sm text-gray-600 mt-1 italic">
                        "{item.message}"
                      </p>
                    )}
                    {item.error && (
                      <p className="text-sm text-red-600 mt-1">
                        Error: {item.error}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Completion Message */}
        {!isRunning && currentIndex >= totalCount && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 font-medium text-center">
              Campaign completed! Redirecting to message history...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CampaignProgress;
