import torch
import torch.nn as nn
import timm

class XceptionNet(nn.Module):
    def __init__(self, num_classes=2):
        super(XceptionNet, self).__init__()
        # Create the base model without pretrained weights
        self.base_model = timm.create_model('xception', pretrained=False)
        # Replace the final fully connected layer
        in_features = self.base_model.fc.in_features
        self.base_model.fc = nn.Linear(in_features, num_classes)
        
    def forward(self, x):
        return self.base_model(x)
