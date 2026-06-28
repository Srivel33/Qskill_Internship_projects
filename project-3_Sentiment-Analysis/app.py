from flask import Flask, render_template, request, jsonify
from sentiment_analyzer import analyze_sentiment
import logging

# Initialize Flask application
app = Flask(__name__)

# Configure logging for error handling
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.route('/')
def index():
    """
    Renders the main homepage of the application.
    """
    return render_template('index.html')

@app.route('/analyze', methods=['POST'])
def analyze():
    """
    API endpoint that receives text and returns the sentiment analysis result.
    Communicates via JSON for AJAX requests.
    """
    try:
        # Get JSON data from the request
        data = request.get_json()
        
        # Check if data exists and contains 'text'
        if not data or 'text' not in data:
            return jsonify({
                "error": "Invalid request. 'text' field is required."
            }), 400
            
        text = data.get('text', '')
        
        # Validate empty input
        if not text.strip():
            return jsonify({
                "error": "Input text cannot be empty."
            }), 400
            
        # Optional: Check for very long input to prevent abuse
        if len(text) > 5000:
            return jsonify({
                "error": "Input text is too long. Please limit to 5000 characters."
            }), 400

        # Perform sentiment analysis using our analyzer function
        result = analyze_sentiment(text)
        
        # Return the successful result as JSON
        return jsonify(result), 200

    except Exception as e:
        # Log the error on the server side
        logger.error(f"Error during sentiment analysis: {str(e)}")
        
        # Return a friendly error message to the client
        return jsonify({
            "error": "An unexpected server error occurred while analyzing the text."
        }), 500

if __name__ == '__main__':
    # Run the application in debug mode for development
    app.run(debug=True)
