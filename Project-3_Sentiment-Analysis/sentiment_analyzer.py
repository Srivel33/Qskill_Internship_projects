from textblob import TextBlob

def calculate_percentages(polarity):
    """
    Simulates a confidence percentage distribution based on polarity.
    Returns a dict with positive, neutral, and negative percentages adding up to 100.
    """
    if polarity > 0:
        # Guarantee positive is the highest (between 50% and 95%)
        pos = 50 + int(polarity * 45)
        neu = 100 - pos - 2
        neg = 2
    elif polarity < 0:
        # Guarantee negative is the highest (between 50% and 95%)
        neg = 50 + int(abs(polarity) * 45)
        neu = 100 - neg - 2
        pos = 2
    else:
        neu = 96
        pos = 2
        neg = 2
        
    # Ensure they sum to exactly 100
    total = pos + neu + neg
    if total > 0:
        pos = int(round((pos / total) * 100))
        neg = int(round((neg / total) * 100))
        neu = 100 - (pos + neg)
        
    return {
        "positive": pos,
        "neutral": neu,
        "negative": neg
    }

def extract_keywords(text):
    """
    Extracts simple keywords (words > 3 chars, ignoring common stop words)
    without needing external NLTK corpora downloads.
    """
    stop_words = {"this", "that", "with", "from", "your", "have", "they", "will", "what", "about", "there", "their", "when", "would"}
    import re
    # Extract alpha words > 3 chars
    words = re.findall(r'\b[a-zA-Z]{4,}\b', text.lower())
    filtered = [w for w in words if w not in stop_words]
    
    # Get frequencies
    freq = {}
    for w in filtered:
        freq[w] = freq.get(w, 0) + 1
        
    # Sort by frequency then alphabetically
    sorted_words = sorted(freq.items(), key=lambda x: (-x[1], x[0]))
    
    # Return top 4 words capitalized
    return [w[0].capitalize() for w in sorted_words[:4]]


def analyze_sentiment(text):
    """
    Analyzes the sentiment of the provided text using TextBlob.
    
    Args:
        text (str): The text to analyze.
        
    Returns:
        dict: A dictionary containing sentiment category, polarity, subjectivity,
              percentages, and keywords.
    """
    
    # If the text is empty or only whitespace, return neutral
    if not text or not text.strip():
        return {
            "sentiment": "Neutral",
            "polarity": 0.0,
            "subjectivity": 0.0,
            "percentages": {"positive": 0, "neutral": 100, "negative": 0},
            "keywords": []
        }
        
    blob = TextBlob(text)
    
    # Get polarity and subjectivity
    polarity = blob.sentiment.polarity
    subjectivity = blob.sentiment.subjectivity
    
    # Determine the sentiment category based on polarity rules
    if polarity > 0:
        sentiment = "Positive"
    elif polarity < 0:
        sentiment = "Negative"
    else:
        sentiment = "Neutral"
        
    return {
        "sentiment": sentiment,
        "polarity": round(polarity, 2),
        "subjectivity": round(subjectivity, 2),
        "percentages": calculate_percentages(polarity),
        "keywords": extract_keywords(text)
    }
