export default async function (req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        const { to, message } = req.body;
        
        if (!to || !message) {
            return res.status(400).json({ error: 'Missing parameters' });
        }
        
        const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
        if (!token) {
            return res.status(500).json({ error: 'Token not configured' });
        }
        
        const response = await fetch('https://api.line.me/v2/bot/message/push', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ to, messages: [{ type: 'text', text: message }] })
        });
        
        const result = await response.text();
        
        if (response.ok) {
            return res.status(200).json({ success: true, result });
        } else {
            return res.status(response.status).json({ success: false, error: result });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}