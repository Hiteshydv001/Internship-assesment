# Dockerfile for Railway deployment - builds backend Flask app
FROM python:3.11-slim

WORKDIR /app

# Environment configuration
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=5001

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy entire backend directory
COPY backend/ /app/

# Install Python packages
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r /app/requirements.txt

# Expose application port
EXPOSE 5001

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:5001/api/health || exit 1

# Start the Flask application with gunicorn
CMD ["gunicorn", "main:app", "--bind", "0.0.0.0:5001", "--workers", "2", "--timeout", "120", "--log-level", "info", "--access-logfile", "-", "--error-logfile", "-"]
