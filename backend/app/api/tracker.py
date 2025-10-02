# backend/app/api/tracker.py
from flask import Blueprint, request, Response
from app.core.agents import get_expense_agent_executor
import uuid
import time

tracker_bp = Blueprint('tracker', __name__)

conversation_histories = {}

@tracker_bp.route('/api/tracker', methods=['POST'])
def handle_tracker_prompt():
    data = request.get_json()
    if not data or 'prompt' not in data:
        return Response('{"error": "Missing \'prompt\' in request body"}', status=400, mimetype='application/json')

    user_prompt = data['prompt']
    session_id = data.get('session_id') or str(uuid.uuid4())
    
    if session_id not in conversation_histories:
        conversation_histories[session_id] = []
    chat_history = conversation_histories[session_id]

    # Execute agent synchronously to avoid loops
    full_response = ""
    try:
        agent_executor = get_expense_agent_executor()
        
        # Use invoke instead of stream to get complete result
        result = agent_executor.invoke({
            "input": user_prompt,
            "chat_history": chat_history
        })
        
        # Extract the output
        if isinstance(result, dict):
            full_response = result.get("output") or result.get("result") or str(result)
        else:
            full_response = str(result)
        
        # Clean up any repeated content or verbose output
        if full_response and full_response.strip():
            # Remove excessive whitespace and repeated lines
            lines = [line.strip() for line in full_response.split('\n') if line.strip()]
            seen = set()
            unique_lines = []
            for line in lines:
                if line not in seen:
                    unique_lines.append(line)
                    seen.add(line)
            full_response = '\n'.join(unique_lines)
        
        if not full_response or full_response.strip() == "":
            full_response = "I couldn't process that request. Please try again."

        # Update chat history
        chat_history.append(f"Human: {user_prompt}")
        chat_history.append(f"AI: {full_response}")
        conversation_histories[session_id] = chat_history[-10:]  # Keep last 10 messages

    except TimeoutError:
        full_response = "Request took too long. Please try a simpler command."
    except Exception as e:
        error_msg = str(e).lower()
        if "iteration limit" in error_msg or "stop condition" in error_msg:
            full_response = "Your expense was likely added. Please check your summary with 'what's my total?'"
        else:
            full_response = "I'm sorry, I encountered an error. Please try again."
        print(f"Error during agent execution: {e}")

    # Convert to list for safe iteration
    chars = list(str(full_response))
    
    def generate_response_stream():
        try:
            for char in chars:
                yield char
                time.sleep(0.01)
        except GeneratorExit:
            pass
        except StopIteration:
            pass
    
    return Response(generate_response_stream(), 
                   mimetype='text/plain', 
                   headers={
                       'X-Session-ID': session_id,
                       'Cache-Control': 'no-cache',
                       'Connection': 'keep-alive'
                   })