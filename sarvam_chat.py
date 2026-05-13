import os
from dotenv import load_dotenv
from sarvamai import SarvamAI

# 1. Load the API Key from .env
load_dotenv()

# 2. Initialize the Client
api_key = os.getenv("SARVAM_API_KEY")
if not api_key:
    print("Error: SARVAM_API_KEY not found in .env file.")
    exit(1)

client = SarvamAI(api_subscription_key=api_key)

# 3. Call the Chat API (Generating Code)
print("Sending request to Sarvam AI...")
try:
    response = client.chat.completions(
        model="sarvam-2-beta",
        messages=[
            {"role": "user", "content": "Write a Python function to check if a number is prime and explain it briefly."}
        ]
    )

    # 4. Print the result
    print("\n--- Sarvam AI Response ---")
    print(response.choices[0].message.content)
except Exception as e:
    print(f"\nError calling Sarvam AI: {str(e)}")
