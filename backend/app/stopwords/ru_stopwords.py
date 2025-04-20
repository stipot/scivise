import os

stopwords = []
file_path = os.path.join(os.path.dirname(__file__), 'stopwords_ru.txt')
with open(file_path, 'r', encoding='utf-8') as file:
    for line in file:
        stopwords.append(line.strip())