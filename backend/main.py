import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="SmartIQ API")

# Allow requests from Vite frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "https://*.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

class QuizSubmission(BaseModel):
    answers: list[dict]
    total_time_seconds: int

@app.post("/api/evaluate")
async def evaluate_quiz(submission: QuizSubmission):
    try:
        performance_summary = f"User test responses and metrics: {submission.answers}. Total time taken: {submission.total_time_seconds} seconds."
        
        prompt = f"""
        You are an expert cognitive psychologist and AI psychometric evaluator. 
        Analyze the following user performance data from a 5-question logic and pattern recognition test:
        {performance_summary}
        
        Provide an evaluation in valid JSON format ONLY, matching this exact structure with no markdown backticks outside or inside:
        {{
          "estimated_iq_range": "e.g., 115-120",
          "cognitive_strengths": ["Strength 1", "Strength 2"],
          "cognitive_weaknesses": ["Weakness 1", "Weakness 2"],
          "action_plan": [
            "Specific actionable recommendation 1",
            "Specific actionable recommendation 2",
            "Specific actionable recommendation 3"
          ]
        }}
        """

        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
        )
        
        raw_text = response.text.strip()
        if raw_text.startswith("```json"):
            raw_text = raw_text[7:]
        if raw_text.endswith("```"):
            raw_text = raw_text[:-3]
            
        import json
        result_data = json.loads(raw_text.strip())
        return result_data

    except Exception as e:
        print(f"Error during AI evaluation: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)