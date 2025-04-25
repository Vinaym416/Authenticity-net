import torch
import torch.nn.functional as F
from torchvision import transforms
from PIL import Image
from model.xception import XceptionNet  # Make sure you have this or adjust accordingly


def load_model(model_path, num_classes=2):
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    # Initialize model
    model = XceptionNet(num_classes=num_classes)
    
    # Load state dict with strict=False to ignore missing keys
    state_dict = torch.load(model_path, map_location=device)
    model.load_state_dict(state_dict, strict=False)
    
    model.to(device)
    model.eval()

    return model

def predict_image(model, image: Image.Image, device):
    transform = transforms.Compose([
        transforms.Resize((299, 299)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.5]*3, std=[0.5]*3)
    ])
    img_tensor = transform(image).unsqueeze(0).to(device)

    with torch.no_grad():
        outputs = model(img_tensor)
        probs = F.softmax(outputs, dim=1)
        confidence, predicted = torch.max(probs, 1)
    
    class_names = ['fake', 'real']
    return class_names[predicted.item()], confidence.item() * 100


