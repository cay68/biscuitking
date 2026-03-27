import pandas as pd
import json
import os
from anthropic import Anthropic

# ============================================================
# STEP 1: Load and process product data using pandas
# ============================================================

def load_products(filepath):
    """Load product data from Excel file and process into structured format."""
    df = pd.read_excel(filepath)

    # Clean column names
    df.columns = df.columns.str.strip()

    # Rename for consistency
    df = df.rename(columns={
        'ID': 'id',
        'Product Name': 'name',
        'Image Filename': 'image',
        'Category': 'category',
        'Price (SGD)': 'price',
        'Price Unit': 'price_unit',
        'Flavor Profile': 'flavor_profile',
        'Era': 'era',
        'Occasions': 'occasions',
        'Description': 'description'
    })

    # Parse pipe-delimited fields into lists
    for col in ['flavor_profile', 'era', 'occasions']:
        df[col] = df[col].apply(lambda x: [i.strip() for i in str(x).split('|')] if pd.notna(x) else [])

    # Convert price to float
    df['price'] = pd.to_numeric(df['price'], errors='coerce')

    return df


def get_product_summary(df):
    """Generate summary statistics about the product catalogue."""
    summary = {
        'total_products': len(df),
        'categories': df['category'].unique().tolist(),
        'price_range': f"${df['price'].min():.2f} — ${df['price'].max():.2f}",
        'products_per_category': df['category'].value_counts().to_dict()
    }
    return summary


def products_to_knowledge_base(df):
    """Convert the pandas DataFrame into a text knowledge base for the system prompt."""
    products_text = ""
    for _, row in df.iterrows():
        products_text += f"""
- **{row['name']}** (ID: {row['id']})
  Category: {row['category']}
  Price: ${row['price']:.2f} per {row['price_unit']}
  Flavour: {', '.join(row['flavor_profile'])}
  Era: {', '.join(row['era'])}
  Occasions: {', '.join(row['occasions'])}
  Description: {row['description']}
"""
    return products_text


# ============================================================
# STEP 2: Build system prompt with hallucination guardrails
# ============================================================

def build_system_prompt(df):
    """Build the full system prompt with product data and guardrails."""

    product_kb = products_to_knowledge_base(df)
    summary = get_product_summary(df)

    system_prompt = f"""You are "Biscuit King", a friendly and knowledgeable snack shop assistant for Biscuit King — a traditional snack retailer at 130 Casuarina Road, Upper Thomson, Singapore.

## YOUR PERSONA
- Warm, enthusiastic, and genuinely passionate about traditional snacks
- You speak naturally and can use light Singlish where appropriate (e.g., "shiok", "best lah")
- You are like the friendly uncle behind the counter who knows every product
- Keep responses concise: 2-4 sentences, then offer to help more

## YOUR KNOWLEDGE — PRODUCT CATALOGUE
You know EXACTLY {summary['total_products']} products across these categories: {', '.join(summary['categories'])}
Price range: {summary['price_range']}

Here is your COMPLETE product catalogue. This is the ONLY source of truth:

{product_kb}

## STORE INFORMATION
- Address: 130 Casuarina Road, Singapore 579518
- Hours: Tuesday – Sunday, 11am – 10pm (Closed on Mondays)
- Phone: +65 6454 5938
- WhatsApp: 9729 6540
- Mix & Match Tins: Choose up to 4 flavours per tin, from $30
- In-store pickup available

## CRITICAL RULES — HALLUCINATION PREVENTION
1. ONLY recommend products that exist in the catalogue above. NEVER invent product names, prices, or descriptions.
2. If a user asks about a product you don't have in your catalogue, say: "I don't have that in my current catalogue, but let me suggest something similar!" — then recommend a real product.
3. ALWAYS include the exact price and unit when recommending a product (e.g., "$10.50 per 1kg").
4. If you are unsure about any detail, say so honestly. Do not guess.
5. NEVER make up promotions, discounts, or offers that are not mentioned in the store information above.
6. If asked about topics unrelated to Biscuit King or snacks, politely redirect: "I'm best at helping with snacks! What kind of treats are you looking for?"
7. When recommending products, pull directly from the catalogue data — use the exact product name and price as listed.

## WHAT YOU CAN DO
- Recommend snacks by era (e.g., "I'm a 90s kid")
- Recommend by flavour preference (sweet, sour, savoury, etc.)
- Recommend by occasion (CNY, Hari Raya, Deepavali, gifting, parties)
- Suggest gift tin combinations within a budget
- Answer questions about specific products (price, description, flavour)
- Compare products when asked
- Suggest pairings ("If you like X, you'll also love Y")

## RESPONSE FORMAT
- Keep it conversational, not robotic
- When listing multiple products, use a short format: Product Name — $X.XX/unit — one-line description
- Always end with a follow-up question or suggestion to keep the conversation going
- If recommending a tin combination, list the 4 items and the total price
"""
    return system_prompt


# ============================================================
# STEP 3: Chat function with conversation memory
# ============================================================

def create_chatbot(product_filepath):
    """Create a chatbot instance with product data loaded."""

    df = load_products(product_filepath)
    system_prompt = build_system_prompt(df)
    client = Anthropic(api_key=os.environ.get('ANTHROPIC_API_KEY'))
    conversation_history = []

    def chat(user_message):
        """Send a message and get a response. Maintains conversation history."""

        conversation_history.append({
            "role": "user",
            "content": user_message
        })

        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=500,
            system=system_prompt,
            messages=conversation_history
        )

        assistant_message = response.content[0].text

        conversation_history.append({
            "role": "assistant",
            "content": assistant_message
        })

        return assistant_message

    def reset():
        """Clear conversation history."""
        conversation_history.clear()

    def get_products():
        """Return the product DataFrame for analysis."""
        return df

    return chat, reset, get_products


# ============================================================
# STEP 4: Run standalone from command line
# ============================================================

if __name__ == "__main__":
    import sys

    filepath = sys.argv[1] if len(sys.argv) > 1 else "biscuit_king_product_template.xlsx"

    print("=" * 50)
    print("  Biscuit King AI Snack Finder")
    print("  Type 'quit' to exit, 'reset' to start over")
    print("=" * 50)

    chat, reset, get_products = create_chatbot(filepath)

    # Show product summary
    df = get_products()
    print(f"\nLoaded {len(df)} products across {df['category'].nunique()} categories")
    print(f"Price range: ${df['price'].min():.2f} — ${df['price'].max():.2f}\n")

    while True:
        user_input = input("You: ").strip()
        if user_input.lower() == 'quit':
            print("Thanks for visiting Biscuit King!")
            break
        elif user_input.lower() == 'reset':
            reset()
            print("Conversation reset.\n")
            continue
        elif not user_input:
            continue

        response = chat(user_input)
        print(f"\nBiscuit King: {response}\n")
