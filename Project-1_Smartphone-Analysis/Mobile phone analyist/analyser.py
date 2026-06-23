import pandas as pd

df=pd.read_excel("mobile_phone datas.xlsx")

print("\n===== DATASET LOADED SUCCESSFULLY =====")

print("\nThe Shape of the dataset is:", df.shape)
print(f"\nThe dataset contains {df.shape[0]} smartphone records.")
print(f"The dataset contains {df.shape[1]} columns.")

print("\nThe columns available in the dataset are:\n")
for column in df.columns:
    print("-", column)

print("\n========== BASIC DATA ANALYSIS ==========")

print("\nThe average price of all smartphones in the dataset is :₹",round(df["Price_INR"].mean(), 2))
print("\nThe average rating of all smartphones in the dataset is :",round(df["Avg_Rating"].mean(), 2))
print("\nThe highest smartphone price in the dataset is :₹",df["Price_INR"].max())
print("\nThe lowest smartphone price in the dataset is :₹",df["Price_INR"].min())
print("\nThe highest smartphone rating in the dataset is :",round(df["Avg_Rating"].max(), 2))
print("\nThe lowest smartphone rating in the dataset is :",round(df["Avg_Rating"].min(), 2))
print("\nThe oldest smartphone launch year in the dataset is :",df["Launch_Year"].min())
print("\nThe latest smartphone launch year in the dataset is :",df["Launch_Year"].max())

print("\n========== BRAND ANALYSIS ==========")

print("\nThe total number of smartphone brands in the dataset is:",df["Brand"].nunique())

print("\nThe smartphone brands available in the dataset are:\n")
for brand in sorted(df["Brand"].unique()):
    print("-", brand)

top_brands = df["Brand"].value_counts().head(5)
print("\nThe Top 5 Most Common Smartphone Brands are:\n")
for brand, count in top_brands.items():
    print(f"{brand} : {count} smartphones")

print("\n========== BRAND PRICE ANALYSIS ==========")

brand_price = df.groupby("Brand")["Price_INR"].mean()
print("\nThe average smartphone price for each brand is:\n")
for brand, price in brand_price.sort_values(ascending=False).items():
    print(f"{brand} : ₹{price:.2f}")

print("\n========== BRAND RATING ANALYSIS ==========")

brand_rating = df.groupby("Brand")["Avg_Rating"].mean()
print("\nThe average rating for each smartphone brand is:\n")
for brand, rating in brand_rating.sort_values(ascending=False).items():
    print(f"{brand} : {rating:.2f}⭐")


print("\n========== STORAGE VS PRICE ANALYSIS ==========")

storage_count = df["Storage_GB"].value_counts().sort_index()
print("\nThe number of smartphones in each storage category is:\n")
for storage, count in storage_count.items():
    print(f"{storage} GB Storage : {count} smartphones")

storage_price = df.groupby("Storage_GB")["Price_INR"].mean().round(2)
print("\nThe average smartphone price for each storage category is:\n")
for storage, price in storage_price.items():
    print(f"{storage} GB Storage : ₹{price}")

print("\n========== CAMERA VS PRICE ANALYSIS ==========")

camera_price = df.groupby("Back_Camera_MP")["Price_INR"].mean().round(2)
print("\nThe average smartphone price for each back camera category is:\n")
for camera, price in camera_price.items():
    print(f"{camera} MP Camera : ₹{price}")

print("\n========== PROCESSOR ANALYSIS ==========")

processor_count = df["Processor"].value_counts().head(10)
print("\nThe top 10 most common processors are:\n")
for processor, count in processor_count.items():
    print(f"{processor} : {count} smartphones")


print("\n========== SPECIAL SMARTPHONES ==========")

most_expensive = df.loc[df["Price_INR"].idxmax()]
highest_rated = df.loc[df["Avg_Rating"].idxmax()]

print("\nThe highest rated smartphone is:")
print(highest_rated["Brand"], "-", highest_rated["Model_Name"])
print("Rating:", highest_rated["Avg_Rating"])

most_reviewed = df.loc[df["Total_Reviews"].idxmax()]

print("\nThe most reviewed smartphone is:")
print(most_reviewed["Brand"], "-", most_reviewed["Model_Name"])
print("Reviews:", most_reviewed["Total_Reviews"])


print("\n========== SMARTPHONE PRICE EVOLUTION ANALYSIS ==========")

print("\nThis analysis shows the average smartphone price for each launch year.\n")
for year, price in brand_price.items():
    print(f"In {year}, the average smartphone price was ₹{price}")
print("\nObservation:")
print("The highest average smartphone price was recorded in 2025.")
print("The lowest average smartphone price was recorded in 2020.")

print("\n========== RAM EVOLUTION ANALYSIS ==========")

print("\nThis analysis shows how smartphone RAM capacity has evolved over the years.\n")
for year, ram in year_ram.items():
    print(f"In {year}, the average RAM capacity was {ram} GB")
print("\nObservation:")
print("The average RAM increased from 3.88 GB in 2018 to 8.43 GB in 2025.")


print("\n========== VALUE FOR MONEY BRANDS ==========\n")

df["Value_Score"] = (df["Avg_Rating"] * 1000) / df["Price_INR"]*100

value_brand = df.groupby("Brand")["Value_Score"].mean().round(4)
for brand, score in value_brand.sort_values(ascending=False).items():
    print(f"{brand} : {score}")

best_value = df.loc[df["Value_Score"].idxmax()]
print("\nThe best value smartphone is:")
print(best_value["Brand"], "-", best_value["Model_Name"])
print("Value Score:", round(best_value["Value_Score"],4))

print("\n========== MOST POPULAR BRANDS ==========\n")
brand_reviews = df.groupby("Brand")["Total_Reviews"].sum()
for brand, reviews in brand_reviews.sort_values(ascending=False).head(10).items():
    print(f"{brand} : {reviews} reviews")


print("\n========== TRUSTED BRAND RATINGS ==========\n")
brand_count = df["Brand"].value_counts()
brand_rating_df = df.groupby("Brand")["Avg_Rating"].mean()
for brand in brand_count.index:
    if brand_count[brand] >= 20:
        print(f"{brand} : {brand_rating_df[brand]:.2f} ⭐ ({brand_count[brand]} phones)")

print("\n========== TOP 5 MOST EXPENSIVE PHONES ==========\n")
top_expensive = df.nlargest(5, "Price_INR")
for _, row in top_expensive.iterrows():
    print(f"{row['Brand']} - {row['Model_Name']} : ₹{row['Price_INR']}")

print("\n========== TOP RATED SMARTPHONES ==========\n")
top_rated = df.nlargest(5, "Avg_Rating")
for _, row in top_rated.iterrows():
    print(f"{row['Brand']} - {row['Model_Name']} : {row['Avg_Rating']}⭐")

    
print("\n========== FINAL INSIGHTS ==========")

print("\n1. Apple is the most expensive smartphone brand in the dataset.")
print("\n2. ASUS has the highest average rating among all brands.")
print("\n3. Smartphone RAM increased from 3.88 GB in 2018 to 8.43 GB in 2025.")
print("\n4. Storage capacity shows a strong positive relationship with smartphone prices.")
print("\n5. Apple generated the highest customer engagement with 53,924 reviews.")
print("\n6. iQOO Z6 Lite achieved the highest value score in the dataset.")
