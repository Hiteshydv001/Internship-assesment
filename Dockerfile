# Dockerfile at root - points to backend
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=5001

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy all backend files first
COPY backend/ /app/

# Install Python dependencies
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r /app/requirements.txt

# Expose port
EXPOSE 5001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:5001/api/health || exit 1

# Start gunicorn
CMD ["gunicorn", "main:app", "--bind", "0.0.0.0:5001", "--workers", "2", "--timeout", "120", "--log-level", "info", "--access-logfile", "-", "--error-logfile", "-"]
