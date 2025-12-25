from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from model_engine import process_and_predict
import uvicorn

app = FastAPI()

# Allow the React Frontend to talk to this Backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/")
def home():
    return {"message": "✅ Zatii Backend is Running! Go to http://localhost:3000 to use the App."}

@app.post("/predict")
async def get_prediction(files: List[UploadFile] = File(...)):
    # Convert uploaded files to a format pandas can read
    file_dict = {}
    for file in files:
        # Read the file content
        content = await file.read()
        file_dict[file.filename] = content
        
    # Run the Titanium Engine
    try:
        predictions = process_and_predict(file_dict)
        return {"status": "success", "data": predictions}
    except Exception as e:
        # Print error to terminal so you can see what went wrong
        print(f"Server Error: {e}")
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)