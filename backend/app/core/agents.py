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

# --- EXPENSE TRACKER WITH BUDGET MANAGEMENT ---

expenses_db: List[Dict] = []
budget_db: Dict = {"amount": None, "set_at": None}  # Budget storage

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
    
    # Check budget if set
    budget_warning = ""
    if budget_db["amount"] is not None:
        total_spent = sum(e["amount"] for e in expenses_db)
        remaining = budget_db["amount"] - total_spent
        
        if remaining <= 0:
            budget_warning = f"\n\n🚨 BUDGET ALERT: You've EXCEEDED your budget of ₹{budget_db['amount']}! You've spent ₹{total_spent:.2f} (₹{abs(remaining):.2f} over budget)."
        elif remaining < budget_db["amount"] * 0.2:  # Less than 20% remaining
            budget_warning = f"\n\n⚠️ WARNING: You're running low on budget! Only ₹{remaining:.2f} left out of ₹{budget_db['amount']}."
        else:
            budget_warning = f"\n💰 Budget remaining: ₹{remaining:.2f} out of ₹{budget_db['amount']}"
    
    return f"Successfully added expense: {description} (₹{amount}) in category '{category}'.{budget_warning}"

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
def get_expense_summary(dummy_input: str = "") -> str:
    """Get detailed summary of all expenses with budget status. NO INPUT needed."""
    try:
        if not expenses_db:
            msg = "📊 No expenses recorded yet."
            if budget_db["amount"] is not None:
                msg += f"\n💰 Budget set: ₹{budget_db['amount']}"
            return msg
        
        total = sum(e["amount"] for e in expenses_db)
        by_cat = {}
        for e in expenses_db:
            cat = e["category"]
            by_cat[cat] = by_cat.get(cat, 0) + e["amount"]
        
        result = f"📊 EXPENSE SUMMARY\n"
        result += f"━━━━━━━━━━━━━━━━━━\n"
        result += f"💸 Total Spent: ₹{total:.2f}\n\n"
        
        # Budget status
        if budget_db["amount"] is not None:
            remaining = budget_db["amount"] - total
            percentage_used = (total / budget_db["amount"]) * 100
            
            result += f"💰 Budget Status:\n"
            result += f"   Budget: ₹{budget_db['amount']}\n"
            result += f"   Spent: ₹{total:.2f} ({percentage_used:.1f}%)\n"
            
            if remaining > 0:
                result += f"   Remaining: ₹{remaining:.2f}\n"
                if percentage_used >= 80:
                    result += f"   ⚠️ WARNING: {100-percentage_used:.1f}% budget remaining!\n"
            else:
                result += f"   🚨 OVER BUDGET by ₹{abs(remaining):.2f}!\n"
            result += f"\n"
        
        # Category breakdown
        result += f"📂 By Category:\n"
        for cat, amt in sorted(by_cat.items(), key=lambda x: x[1], reverse=True):
            percentage = (amt / total) * 100
            result += f"   • {cat.capitalize()}: ₹{amt:.2f} ({percentage:.1f}%)\n"
        
        # Recent expenses
        result += f"\n📝 Recent Expenses:\n"
        recent = expenses_db[-3:] if len(expenses_db) <= 3 else expenses_db[-3:]
        for exp in reversed(recent):
            result += f"   • {exp['description']}: ₹{exp['amount']} ({exp['category']})\n"
        
        return str(result)
    except Exception as e:
        return f"Error getting summary: {str(e)}"

