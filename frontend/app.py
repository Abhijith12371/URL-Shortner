from flask import Flask, request, jsonify, redirect
from flask_cors import CORS
import validators
import os
import string
import random
from datetime import datetime
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Flask app with CORS
app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', os.urandom(24))

# MongoDB setup
mongo_uri = os.getenv('MONGO_URI', 'mongodb://localhost:27017/')
client = MongoClient(mongo_uri, connectTimeoutMS=30000, serverSelectionTimeoutMS=30000)
db = client.url_shortener
urls_collection = db.urls

# Create indexes
urls_collection.create_index('short_code', unique=True)
urls_collection.create_index('original_url')

def generate_short_code(length=6):
    """Generate a random short code"""
    chars = string.ascii_letters + string.digits
    return ''.join(random.choice(chars) for _ in range(length))

def is_valid_custom_code(code):
    """Validate custom short code"""
    if not code:
        return False
    if len(code) > 20:
        return False
    # Only allow letters, numbers, and hyphens/underscores
    return all(c.isalnum() or c in ('-', '_') for c in code)

@app.route('/shorten', methods=['POST'])
def shorten_url():
    if not request.is_json:
        return jsonify({'error': 'Request must be JSON'}), 400
        
    data = request.get_json()
    original_url = data.get('url', '').strip()
    custom_code = data.get('custom_code', '').strip()
    
    if not original_url:
        return jsonify({'error': 'URL is required'}), 400
    
    if not validators.url(original_url):
        return jsonify({'error': 'Invalid URL format'}), 400
    
    # Handle custom code if provided
    if custom_code:
        if not is_valid_custom_code(custom_code):
            return jsonify({
                'error': 'Custom code can only contain letters, numbers, hyphens and underscores (max 20 chars)'
            }), 400
        
        # Check if custom code already exists
        existing = urls_collection.find_one({'short_code': custom_code})
        if existing:
            return jsonify({
                'error': 'This custom URL is already taken'
            }), 400
        
        short_code = custom_code
    else:
        # Generate random code if no custom code provided
        short_code = generate_short_code()
        while urls_collection.find_one({'short_code': short_code}):
            short_code = generate_short_code()
    
    # Insert new record
    urls_collection.insert_one({
        'original_url': original_url,
        'short_code': short_code,
        'visits': 0,
        'created_at': datetime.utcnow(),
        'last_accessed': None,
        'is_custom': bool(custom_code)  # Track if this was a custom URL
    })
    
    return jsonify({
        'original_url': original_url,
        'short_url': f"{request.host_url}{short_code}",
        'short_code': short_code,
        'status': 'created',
        'is_custom': bool(custom_code)
    })

@app.route('/<short_code>')
def redirect_short_url(short_code):
    url = urls_collection.find_one_and_update(
        {'short_code': short_code},
        {'$inc': {'visits': 1}, '$set': {'last_accessed': datetime.utcnow()}},
        return_document=True
    )
    
    if not url:
        return jsonify({'error': 'URL not found'}), 404
    return redirect(url['original_url'])

@app.route('/api/recent', methods=['GET'])
def recent_urls():
    recent = urls_collection.find().sort('created_at', -1).limit(5)
    return jsonify([{
        'original_url': u['original_url'],
        'short_url': f"{request.host_url}{u['short_code']}",
        'short_code': u['short_code'],
        'visits': u['visits'],
        'created_at': u['created_at'].isoformat(),
        'last_accessed': u.get('last_accessed', '').isoformat() if u.get('last_accessed') else None,
        'is_custom': u.get('is_custom', False)
    } for u in recent])

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)