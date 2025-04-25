# Deepfake detection model

Model is a deep learning-based classifier (specifically built using XceptionNet) that does the following:
    - Takes an image as input
    - Analyzes its content to detect signs of manipulation (deepfake)

-Outputs a prediction like:
        "Real" (if it's a genuine photo)
        "Fake" (if it's altered or AI-generated)


## How to Run

1. Install the required dependencies:
```bash
pip install -r requirements.txt
```

2. Run the application:
```bash
python app.py
```

The application will start and you can upload images to check if they are real or AI-generated.