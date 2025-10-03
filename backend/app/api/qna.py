# backend/app/api/qna.py
from flask import Blueprint, request, Response
from app.core.agents import get_qna_chain
import time

qna_bp = Blueprint('qna', __name__)
qna_chain = get_qna_chain()

@qna_bp.route('/api/qna', methods=['POST'])
def ask_question():
    data = request.get_json()
    if not data or 'question' not in data:
        return Response('{"error": "Missing \'question\' in request body"}', status=400, mimetype='application/json')

    question = data['question']

    def generate():
        try:
            # Try streaming first
            stream_worked = False
            for chunk in qna_chain.stream(question):
                if hasattr(chunk, 'content') and chunk.content:
                    stream_worked = True
                    # Send character by character for ChatGPT-like streaming
                    content = chunk.content
                    # Send 1 character at a time for visible streaming effect
                    for char in content:
                        yield char
                        time.sleep(0.03)  # 30ms delay for slower, more readable streaming
            
            # If no streaming chunks were received, fall back to regular invoke
            if not stream_worked:
                result = qna_chain.invoke(question)
                if hasattr(result, 'content'):
                    content = result.content
                else:
                    content = str(result)
                
                # Stream character by character even for non-streaming response
                for char in content:
                    yield char
                    time.sleep(0.03)  # 30ms delay for slower, more readable streaming
                    
        except Exception as e:
            error_msg = f"Error: An error occurred during streaming: {str(e)}"
            for char in error_msg:
                yield char

    # Return a streaming response with proper headers
    return Response(generate(), 
                   mimetype='text/plain',
                   headers={
                       'Cache-Control': 'no-cache',
                       'Connection': 'keep-alive',
                       'Access-Control-Allow-Origin': '*',
                       'Access-Control-Allow-Headers': 'Content-Type'
                   })