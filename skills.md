# Skill: Sarvam AI Integration

## Context
Sarvam AI specializes in full-stack regional AI for Indian languages. This repository leverages the `sarvamai` python SDK to interact with its APIs for localized execution.

## SDK Initialization Pattern
Always use this structural pattern when constructing client instances:

```python
from sarvamai import SarvamAI
import os

client = SarvamAI(api_subscription_key=os.getenv("SARVAM_API_KEY"))
```

## Available Language Target Enums
* Hindi: 'hi-IN'
* Bengali: 'bn-IN'
* Telugu: 'te-IN'
* Tamil: 'ta-IN'
* Marathi: 'mr-IN'
* Gujarati: 'gu-IN'

## Chat & Code Generation Pattern
Use the `chat.completions` callable for generating text or code:

```python
# To generate code or chat with Sarvam's models:
response = client.chat.completions(
    model="sarvam-m", # Options: sarvam-m, sarvam-30b, sarvam-105b
    messages=[
        {"role": "user", "content": "Write a python script to calculate Fibonacci."}
    ]
)
print(response.choices[0].message.content)
```
