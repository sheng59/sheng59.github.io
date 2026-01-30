// api/send-line-message.js
export default async function (req, res) {
    // 設定 CORS headers（避免跨域問題）
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // 處理預檢請求 (OPTIONS)
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    // 只允許 POST 請求
    if (req.method !== 'POST') {
        return res.status(405).json({ 
            error: 'Method not allowed. Use POST only.' 
        });
    }
    
    let body = {};
    
    try {
        // 手動解析 request body
        if (typeof req.body === 'string') {
            // 如果 body 是字串，嘗試解析 JSON
            if (req.body.trim() === '') {
                body = {};
            } else {
                body = JSON.parse(req.body);
            }
        } else if (typeof req.body === 'object' && req.body !== null) {
            // 如果 body 已經是物件
            body = req.body;
        } else {
            // 其他情況
            body = {};
        }
    } catch (parseError) {
        console.error('JSON parsing error:', parseError);
        return res.status(400).json({ 
            error: 'Invalid JSON in request body',
            details: parseError.message
        });
    }
    
    // 驗證必要參數
    const { to, message } = body;
    
    if (!to || !message) {
        return res.status(400).json({ 
            error: 'Missing required parameters: to, message' 
        });
    }
    
    // 從環境變數讀取 LINE Channel Access Token
    const channelAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
    
    if (!channelAccessToken) {
        console.error('LINE_CHANNEL_ACCESS_TOKEN is not configured');
        return res.status(500).json({ 
            error: 'Server configuration error: Missing LINE token' 
        });
    }
    
    try {
        // 發送 LINE Push Message
        const lineResponse = await fetch('https://api.line.me/v2/bot/message/push', {
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
        
        const lineResult = await lineResponse.text();
        
        if (lineResponse.ok) {
            console.log('LINE message sent successfully');
            return res.status(200).json({ 
                success: true, 
                message: 'Message sent successfully' 
            });
        } else {
            console.error('LINE API error:', lineResult);
            return res.status(lineResponse.status).json({ 
                success: false, 
                error: 'Failed to send message to LINE API',
                details: lineResult
            });
        }
        
    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ 
            success: false, 
            error: 'Internal server error',
            details: error.message
        });
    }
}