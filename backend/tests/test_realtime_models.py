#!/usr/bin/env python3

"""
Test different Gemini models for real-time responses
"""

import asyncio
import sys
sys.path.append('.')

import google.generativeai as genai
from config import settings

async def test_different_models():
    print("🤖 Testing Different Gemini Models for Real-Time Responses...")
    print("=" * 60)
    
    # Configure API
    genai.configure(api_key=settings.GEMINI_API_KEY)
    
    # Models to test
    models_to_test = [
        'gemini-pro-latest',
        'gemini-1.5-flash', 
        'gemini-2.0-flash',
        'gemini-flash-latest',
        'gemini-3-flash-preview',
        'gemini-3-pro-preview'
    ]
    
    test_message = "Hello, can you help me with my studies? Please give a brief, helpful response."
    
    for model_name in models_to_test:
        print(f"\n🔍 Testing model: {model_name}")
        print("-" * 40)
        
        try:
            model = genai.GenerativeModel(model_name)
            
            # Try to get response
            response = model.generate_content(test_message)
            
            if response.text:
                print(f"✅ SUCCESS with {model_name}!")
                print(f"Response: {response.text[:200]}...")
                
                # Check if it's a real response (not fallback)
                if "technical difficulties" in response.text.lower():
                    print("⚠️  This appears to be a fallback response")
                else:
                    print("🎉 This is a REAL AI response!")
                    print(f"🎯 RECOMMENDED: Use {model_name} for real-time responses")
                    
                    # Update the ai_assistant.py file automatically
                    await update_model_in_config(model_name)
                    break
            else:
                print(f"❌ Empty response from {model_name}")
                
        except Exception as e:
            print(f"❌ Error with {model_name}: {str(e)[:100]}...")
    
    print("\n" + "=" * 60)
    print("🎯 Model Testing Complete!")
    print("\n💡 If no models worked:")
    print("1. Enable billing at: https://ai.google.dev/")
    print("2. Check API key validity")
    print("3. Verify project permissions")

async def update_model_in_config(best_model):
    """Update the ai_assistant.py file with the best working model"""
    print(f"\n🔧 Updating ai_assistant.py to use {best_model}...")
    
    try:
        with open('ai_assistant.py', 'r') as f:
            content = f.read()
        
        # Replace the model initialization
        old_init = '''class AIAssistantService:
    def __init__(self):
        # Check for Gemini API key
        if hasattr(settings, 'GEMINI_API_KEY') and settings.GEMINI_API_KEY:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            # Try different models that might have available quota
            try:
                self.model = genai.GenerativeModel('gemini-pro-latest')
                self.api_available = True
                print("✅ Using gemini-pro-latest model")
            except:
                try:
                    self.model = genai.GenerativeModel('gemini-1.5-flash')
                    self.api_available = True
                    print("✅ Using gemini-1.5-flash model")
                except:
                    self.model = genai.GenerativeModel('gemini-2.0-flash')
                    self.api_available = True
                    print("✅ Using gemini-2.0-flash model (default)")
        else:
            print("Warning: Gemini API key not found in settings")
            self.model = None
            self.api_available = False'''
        
        new_init = f'''class AIAssistantService:
    def __init__(self):
        # Check for Gemini API key
        if hasattr(settings, 'GEMINI_API_KEY') and settings.GEMINI_API_KEY:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            self.model = genai.GenerativeModel('{best_model}')
            self.api_available = True
            print(f"✅ Using {best_model} model (real-time AI)")
        else:
            print("Warning: Gemini API key not found in settings")
            self.model = None
            self.api_available = False'''
        
        content = content.replace(old_init, new_init)
        
        with open('ai_assistant.py', 'w') as f:
            f.write(content)
            
        print(f"✅ Updated to use {best_model}!")
        print("🔄 Please restart the backend server")
        
    except Exception as e:
        print(f"❌ Failed to update config: {e}")

if __name__ == "__main__":
    asyncio.run(test_different_models())
