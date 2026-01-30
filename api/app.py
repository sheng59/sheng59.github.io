from flask import Flask, request, jsonify
import requests
import os

app = Flask(__name__)

@app.route("/api/sendlinemessage", methods=['GET', 'POST'])
def send_line_message():
    if request.method == 'GET':
        return jsonify({"message": "test"})
    
    if request.method == 'POST':
        data = request.get_json()
        to = data.get('to')
        message = data.get('message')
        
        if not to or not message:
            return jsonify({"error": "Missing parameters"}), 400
        
        token = os.environ.get('LINE_CHANNEL_ACCESS_TOKEN')
        if not token:
            return jsonify({"error": "Token not configured"}), 500
        
        try:
            response = requests.post(
                'https://api.line.me/v2/bot/message/push',
                json={'to': to, 'messages': [{'type': 'text', 'text': message}]},
                headers={'Authorization': f'Bearer {token}'}
            )
            
            if response.status_code == 200:
                return jsonify({"success": True})
            else:
                return jsonify({"error": "LINE API failed"}), 500
                
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    
    return jsonify({"error": "Method not allowed"}), 405

# if __name__ == "__main__":
#     app.run(debug=True, host='0.0.0.0', port=5000)