# Smartphone Market Intelligence Analysis

## Project Overview

This project was developed as part of my QSkill Python Development Internship.

The objective of this project is to analyze smartphone market data using Python and perform various data analysis and visualization tasks. The project helps understand smartphone pricing trends, brand performance, hardware specifications, customer ratings, and market patterns.

The analysis was performed using real smartphone data containing information about smartphone brands, prices, RAM, storage, camera specifications, processors, ratings, reviews, and launch years.

---

## Technologies Used

- Python
- Pandas
- Matplotlib
- Seaborn
- OpenPyXL

---

## Dataset Information

The dataset contains 831 smartphone records and 12 columns.

### Dataset Columns

- Brand
- Model_Name
- Launch_Year
- RAM_GB
- Storage_GB
- Price_INR
- Battery_mAh
- Back_Camera_MP
- Front_Camera_MP
- Processor
- Avg_Rating
- Total_Reviews

---

## Features Implemented

### Basic Data Analysis

- Average smartphone price
- Average smartphone rating
- Highest and lowest smartphone price
- Highest and lowest smartphone rating
- Oldest and latest launch year

### Brand Analysis

- Total number of brands
- Available smartphone brands
- Top smartphone brands
- Average price by brand
- Average rating by brand

### Relationship Analysis

- RAM vs Price Analysis
- Storage vs Price Analysis
- Camera vs Price Analysis
- Smartphone Price Evolution Analysis
- Rating Evolution Analysis
- RAM Trend Analysis
- Storage Trend Analysis
- Price Category Analysis

### Processor Analysis

- Top processors used in smartphones

### Popularity Analysis

- Most popular smartphone brands based on reviews

### Trusted Brand Analysis

- Brand rating comparison using brands with sufficient data

---

## Data Visualizations

The project generates the following visualizations:

### Bar Charts

- Top Brands by Average Price
- Top Brands by Average Rating
- Top Brands by Total Reviews

### Scatter Plots

- RAM vs Price
- Storage vs Price
- Camera vs Price
- Launch Year vs Price

### Heatmap

- Correlation Heatmap of Smartphone Features

---

## Key Insights

- Apple is the most expensive smartphone brand in the dataset.
- Storage capacity shows a strong relationship with smartphone pricing.
- Smartphone hardware specifications have improved significantly over the years.
- Customer ratings remain relatively stable across launch years.
- Premium brands generally maintain higher average prices.
- Popular brands generate significantly more customer engagement through reviews.

---

## Project Structure

```
Project-1_Data-Analysis
│
├── smartphone_analysis.py
├── mobile_phone datas.xlsx
├── requirements.txt
├── README.md
│
├── charts
│   ├── top_10_brands_by_average_price.png
│   ├── top_10_brands_by_average_rating.png
│   ├── top_10_brands_by_total_reviews.png
│   ├── ram_vs_price.png
│   ├── storage_vs_price.png
│   ├── camera_vs_price.png
│   ├── launch_year_vs_price.png
│   └── correlation_heatmap.png
```

---

## How to Run the Project

### Step 1

Install the required libraries:

```bash
pip install -r requirements.txt
```

### Step 2

Place the dataset file in the same folder as the Python script.

### Step 3

Run the program:

```bash
python smartphone_analysis.py
```

### Step 4

View the generated charts inside the charts folder.

---

## Learning Outcome

Through this project, I gained practical experience in:

- Python Programming
- Data Analysis using Pandas
- Data Visualization using Matplotlib and Seaborn
- Data Cleaning and Processing
- Extracting Insights from Real-World Data
- Project Development and Documentation

---

## Author

Srivel T.

QSkill Python Development Internship Project
