# backend/main.py
from app import create_app

app = create_app()

if __name__ == '__main__':
    # Port 5001 is used to avoid conflict with Next.js default port 3000
    app.run(debug=True, port=5001)