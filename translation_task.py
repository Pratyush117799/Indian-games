import sys
import io
from sarvam_client import SarvamBridge

# Force UTF-8 encoding for printing to terminal
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def main():
    print("Initializing Sarvam AI Bridge Engine...")
    try:
        bridge = SarvamBridge()
        
        sample_phrase = "Welcome to your new agent-first development workspace."
        target = "hi-IN" # Translating to Hindi
        
        print(f"Original Text: '{sample_phrase}'")
        print(f"Translating to language code: {target}...")
        
        result = bridge.translate_text(text=sample_phrase, target_lang=target)
        print(f"\nSarvam Response:\n{result}")
        
    except ValueError as val_err:
        print(val_err)
        sys.exit(1)

if __name__ == "__main__":
    main()
