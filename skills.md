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
