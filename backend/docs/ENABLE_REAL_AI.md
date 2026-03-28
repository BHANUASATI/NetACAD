# Enable Real-Time AI Responses

## 🎯 Current Status
- ✅ Backend API working perfectly
- ✅ Authentication fixed
- ✅ Fallback responses working (helpful but not real AI)
- ❌ Gemini API quota exceeded (need billing for real AI)

## 💡 Solution: Enable Gemini Billing

### Step 1: Go to Google AI Studio
1. Visit: https://ai.google.dev/
2. Sign in with your Google account
3. Click "Get API Key" or "Go to API Keys"

### Step 2: Enable Billing
1. In Google AI Studio, go to "Billing" or "Usage"
2. Click "Enable Billing" or "Set up billing account"
3. Add your payment method (credit card)
4. Set budget limits to control costs

### Step 3: Check Your API Key
Your current API key: `AIzaSyCgoge9uBDifgoojz71gd3UWM1D_3Bgjgo`

### Step 4: Verify Quota
After enabling billing:
- Visit: https://ai.dev/rate-limit
- Check your new quota limits
- Should show much higher limits

### Step 5: Restart Backend
```bash
# Kill current server
lsof -ti:8000 | xargs kill -9

# Restart server
cd /path/to/NetACAD/backend
python3 main.py
```

## 💰 Cost Information
- **Gemini 2.0 Flash**: ~$0.00025 per 1K characters
- **Very affordable**: $1 = 4M characters
- **Student usage**: Typically <$1 per month
- **Set budget alerts**: Control spending

## 🎮 Alternative: Test with Different Model

If you want to try a different model that might have free quota:

### Update Model in ai_assistant.py:
```python
# Change this line:
self.model = genai.GenerativeModel('gemini-2.0-flash')

# To one of these:
self.model = genai.GenerativeModel('gemini-1.5-flash')  # Older model
self.model = genai.GenerativeModel('gemini-pro-latest')  # Pro model
```

## 🔧 Quick Test

After enabling billing, test with:
```bash
cd /path/to/NetACAD/backend
python3 -c "
import asyncio
from ai_assistant import ai_assistant_service

async def test():
    response = await ai_assistant_service.get_ai_response('Hello, how are you?', [], {})
    print('Real AI Response:', response[:200])

asyncio.run(test())
"
```

## 🎉 Expected Results

With billing enabled:
- ✅ Real-time AI responses
- ✅ Context-aware conversations
- ✅ Intelligent academic guidance
- ✅ Personalized help based on user profile

## 📞 Support

If you need help:
1. Google AI documentation: https://ai.google.dev/docs
2. Gemini API guide: https://ai.google.dev/gemini-api/docs
3. Rate limits: https://ai.google.dev/gemini-api/docs/rate-limits

---

**Note**: The fallback system is actually quite good and provides helpful academic guidance. But for real AI conversations, enabling billing is the way to go!
