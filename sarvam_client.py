import os
from dotenv import load_dotenv
from sarvamai import SarvamAI

# Load environment configurations from the local file
load_dotenv()

class SarvamBridge:
    def __init__(self):
        api_key = os.getenv("SARVAM_API_KEY")
        if not api_key or "YOUR_" in api_key:
            raise ValueError("Error: Please set your valid SARVAM_API_KEY inside the .env file.")
        
        # Instantiate standard SDK client pipeline
        self.client = SarvamAI(api_subscription_key=api_key)

    def translate_text(self, text: str, target_lang: str = "hi-IN", source_lang: str = "auto") -> str:
        """
        Translates text payloads across supported regional dialects.
        """
        try:
            response = self.client.text.translate(
                input=text,
                source_language_code=source_lang,
                target_language_code=target_lang
            )
            return response
        except Exception as e:
            return f"API Execution Failure: {str(e)}"
