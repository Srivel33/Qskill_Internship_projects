# Sentiment Analysis Web Application

![Python](https://img.shields.io/badge/Python-3.x-blue.svg)
![Flask](https://img.shields.io/badge/Flask-Framework-black.svg)
![TextBlob](https://img.shields.io/badge/TextBlob-NLP-orange.svg)
![HTML5](https://img.shields.io/badge/HTML5-Frontend-E34F26.svg)
![CSS3](https://img.shields.io/badge/CSS3-Styling-1572B6.svg)
![Vanilla JS](https://img.shields.io/badge/Vanilla_JS-Logic-F7DF1E.svg)

## Project Description

A modern, responsive web application that performs sentiment analysis on user-provided text. The application uses Natural Language Processing (NLP) via the TextBlob Python library to analyze the emotional tone of text, categorizing it as Positive, Neutral, or Negative. 

This project features a custom-designed **Aurora Emotion Theme** utilizing glassmorphism, smooth animations, and a sleek dark mode dashboard—all built completely from scratch without external frontend frameworks like Bootstrap or React.

*Developed as part of a Python Development Internship.*

## 🌟 Features

*   **Real-time Sentiment Analysis:** Accurately classifies text sentiment.
*   **Detailed Metrics:** Displays Polarity and Subjectivity scores with animated progress bars.
*   **Text Statistics:** Calculates word count, character count, and estimated reading time.
*   **Analysis History:** Keeps track of the last 5 analyses locally.
*   **Modern UI/UX:** "Aurora Emotion Theme" with a dark mode glassmorphism design.
*   **Responsive:** Fully functional on mobile and desktop devices.
*   **AJAX Integration:** Fetches results seamlessly without page reloads.
*   **One-click Copy:** Easily copy analysis results to the clipboard.
*   **Robust Error Handling:** Validates empty or excessively long inputs.

## 🛠️ Technology Stack

**Backend:**
*   Python 3
*   Flask (Web Framework)
*   TextBlob (NLP Library)

**Frontend:**
*   HTML5
*   CSS3 (Custom Vanilla CSS, CSS Variables, Flexbox/Grid)
*   Vanilla JavaScript (Fetch API, DOM Manipulation)

## 📁 Folder Structure

```
Project-3_Sentiment-Analysis/
│
├── app.py                     # Main Flask application and routing
├── sentiment_analyzer.py      # Core NLP sentiment analysis logic
├── requirements.txt           # Python dependencies
├── Procfile                   # Configuration for Render deployment
├── README.md                  # Project documentation
│
├── templates/
│   └── index.html             # Main frontend layout
│
└── static/
    ├── style.css              # Custom styling (Aurora Emotion Theme)
    ├── app.js                 # Client-side interactivity and AJAX
    └── screenshots/           # Application screenshots for showcase
```

## 🚀 Installation & Local Setup

Follow these steps to run the project locally on your machine.

**1. Clone the repository**
```bash
 https://github.com/Srivel33/Qskill_Internship_projects/tree/main/project-3_Sentiment-Analysis
```

**2. Create a virtual environment**
```bash
python -m venv venv
```

**3. Activate the virtual environment**
*   **Windows:** `venv\Scripts\activate`
*   **Mac/Linux:** `source venv/bin/activate`

**4. Install dependencies**
```bash
pip install -r requirements.txt
```

**5. Run the application**
```bash
python app.py
```

**6. Access the web app**
Open your browser and navigate to: `http://127.0.0.1:5000/`

## 📸 Screenshots

https://github.com/Srivel33/Qskill_Internship_projects/blob/main/project-3_Sentiment-Analysis/static/screenshots/1.Home_page.png

## 🚀 Deployment

This project is configured for easy deployment on platforms like [Render](https://render.com/). The included `Procfile` uses Gunicorn as the production WSGI server. 

## 🌐 Live Demo

Deployed on Render
https://your-render-link.onrender.com

## 👨‍💻 Author

** Srivel.T **
*   Artificial Intelligence and Machine Learning Student
*   SNS College of Technology
*   Python Development Intern – QSkill
