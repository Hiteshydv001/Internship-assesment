# backend/app/core/agents.py

import os
from datetime import datetime
from typing import List, Dict

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.tools import tool
from langchain.agents import create_react_agent, AgentExecutor

from config import Config

# --- SHARED LLM INSTANCE ---
# CORRECTED: Switched to the recommended free-tier 'gemini-2.5-flash' model
# as of October 2025.
llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", google_api_key=Config.GEMINI_API_KEY)


# --- FEATURE 1: Q&A BOT ---
def get_qna_chain():
    """Returns a simple chain for direct Q&A."""
    return llm


# --- FEATURE 2: TEXT SUMMARIZER ---
def get_summarizer_chain():
    """Returns a chain that specifically prompts the model for summarization."""
    prompt = ChatPromptTemplate.from_template(
        "Summarize the following text in exactly 3 concise sentences:\n\n{text}"
    )
    return prompt | llm


# --- FEATURE 3: PERSONAL EXPENSE TRACKER (AGENT WITH TOOLS) ---

# In-memory "database" for demonstration purposes.
# In a real application, this would be a SQL database or a NoSQL store.
expenses_db: List[Dict] = []

@tool
def add_expense(amount: float, category: str, description: str) -> str:
    """
    Adds a new expense record. Use this tool when the user wants to record a spending.
    Args:
        amount: The numerical amount of the expense.
        category: The category of the expense (e.g., 'food', 'rent', 'travel').
        description: A brief description of the expense.
    """
    new_expense = {
        "id": len(expenses_db) + 1,
        "amount": amount,
        "category": category,
        "description": description,
        "timestamp": datetime.now().isoformat(),
    }
    expenses_db.append(new_expense)
    return f"Successfully added expense: {description} (${amount}) in category '{category}'."

@tool
def get_expense_summary() -> str:
    """
    Provides a summary of all recorded expenses, including total spending and breakdown by category.
    Use this when the user asks for a summary, report, or asks 'how much have I spent'.
    """
    if not expenses_db:
        return "No expenses have been recorded yet."

    total_spent = sum(e["amount"] for e in expenses_db)
    by_category = {}
    for expense in expenses_db:
        cat = expense["category"]
        by_category[cat] = by_category.get(cat, 0) + expense["amount"]

    summary = f"Total expenses recorded: {len(expenses_db)}\n"
    summary += f"Total amount spent: ${total_spent:.2f}\n"
    summary += "Breakdown by category:\n"
    for cat, amount in by_category.items():
        summary += f"- {cat.capitalize()}: ${amount:.2f}\n"
        
    return summary

def get_expense_agent_executor() -> AgentExecutor:
    """Creates and returns a LangChain agent for managing expenses."""
    tools = [add_expense, get_expense_summary]
    
    prompt_template = """
    You are a helpful personal finance assistant. Your goal is to help the user track their expenses using the available tools.
    
    TOOLS:
    ------
    You have access to the following tools:
    {tools}

    The tool names are: {tool_names}

    To use a tool, please use the following format:
    
    ```json
    {{
        "tool": "$TOOL_NAME",
        "tool_input": "$INPUT"
    }}
    ```
    
    When you have a response to say to the Human, or if you do not need to use a tool, you MUST use the format:
    
    ```json
    {{
        "action": "Final Answer",
        "action_input": "Your response here"
    }}
    ```
    
    Begin!
    
    PREVIOUS CONVERSATION HISTORY:
    {chat_history}
    
    USER'S INPUT:
    {input}
    
    SCRATCHPAD:
    {agent_scratchpad}
    """
    
    prompt = ChatPromptTemplate.from_template(prompt_template)
    
    agent = create_react_agent(llm, tools, prompt)
    agent_executor = AgentExecutor(
        agent=agent, 
        tools=tools, 
        verbose=True, # Set to True for debugging to see the agent's thoughts
        handle_parsing_errors=True # Helps with robustness
    )
    return agent_executor