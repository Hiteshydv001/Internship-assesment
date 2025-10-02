# backend/app/__init__.py
from flask import Flask, jsonify
from flask_cors import CORS
from config import Config

def create_app():
    """Create and configure an instance of the Flask application."""
    app = Flask(__name__)
    
    # Load configuration from config.py
    app.config.from_object(Config)
    
    # Enable CORS to allow all origins (for development and production)
    # In production, consider restricting to specific domains
    CORS(app, resources={
        r"/api/*": {
            "origins": "*",  # Allow all origins
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization", "X-Requested-With"],
            "expose_headers": ["Content-Type", "X-Session-ID"],
            "supports_credentials": False,  # Set to False when using origins: "*"
            "max_age": 3600
        }
    })

    # Import and register blueprints for each feature
    from .api.qna import qna_bp
    from .api.summarizer import summarizer_bp
    from .api.tracker import tracker_bp
    
    app.register_blueprint(qna_bp)
    app.register_blueprint(summarizer_bp)
    app.register_blueprint(tracker_bp)

    # A simple route to check if the API is up and running
    @app.route('/api/health')
    def health_check():
        return jsonify({"status": "ok"})

    return app