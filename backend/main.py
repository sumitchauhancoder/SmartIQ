import os
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from google import genai
from google.genai import types  # Imported for structured schema config
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = FastAPI(title="SmartIQ API")

# Enable CORS for frontend development (Cleaned up wildcard conflict)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Google GenAI client
api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key)

# Input Schema from your frontend
class QuizSubmission(BaseModel):
    answers: list[dict]
    total_time_seconds: int

# Strict Output Schema for Gemini to enforce valid JSON mapping
class EvaluationResponse(BaseModel):
    estimated_iq_range: str = Field(description="e.g., 115-120")
    cognitive_strengths: list[str]
    cognitive_weaknesses: list[str]
    action_plan: list[str]

@app.get("/")
def read_root():
    return {"status": "SmartIQ Backend is running successfully!"}

@app.post("/api/evaluate")
async def evaluate_quiz(submission: QuizSubmission):
    try:
        performance_summary = f"User test responses and metrics: {submission.answers}. Total time taken: {submission.total_time_seconds} seconds."
        
        prompt = f"""
        You are an expert cognitive psychologist and AI psychometric evaluator. 
        Analyze the following user performance data from a 5-question logic and pattern recognition test:
        {performance_summary}
        
        Provide a comprehensive cognitive profile matching the required schema structure.
        """

        # Using Native Structured Outputs via response_schema
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=EvaluationResponse,
            ),
        )
        
        # Safe extraction: response.text is automatically a strictly guaranteed JSON string
        result_data = json.loads(response.text.strip())
        return result_data

    except Exception as e:
        print(f"Error during AI evaluation: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
