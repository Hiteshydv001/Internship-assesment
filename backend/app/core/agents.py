# backend/app/core/agents.py
import os
from datetime import datetime
from typing import List, Dict

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.tools import tool
from langchain.agents import create_react_agent, AgentExecutor
from config import Config

llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", google_api_key=Config.GEMINI_API_KEY, temperature=0.0)

def get_qna_chain():
    return llm

def get_summarizer_chain():
    prompt = ChatPromptTemplate.from_template("Summarize the following text in exactly 3 concise sentences:\n\n{text}")
    return prompt | llm

# --- EXPENSE TRACKER WITH SIMPLE STRING INPUT ---

expenses_db: List[Dict] = []

def _add_expense_impl(amount: float, category: str, description: str) -> str:
    """Internal function to add expense to database."""
    new_expense = {
        "id": len(expenses_db) + 1,
        "amount": amount,
        "category": category.lower(),
        "description": description,
        "timestamp": datetime.now().isoformat(),
    }
    expenses_db.append(new_expense)
    return f"Successfully added expense: {description} (₹{amount}) in category '{category}'."

@tool
def add_expense(expense_data: str) -> str:
    """Add an expense. Format: amount|category|description (e.g., '30|food|coffee')"""
    try:
        parts = expense_data.split('|')
        if len(parts) >= 3:
            amount = float(parts[0].strip())
            category = parts[1].strip()
            description = parts[2].strip()
            return _add_expense_impl(amount, category, description)
        elif len(parts) == 2:
            # If only 2 parts, use second part as both category and description
            amount = float(parts[0].strip())
            category = parts[1].strip()
            description = parts[1].strip()
            return _add_expense_impl(amount, category, description)
        else:
            return "Error: Use format amount|category|description (e.g., '30|food|coffee')"
    except ValueError:
        return "Error: Amount must be a number"
    except Exception as e:
        return f"Error: {str(e)}"

@tool
def get_expense_summary() -> str:
    """Get summary of all expenses. NO INPUT needed - just call this tool directly."""
    if not expenses_db:
        return "No expenses recorded yet."
    
    total = sum(e["amount"] for e in expenses_db)
    by_cat = {}
    for e in expenses_db:
        cat = e["category"]
        by_cat[cat] = by_cat.get(cat, 0) + e["amount"]
    
    result = f"Total: ₹{total:.2f}\n\nBreakdown by category:\n"
    for cat, amt in sorted(by_cat.items()):
        result += f"- {cat.capitalize()}: ₹{amt:.2f}\n"
    return result

@tool
def calculate(expression: str) -> str:
    """Calculate a math expression. Input should be a valid math expression like '10+20' or '50*2'."""
    try:
        # Safe eval with restricted builtins
        result = eval(expression, {"__builtins__": {}}, {})
        return f"Result: {expression} = {result}"
    except Exception as e:
        return f"Error calculating: {str(e)}"

def get_expense_agent_executor() -> AgentExecutor:
    tools = [add_expense, get_expense_summary, calculate]
    
    prompt_template = """You are a helpful expense tracking assistant with memory of past conversations.

You have access to these tools:
{tools}

Tool Names: {tool_names}

ALWAYS use this EXACT format (no deviations):

Question: {input}
Thought: [your reasoning about what to do]
Action: [EXACTLY ONE tool name from: {tool_names}]
Action Input: [the input for that tool]
Observation: [the tool's result will appear here]
Thought: [analyze the observation - do you have enough info to answer?]
Final Answer: [your response to the user]

CRITICAL RULES:
1. After you see an Observation, you MUST either use another Action OR provide Final Answer
2. NEVER repeat the same Action/Action Input twice
3. For add_expense: Use "amount|category|description" (e.g., "10|food|tea")
4. For get_expense_summary: Use empty string "" as input
5. For calculate: Use math expression like "10+20"
6. After successful add_expense, immediately give Final Answer (don't call it again!)

Previous conversation:
{chat_history}

Begin!

Question: {input}
{agent_scratchpad}"""
    
    prompt = ChatPromptTemplate.from_template(prompt_template)
    agent = create_react_agent(llm=llm, tools=tools, prompt=prompt)
    
    return AgentExecutor(
        agent=agent, 
        tools=tools, 
        verbose=True, 
        handle_parsing_errors=True, 
        max_iterations=3,  # Reduced from 10 to prevent loops
        return_intermediate_steps=False,
        max_execution_time=10  # 10 second timeout
    )