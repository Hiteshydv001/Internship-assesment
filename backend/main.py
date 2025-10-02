# backend/main.py
import os
from app import create_app

app = create_app()

if __name__ == '__main__':
    # Render provides the PORT environment variable.
    # We fall back to 5001 for local development.
    port = int(os.environ.get("PORT", 5001))
    
    # In production, Gunicorn (from render.yaml) will run the app.
    # This app.run() is only for local execution.
    # The host '0.0.0.0' is required for it to be accessible inside Render's container.
    app.run(debug=False, host='0.0.0.0', port=port)