@tool
def set_budget(budget_amount: str) -> str:
    """Set a budget limit. Input should be a number (e.g., '1000' for ₹1000)."""
    try:
        amount = float(budget_amount.strip())
        if amount <= 0:
            return "Error: Budget must be a positive number"
        
        budget_db["amount"] = amount
        budget_db["set_at"] = datetime.now().isoformat()
        
        # Calculate current spending status
        if expenses_db:
            total_spent = sum(e["amount"] for e in expenses_db)
            remaining = amount - total_spent
            
            msg = f"✅ Budget set to ₹{amount}\n"
            if remaining > 0:
                msg += f"💰 Current spending: ₹{total_spent:.2f}\n"
                msg += f"💵 Remaining: ₹{remaining:.2f}"
            else:
                msg += f"🚨 Warning: You've already spent ₹{total_spent:.2f}, which exceeds your budget by ₹{abs(remaining):.2f}!"
        else:
            msg = f"✅ Budget set to ₹{amount}. Start tracking your expenses!"
        
        return msg
    except ValueError:
        return "Error: Budget amount must be a valid number"
    except Exception as e:
        return f"Error setting budget: {str(e)}"

@tool
def get_budget_status(dummy_input: str = "") -> str:
    """Check current budget status and remaining amount. NO INPUT needed."""
    try:
        if budget_db["amount"] is None:
            return "💡 No budget set yet. Set a budget with 'set budget to [amount]' to start tracking!"
        
        total_spent = sum(e["amount"] for e in expenses_db)
        remaining = budget_db["amount"] - total_spent
        percentage_used = (total_spent / budget_db["amount"]) * 100
        
        result = f"💰 BUDGET STATUS\n"
        result += f"━━━━━━━━━━━━━━━━━━\n"
        result += f"Budget: ₹{budget_db['amount']}\n"
        result += f"Spent: ₹{total_spent:.2f} ({percentage_used:.1f}%)\n"
        
        if remaining > 0:
            result += f"Remaining: ₹{remaining:.2f}\n\n"
            
            if percentage_used >= 90:
                result += "🚨 CRITICAL: Only {:.1f}% of budget remaining!".format(100-percentage_used)
            elif percentage_used >= 75:
                result += "⚠️ WARNING: {:.1f}% of budget remaining!".format(100-percentage_used)
            elif percentage_used >= 50:
                result += "ℹ️ You've used over half your budget"
            else:
                result += "✅ You're doing well! Keep tracking."
        else:
            result += f"🚨 OVER BUDGET by ₹{abs(remaining):.2f}!\n"
            result += f"\nConsider:\n"
            result += f"• Reviewing your expenses\n"
            result += f"• Cutting unnecessary spending\n"
            result += f"• Increasing your budget if needed"
        
        return result
    except Exception as e:
        return f"Error checking budget: {str(e)}"

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
    tools = [add_expense, get_expense_summary, set_budget, get_budget_status, calculate]
    
    prompt_template = """You are a friendly and proactive expense tracking assistant! 💰

Your goal is to help users manage their money wisely by:
- Tracking every expense they add
- Setting and monitoring budgets
- Warning them when they're close to or over budget
- Providing helpful financial insights

You have access to these tools:
{tools}

Tool Names: {tool_names}

ALWAYS use this EXACT format:

Question: {input}
Thought: [what should I do to help the user?]
Action: [tool name from: {tool_names}]
Action Input: [input for that tool]
Observation: [tool result appears here]
Thought: [do I have enough info now?]
Final Answer: [friendly, helpful response with emojis and insights]

TOOL USAGE GUIDE:
• add_expense: "amount|category|description" → Example: "50|food|lunch at cafe"
• get_expense_summary: "" (empty string or "summary")
• set_budget: "amount" → Example: "1000"
• get_budget_status: "" (empty string)
• calculate: "math expression" → Example: "50*10"

PERSONALITY TRAITS:
✨ Be conversational and warm
💡 Proactively suggest budget insights
⚠️ Alert users about budget concerns
🎯 Keep responses concise but informative
📊 Use emojis to make info engaging

PROACTIVE BEHAVIORS:
- When adding expense: Show budget impact automatically
- When near budget (>75%): Suggest they slow down spending
- When over budget: Offer helpful tips
- After setting budget: Congratulate and encourage tracking

IMPORTANT:
- After seeing Observation, provide Final Answer (don't repeat actions)
- NEVER use same Action twice in a row
- Always check budget status after adding expenses

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