import os
import pickle
import numpy as np
import torch
from transformers import AutoTokenizer, AutoModel
from pathlib import Path
import faiss


class Classifier:
    def __init__(
        self,
        model_name="intfloat/multilingual-e5-large",
        k_neighbours=50,
        index_path=os.path.join(Path(os.path.dirname(__file__)), 'index.bin'),
        labels_path=os.path.join(Path(os.path.dirname(__file__)), 'labels.bin'),
    ):
        self.model_name = model_name
        self.k_neighbours = k_neighbours
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)
        self.model = AutoModel.from_pretrained(self.model_name).to(self.device).eval()
        self.index = faiss.read_index(index_path)
        with open(labels_path, 'rb') as file:
            dct = pickle.load(file)
            self.labels, self.label_encoder = dct['labels'], dct['label_encoder']

    def get_embeddings(self, texts):
        inputs = self.tokenizer(
            texts,
            padding=True,
            truncation=True,
            max_length=256,
            return_tensors="pt",
            return_attention_mask=True,
        ).to(self.device)

        with torch.no_grad():
            outputs = self.model(**inputs)
            last_hidden_state = outputs.last_hidden_state

            attention_mask = inputs['attention_mask'].unsqueeze(-1).float()
            masked_output = last_hidden_state * attention_mask
            summed = torch.sum(masked_output, dim=1)
            counts = torch.clamp(attention_mask.sum(dim=1), min=1e-9)
            pooled = (summed / counts).cpu().numpy()

            pooled = pooled / np.linalg.norm(pooled, axis=1, keepdims=True)
            return pooled

    def predict(self, text):
        vector = self.get_embeddings([text])
        D, i = self.index.search(vector.astype('float32'), self.k_neighbours)
        weights = 1 / (D + 1e-0)
        for j in range(len(i)):
            neighbor_labels = self.labels[i[j]]
            pred = np.argmax(np.bincount(neighbor_labels, weights=weights[j]))
            return self.label_encoder.inverse_transform([pred])