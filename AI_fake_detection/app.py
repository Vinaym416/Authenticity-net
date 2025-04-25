import streamlit as st
from PIL import Image
import torch
from torchvision import transforms
from utils.model_utils import load_model, predict_image
import os
from utils.model_utils import load_model

st.title("🔍 Deepfake Detection App")
st.write("Upload an image to check if it's Real or Fake.")

uploaded_file = st.file_uploader("Upload Image", type=["jpg", "jpeg", "png"])

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

model_path = "best_xception_model.pth"
model = load_model(model_path)



if uploaded_file:
    image = Image.open(uploaded_file).convert("RGB")
    st.image(image, caption="Uploaded Image", use_container_width=True)

    if st.button("Predict"):
        with st.spinner("Analyzing..."):
            prediction, confidence = predict_image(model, image, device)
            st.success(f"Prediction: **{prediction}**")
            st.info(f"Confidence: **{confidence:.2f}%**")
