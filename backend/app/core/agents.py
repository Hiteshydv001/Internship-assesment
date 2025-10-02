# backend/app/core/agents.py
import os
from datetime import datetime
from typing import List, Dict
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.tools import tool
from langchain.agents import create_react_agent, AgentExecutor
import json
from config import Config
llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", google_api_key=Config.GEMINI_API_KEY)
def get_qna_chain():
    return llm
def get_summarizer_chain():
    prompt = ChatPromptTemplate.from_template(
        "Summarize the following text in exactly 3 concise sentences:\n\n{text}"
    )
    return prompt | llm
expenses_db: List[Dict] = []
def _add_expense_impl(amount: float, category: str, description: str) -> str:
    new_expense = {
        "id": len(expenses_db) + 1,
        "amount": amount,
        "category": category,
        "description": description,
        "timestamp": datetime.now().isoformat(),
    }
    expenses_db.append(new_expense)
    return f"Successfully added expense: {description} (₹{amount}) in category '{category}'."
@tool
def add_expense(expense_data: str) -> str:
    """Add expense. Format: amount|category|description"""
    try:
        parts = expense_data.split('|')
        if len(parts) >= 3:
            amount = float(parts[0].strip())
            category = parts[1].strip()
            description = parts[2].strip()
            return _add_expense_impl(amount, category, description)
        return "Error: Use format amount|category|description"
    except Exception as e:
        return f"Error: {str(e)}"
@tool
def get_expense_summary() -> str:
    """Get summary of all expenses. NO INPUT needed."""
    if not expenses_db:
        return "No expenses recorded yet."
    total = sum(e["amount"] for e in expenses_db)
    by_cat = {}
    for e in expenses_db:
        by_cat[e["category"]] = by_cat.get(e["category"], 0) + e["amount"]
    result = f"Total: ₹{total:.2f}\n"
    for cat, amt in by_cat.items():
        result += f"- {cat}: ₹{amt:.2f}\n"
    return result
@tool
def calculate(expression: str) -> str:
    """Calculate math expression."""
    try:
        result = eval(expression, {"__builtins__": {}}, {})
        return f"{expression} = {result}"
    except Exception as e:
        return f"Error: {str(e)}"
def get_expense_agent_executor() -> AgentExecutor:
    tools = [add_expense, get_expense_summary, calculate]
    
    prompt_template = """You are a helpful expense tracking assistant with memory of past conversations.

You have access to these tools:
{tools}

Tool Names: {tool_names}

Use this format:
Question: the user's question or command
Thought: think about what to do based on the question and conversation history
Action: choose one tool from [{tool_names}]
Action Input: the input for that tool
Observation: the result from the tool
... (repeat Thought/Action/Action Input/Observation as needed)
Thought: I now know the final answer
Final Answer: provide a helpful response to the user

Previous conversation context:
{chat_history}

Current Question: {input}
Thought: {agent_scratchpad}

Remember: 
- When users ask about "total", "spending", or "summary", use get_expense_summary (no input needed)
- When adding expenses, use format: amount|category|description
- Reference previous context when relevant (e.g., "you added tea earlier")
- Be conversational and helpful"""
    
    prompt = ChatPromptTemplate.from_template(prompt_template)
    agent = create_react_agent(llm=llm, tools=tools, prompt=prompt)
    return AgentExecutor(
        agent=agent, 
        tools=tools, 
        verbose=True, 
        handle_parsing_errors=True, 
        max_iterations=10,
        return_intermediate_steps=False
    )
