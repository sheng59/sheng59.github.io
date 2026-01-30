export default async function handler(req, res) {
    // 只允許 POST 請求
    if (req.method !== 'POST') {
        return res.status(405).json({ 
            error: 'Method not allowed. Use POST only.' 
        });
    }
    
    try {
        const { to, message } = req.body;
        
        // 驗證必要參數
        if (!to || !message) {
            return res.status(400).json({ 
                error: 'Missing required parameters: to, message' 
            });
        }
        
        // 🔑 從環境變數讀取 Token（不會暴露給前端）
        const channelAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
        
        if (!channelAccessToken) {
            console.error('LINE_CHANNEL_ACCESS_TOKEN is not configured');
            return res.status(500).json({ 
                error: 'Server configuration error' 
            });
        }
        
        // 發送 LINE Push Message
        const response = await fetch('https://api.line.me/v2/bot/message/push', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${channelAccessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                to: to,
                messages: [{
                    type: 'text',
                    text: message
                }]
            })
        });
        
        const result = await response.text();
        
        if (response.ok) {
            console.log('LINE message sent successfully');
            return res.status(200).json({ 
                success: true, 
                message: 'Message sent successfully' 
            });
        } else {
            console.error('LINE API error:', result);
            return res.status(response.status).json({ 
                success: false, 
                error: 'Failed to send message' 
            });
        }
        
    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ 
            success: false, 
            error: 'Internal server error' 
        });
    }
}