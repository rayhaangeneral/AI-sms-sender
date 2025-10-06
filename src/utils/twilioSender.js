// Twilio SMS Sender
// Note: In a production environment with a backend, you would call Twilio from the server.
// Since this is a client-side only app, we'll use Twilio's REST API directly.

export const sendSMS = async (twilioConfig, toPhoneNumber, messageContent) => {
  const { accountSid, authToken, phoneNumber: fromPhoneNumber } = twilioConfig;
  
  if (!accountSid || !authToken || !fromPhoneNumber) {
    throw new Error('Twilio credentials not configured');
  }
  
  // Create Basic Auth header
  const credentials = btoa(`${accountSid}:${authToken}`);
  
  // Twilio API endpoint
  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
  
  // Prepare form data
  const formData = new URLSearchParams();
  formData.append('To', toPhoneNumber);
  formData.append('From', fromPhoneNumber);
  formData.append('Body', messageContent);
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData.toString()
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Twilio API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    return {
      success: true,
      messageSid: data.sid,
      status: data.status
    };
  } catch (error) {
    console.error('SMS sending error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
