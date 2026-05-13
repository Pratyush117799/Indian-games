from sarvamai import SarvamAI
import os
from dotenv import load_dotenv

load_dotenv()
client = SarvamAI(api_subscription_key=os.getenv("SARVAM_API_KEY"))

print("Chat Methods:", dir(client.chat))
print("\nText Methods:", dir(client.text))
