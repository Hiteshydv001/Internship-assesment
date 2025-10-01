# backend/app/api/summarizer.py
from flask import Blueprint, request, Response
from app.core.agents import get_summarizer_chain
import time

summarizer_bp = Blueprint('summarizer', __name__)
summarizer_chain = get_summarizer_chain()

@summarizer_bp.route('/api/summarize', methods=['POST'])
def summarize_text():
    data = request.get_json()
    if not data or 'text' not in data:
        return Response('{"error": "Missing \'text\' in request body"}', status=400, mimetype='application/json')

    text = data['text']

    def generate():
        try:
            # Try streaming first
            stream_worked = False
            for chunk in summarizer_chain.stream({"text": text}):
                if hasattr(chunk, 'content') and chunk.content:
                    stream_worked = True
                    # Send character by character for streaming effect
                    content = chunk.content
                    for char in content:
                        yield char
                        time.sleep(0.01)  # 10ms delay for visible streaming
            
            # If no streaming chunks were received, fall back to regular invoke
            if not stream_worked:
                result = summarizer_chain.invoke({"text": text})
                if hasattr(result, 'content'):
                    content = result.content
                else:
                    content = str(result)
                
                # Stream character by character even for non-streaming response
                for char in content:
                    yield char
                    time.sleep(0.01)  # 10ms delay for visible streaming
                    
        except Exception as e:
            error_msg = f"Error: An error occurred during streaming: {str(e)}"
            for char in error_msg:
                yield char
    
    return Response(generate(), 
                   mimetype='text/plain',
                   headers={
                       'Cache-Control': 'no-cache',
                       'Connection': 'keep-alive',
                       'Access-Control-Allow-Origin': '*',
                       'Access-Control-Allow-Headers': 'Content-Type'
                   })