import os
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns


# =========================================================
# BASIC SETTINGS
# =========================================================

sns.set_theme(style="whitegrid")

DATA_FILE = "mobile_phone_dataset.xlsx"
CHART_FOLDER = "charts"


# =========================================================
# HELPER FUNCTIONS
# =========================================================

def print_header(title):
    print("\n" + "=" * 70)
    print(title)
    print("=" * 70)


def money(value):
    return f"₹{value:,.2f}"


def clean_float(value):
    return round(float(value), 2)


def make_chart_folder():
    if not os.path.exists(CHART_FOLDER):
        os.makedirs(CHART_FOLDER)


def save_chart(filename):
    make_chart_folder()
    plt.tight_layout()
    plt.savefig(os.path.join(CHART_FOLDER, filename), dpi=300, bbox_inches="tight")
    plt.show()
    plt.close()


def load_dataset():
    if not os.path.exists(DATA_FILE):
        raise FileNotFoundError(
            f"The file '{DATA_FILE}' was not found in the current folder."
        )

    if DATA_FILE.lower().endswith(".csv"):
        df = pd.read_csv(DATA_FILE)
    else:
        df = pd.read_excel(DATA_FILE)

    return df


# =========================================================
# DATA OVERVIEW
# =========================================================

def dataset_overview(df):
    print_header("DATASET LOADED SUCCESSFULLY")

    print("\nThe shape of the dataset is:", df.shape)
    print(f"\nThe dataset contains {df.shape[0]} smartphone records.")
    print(f"The dataset contains {df.shape[1]} columns.")

    print("\nThe columns available in the dataset are:\n")
    for column in df.columns:
        print("-", column)

    print("\nThe first 5 rows of the dataset are:")
    print(df.head())

    print("\nThe data types of the dataset are:")
    print(df.dtypes)

    print("\nObservation:")
    print("This dataset looks clean and ready for analysis.")
    print("It contains both numeric and text columns, which is useful for data analysis.")


# =========================================================
# BASIC ANALYSIS
# =========================================================

def basic_analysis(df):
    print_header("BASIC DATA ANALYSIS")

    avg_price = clean_float(df["Price_INR"].mean())
    avg_rating = clean_float(df["Avg_Rating"].mean())
    highest_price = df["Price_INR"].max()
    lowest_price = df["Price_INR"].min()
    highest_rating = clean_float(df["Avg_Rating"].max())
    lowest_rating = clean_float(df["Avg_Rating"].min())
    oldest_year = df["Launch_Year"].min()
    latest_year = df["Launch_Year"].max()

    print("\nThe average price of all smartphones in the dataset is:", money(avg_price))
    print("The average rating of all smartphones in the dataset is:", avg_rating)
    print("The highest smartphone price in the dataset is:", money(highest_price))
    print("The lowest smartphone price in the dataset is:", money(lowest_price))
    print("The highest smartphone rating in the dataset is:", highest_rating)
    print("The lowest smartphone rating in the dataset is:", lowest_rating)
    print("The oldest smartphone launch year in the dataset is:", oldest_year)
    print("The latest smartphone launch year in the dataset is:", latest_year)

    print("\nObservation:")
    print("The dataset contains both budget phones and premium phones.")
    print("The rating range is small, which means most phones are rated positively.")


# =========================================================
# BRAND ANALYSIS
# =========================================================

def brand_analysis(df):
    print_header("BRAND ANALYSIS")

    total_brands = df["Brand"].nunique()
    print("\nThe total number of smartphone brands in the dataset is:", total_brands)

    print("\nThe smartphone brands available in the dataset are:\n")
    brands_list = sorted(df["Brand"].unique())
    print(", ".join(brands_list))

    top_brands = df["Brand"].value_counts().head(5)

    print("\nThe top 5 most common smartphone brands are:\n")
    for brand, count in top_brands.items():
        print(f"{brand} : {count} smartphones")

    print("\nObservation:")
    print("Apple has the highest number of smartphone entries in the dataset.")
    print("The dataset contains a good mix of premium, mid-range, and budget brands.")


# =========================================================
# BRAND PRICE AND RATING ANALYSIS
# =========================================================

def brand_price_rating_analysis(df):
    print_header("BRAND PRICE ANALYSIS")

    brand_count = df["Brand"].value_counts()
    brand_price = df.groupby("Brand")["Price_INR"].mean().sort_values(ascending=False)

    print("\nThe average smartphone price for each brand is:\n")
    for brand, price in brand_price.items():
        print(f"{brand} : {money(price)} ({brand_count[brand]} phones)")

    print("\nObservation:")
    print("Apple is the most expensive brand on average.")
    print("Budget brands like Karbonn, Lava, and Micromax have much lower average prices.")
    print("The number of phones in each brand also helps us understand how strong the sample size is.")

    print_header("BRAND RATING ANALYSIS")

    brand_rating = df.groupby("Brand")["Avg_Rating"].mean().sort_values(ascending=False)

    print("\nThe average rating for each smartphone brand is:\n")
    for brand, rating in brand_rating.items():
        print(f"{brand} : {clean_float(rating)}⭐ ({brand_count[brand]} phones)")

    print("\nObservation:")
    print("ASUS has the highest average rating in this dataset.")
    print("High price does not always mean the highest rating.")
    print("Brands with more phones in the dataset give a more reliable comparison.")

    return brand_price, brand_rating


# =========================================================
# RELATIONSHIP ANALYSIS
# =========================================================

def relationship_analysis(df):
    print_header("RAM VS PRICE ANALYSIS")

    ram_count = df["RAM_GB"].value_counts().sort_index()
    print("\nThe number of smartphones in each RAM category is:\n")
    for ram, count in ram_count.items():
        print(f"{ram} GB RAM : {count} smartphones")

    ram_price = df.groupby("RAM_GB")["Price_INR"].mean().round(2)
    print("\nThe average smartphone price for each RAM category is:\n")
    for ram, price in ram_price.items():
        print(f"{ram} GB RAM : {money(price)}")

    print("\nObservation:")
    print("Higher RAM usually increases smartphone price, but the relationship is not perfectly linear.")
    print("Brand value and phone category also affect the final price.")

    print_header("STORAGE VS PRICE ANALYSIS")

    storage_count = df["Storage_GB"].value_counts().sort_index()
    print("\nThe number of smartphones in each storage category is:\n")
    for storage, count in storage_count.items():
        print(f"{storage} GB Storage : {count} smartphones")

    storage_price = df.groupby("Storage_GB")["Price_INR"].mean().round(2)
    print("\nThe average smartphone price for each storage category is:\n")
    for storage, price in storage_price.items():
        print(f"{storage} GB Storage : {money(price)}")

    print("\nObservation:")
    print("Storage has a strong positive relationship with smartphone price.")
    print("This is one of the clearest patterns in the dataset.")

    print_header("CAMERA VS PRICE ANALYSIS")

    camera_price = df.groupby("Back_Camera_MP")["Price_INR"].mean().round(2)
    print("\nThe average smartphone price for each back camera category is:\n")
    for camera, price in camera_price.items():
        print(f"{camera} MP Camera : {money(price)}")

    print("\nObservation:")
    print("Camera megapixels alone do not fully explain smartphone price.")
    print("Other factors like brand, processor, storage, and launch year also matter.")

    print_header("SMARTPHONE PRICE EVOLUTION ANALYSIS")

    year_price = df.groupby("Launch_Year")["Price_INR"].mean().round(2)
    print("\nThis analysis shows how the average smartphone price changed over the years.\n")
    for year, price in year_price.items():
        print(f"In {year}, the average smartphone price was {money(price)}")

    print("\nObservation:")
    print("Smartphone prices do not increase in a straight line every year.")
    print("The yearly average price depends on the mix of brands and phone types in that year.")

    print_header("RATING EVOLUTION ANALYSIS")

    year_rating = df.groupby("Launch_Year")["Avg_Rating"].mean().round(2)
    print("\nThis analysis shows how the average smartphone rating changed over the years.\n")
    for year, rating in year_rating.items():
        print(f"In {year}, the average smartphone rating was {rating}")

    print("\nObservation:")
    print("The average rating stays in a narrow range across years.")
    print("This means users usually rate smartphones positively, no matter the launch year.")

    print_header("RAM TREND ANALYSIS")

    year_ram = (
        df.groupby("Launch_Year")["RAM_GB"]
          .agg(lambda x: x.mode().iloc[0] if not x.mode().empty else x.iloc[0])
    )

    print("\nThis analysis shows the most common RAM capacity used in smartphones for each launch year.\n")
    for year, ram in year_ram.items():
        print(f"In {year}, the most common RAM capacity was {ram} GB")

    print("\nObservation:")
    print("The most common RAM capacity has increased over the years.")
    print("This shows that smartphone performance and multitasking capabilities have improved significantly.")

    print_header("STORAGE TREND ANALYSIS")

    year_storage = (
        df.groupby("Launch_Year")["Storage_GB"]
          .agg(lambda x: x.mode().iloc[0] if not x.mode().empty else x.iloc[0])
    )

    print("\nThis analysis shows the most common storage capacity used in smartphones for each launch year.\n")
    for year, storage in year_storage.items():
        print(f"In {year}, the most common storage capacity was {storage} GB")

    print("\nObservation:")
    print("The most common storage capacity has increased steadily over the years.")
    print("This reflects the growing need for larger applications, photos, videos, and files.")

    print_header("PRICE CATEGORY ANALYSIS")

    budget = len(df[df["Price_INR"] < 15000])
    midrange = len(df[(df["Price_INR"] >= 15000) & (df["Price_INR"] < 40000)])
    premium = len(df[df["Price_INR"] >= 40000])

    price_categories = pd.Series({
        "Budget Smartphones (< ₹15,000)": budget,
        "Mid-Range Smartphones (₹15,000 - ₹40,000)": midrange,
        "Premium Smartphones (> ₹40,000)": premium
    })

    print("\nBudget Smartphones (< ₹15,000):", budget)
    print("Mid-Range Smartphones (₹15,000 - ₹40,000):", midrange)
    print("Premium Smartphones (> ₹40,000):", premium)

    largest_category = price_categories.idxmax()

    print("\nObservation:")
    print(f"{largest_category} represent the largest category in the dataset.")
    print("This shows that the dataset has a good balance of budget, mid-range, and premium phones.")

    return year_price, year_ram, year_storage, year_rating, ram_price, storage_price, camera_price, price_categories


# =========================================================
# PROCESSOR ANALYSIS
# =========================================================

def processor_analysis(df):
    print_header("PROCESSOR ANALYSIS")

    processor_count = df["Processor"].value_counts().head(10)

    print("\nThe top 10 most common processors are:\n")
    for processor, count in processor_count.items():
        print(f"{processor} : {count} smartphones")

    print("\nObservation:")
    print("Budget and mid-range processors appear more often in the dataset.")
    print("This means the dataset has a strong mix of affordable and premium smartphones.")


# =========================================================
# MOST POPULAR BRANDS
# =========================================================

def popularity_analysis(df):
    print_header("MOST POPULAR BRANDS")

    brand_reviews = df.groupby("Brand")["Total_Reviews"].sum().sort_values(ascending=False)

    print("\nThe top 10 brands by total number of reviews are:\n")
    for brand, reviews in brand_reviews.head(10).items():
        print(f"{brand} : {reviews} reviews")

    print("\nObservation:")
    print("Apple has the highest customer engagement in the dataset.")
    print("Brands with more reviews are usually more visible in the market.")

    return brand_reviews


# =========================================================
# TRUSTED BRAND RATINGS
# =========================================================

def trusted_brand_ratings(df):
    print_header("TRUSTED BRAND RATINGS")

    brand_count = df["Brand"].value_counts()
    brand_rating_df = df.groupby("Brand")["Avg_Rating"].mean().round(2)

    print("\nOnly brands with at least 20 phones are shown below:\n")
    for brand in brand_count.index:
        if brand_count[brand] >= 20:
            print(f"{brand} : {brand_rating_df[brand]:.2f}⭐ ({brand_count[brand]} phones)")

    print("\nObservation:")
    print("This section gives a more trustworthy brand rating comparison.")
    print("Small sample brands can sometimes look better than they really are.")

    return brand_count, brand_rating_df


# =========================================================
# CHARTS
# =========================================================

def create_bar_chart_top_brands_by_price(df):
    print_header("BAR CHART - TOP 10 BRANDS BY AVERAGE PRICE")

    top_10_price = df.groupby("Brand")["Price_INR"].mean().sort_values(ascending=True).tail(10)

    plt.figure(figsize=(12, 7))
    colors = sns.color_palette("viridis", len(top_10_price))
    bars = plt.barh(top_10_price.index, top_10_price.values, color=colors)

    plt.title("Top 10 Smartphone Brands by Average Price", fontsize=16, fontweight="bold")
    plt.xlabel("Average Price (INR)", fontsize=12)
    plt.ylabel("Brand", fontsize=12)

    ax = plt.gca()
    max_val = top_10_price.values.max()
    for bar in bars:
        width = bar.get_width()
        ax.text(width + max_val * 0.01, bar.get_y() + bar.get_height() / 2,
                money(width), va="center", fontsize=9)

    save_chart("top_10_brands_by_average_price.png")

    print("\nThis bar chart shows which brands have the highest average price.")
    print("Apple is usually at the top because it is a premium brand.")


def create_bar_chart_top_brands_by_rating(df):
    print_header("BAR CHART - TOP 10 BRANDS BY AVERAGE RATING")

    top_10_rating = df.groupby("Brand")["Avg_Rating"].mean().sort_values(ascending=True).tail(10)

    plt.figure(figsize=(12, 7))
    colors = sns.color_palette("magma", len(top_10_rating))
    bars = plt.barh(top_10_rating.index, top_10_rating.values, color=colors)

    plt.title("Top 10 Smartphone Brands by Average Rating", fontsize=16, fontweight="bold")
    plt.xlabel("Average Rating", fontsize=12)
    plt.ylabel("Brand", fontsize=12)

    ax = plt.gca()
    max_val = top_10_rating.values.max()
    for bar in bars:
        width = bar.get_width()
        ax.text(width + max_val * 0.01, bar.get_y() + bar.get_height() / 2,
                f"{width:.2f}", va="center", fontsize=9)

    save_chart("top_10_brands_by_average_rating.png")

    print("\nThis bar chart shows which brands receive better average ratings.")
    print("A high rating with a good sample size usually means stronger customer satisfaction.")


def create_bar_chart_top_brands_by_reviews(df):
    print_header("BAR CHART - TOP 10 BRANDS BY REVIEWS")

    brand_reviews = df.groupby("Brand")["Total_Reviews"].sum().sort_values(ascending=True).tail(10)

    plt.figure(figsize=(12, 7))
    colors = sns.color_palette("cool", len(brand_reviews))
    bars = plt.barh(brand_reviews.index, brand_reviews.values, color=colors)

    plt.title("Top 10 Smartphone Brands by Total Reviews", fontsize=16, fontweight="bold")
    plt.xlabel("Total Reviews", fontsize=12)
    plt.ylabel("Brand", fontsize=12)

    ax = plt.gca()
    max_val = brand_reviews.values.max()
    for bar in bars:
        width = bar.get_width()
        ax.text(width + max_val * 0.01, bar.get_y() + bar.get_height() / 2,
                f"{int(width)}", va="center", fontsize=9)

    save_chart("top_10_brands_by_total_reviews.png")

    print("\nThis bar chart shows the brands that got the most customer engagement.")
    print("A higher review count usually means a brand has stronger market presence.")


def create_scatter_plot(df, x, y, title, xlabel, ylabel, filename, color):
    print_header(title.upper())

    plt.figure(figsize=(11, 7))
    sns.regplot(
        data=df,
        x=x,
        y=y,
        scatter_kws={"alpha": 0.55, "s": 60, "color": color},
        line_kws={"color": "black", "linewidth": 2},
        color=color
    )

    plt.title(title, fontsize=16, fontweight="bold")
    plt.xlabel(xlabel, fontsize=12)
    plt.ylabel(ylabel, fontsize=12)

    save_chart(filename)

    corr_value = df[[x, y]].corr().iloc[0, 1]
    print("\nObservation:")
    print(f"The correlation between {xlabel.lower()} and {ylabel.lower()} is {corr_value:.2f}.")
    print("The scatter plot and trend line make the relationship easy to understand.")


def create_heatmap(df):
    print_header("HEATMAP - CORRELATION MATRIX")

    selected_columns = [
        "Launch_Year",
        "RAM_GB",
        "Storage_GB",
        "Price_INR",
        "Battery_mAh",
        "Back_Camera_MP",
        "Front_Camera_MP",
        "Avg_Rating",
        "Total_Reviews"
    ]

    numeric_df = df[selected_columns]
    corr_matrix = numeric_df.corr()

    plt.figure(figsize=(12, 8))
    sns.heatmap(
        corr_matrix,
        annot=True,
        fmt=".2f",
        cmap="YlOrRd",
        linewidths=0.6,
        square=True,
        cbar_kws={"shrink": 0.85}
    )

    plt.title("Correlation Heatmap of Smartphone Features", fontsize=16, fontweight="bold")

    save_chart("correlation_heatmap.png")

    print("\nThis heatmap shows how the numeric columns are related to each other.")
    print("A strong positive correlation means two columns increase together.")
    print("This chart is one of the most useful parts of the project.")


def create_visualizations(df):
    create_bar_chart_top_brands_by_price(df)
    create_bar_chart_top_brands_by_rating(df)
    create_bar_chart_top_brands_by_reviews(df)

    create_scatter_plot(
        df=df,
        x="RAM_GB",
        y="Price_INR",
        title="RAM vs Price",
        xlabel="RAM (GB)",
        ylabel="Price (INR)",
        filename="ram_vs_price.png",
        color="#1f77b4"
    )

    create_scatter_plot(
        df=df,
        x="Storage_GB",
        y="Price_INR",
        title="Storage vs Price",
        xlabel="Storage (GB)",
        ylabel="Price (INR)",
        filename="storage_vs_price.png",
        color="#8e44ad"
    )

    create_scatter_plot(
        df=df,
        x="Back_Camera_MP",
        y="Price_INR",
        title="Back Camera MP vs Price",
        xlabel="Back Camera (MP)",
        ylabel="Price (INR)",
        filename="camera_vs_price.png",
        color="#2ecc71"
    )

    create_scatter_plot(
        df=df,
        x="Launch_Year",
        y="Price_INR",
        title="Launch Year vs Price",
        xlabel="Launch Year",
        ylabel="Price (INR)",
        filename="launch_year_vs_price.png",
        color="#e67e22"
    )

    create_heatmap(df)


# =========================================================
# FINAL INSIGHTS
# =========================================================

def final_insights(brand_price, brand_rating, year_price, year_ram, year_storage, year_rating, brand_reviews, price_categories):
    print_header("FINAL INSIGHTS")

    most_expensive_brand = brand_price.index[0]
    best_rating_brand = brand_rating.index[0]
    most_popular_brand = brand_reviews.index[0]

    highest_price_year = year_price.idxmax()
    lowest_price_year = year_price.idxmin()
    highest_rating_year = year_rating.idxmax()
    lowest_rating_year = year_rating.idxmin()

    first_ram_year = year_ram.index.min()
    last_ram_year = year_ram.index.max()
    first_storage_year = year_storage.index.min()
    last_storage_year = year_storage.index.max()

    largest_category = price_categories.idxmax()

    print(f"\n1. {most_expensive_brand} is the most expensive smartphone brand in the dataset.")
    print(f"2. {best_rating_brand} has the highest average rating among all brands.")
    print(f"3. {most_popular_brand} generated the highest customer engagement with {int(brand_reviews.iloc[0])} reviews.")
    print(f"4. {largest_category} represent the largest price category in the dataset.")
    print(f"5. Smartphone RAM increased from {year_ram.loc[first_ram_year]} GB in {first_ram_year} to {year_ram.loc[last_ram_year]} GB in {last_ram_year}.")
    print(f"6. The most common storage capacity also increased over the years, from {year_storage.loc[first_storage_year]} GB in {first_storage_year} to {year_storage.loc[last_storage_year]} GB in {last_storage_year}.")
    print(f"7. The highest average smartphone price was recorded in {highest_price_year}.")
    print(f"8. The highest average smartphone rating was recorded in {highest_rating_year}.")
    print(f"9. The lowest average smartphone price was recorded in {lowest_price_year}.")
    print(f"10. The lowest average smartphone rating was recorded in {lowest_rating_year}.")

    print("\nFinal Observation:")
    print("The smartphone market is influenced by multiple factors rather than a single specification.")
    print("Storage capacity has a strong impact on pricing, while brand value, processor type, RAM, and launch year also play important roles.")
    print("The analysis shows that premium brands command higher prices, while several budget brands provide strong value for money.")
    print("Overall, this project demonstrates how Python, Pandas, Matplotlib, and Seaborn can be used to study smartphone market trends, customer preferences, and pricing patterns.")


# =========================================================
# MAIN
# =========================================================

def main():
    df = load_dataset()

    print("\nThe dataset file used is:", DATA_FILE)

    dataset_overview(df)
    basic_analysis(df)
    brand_analysis(df)

    brand_price, brand_rating = brand_price_rating_analysis(df)

    (
        year_price,
        year_ram,
        year_storage,
        year_rating,
        ram_price,
        storage_price,
        camera_price,
        price_categories
    ) = relationship_analysis(df)

    processor_analysis(df)
    brand_reviews = popularity_analysis(df)
    brand_count, brand_rating_df = trusted_brand_ratings(df)

    final_insights(
        brand_price,
        brand_rating,
        year_price,
        year_ram,
        year_storage,
        year_rating,
        brand_reviews,
        price_categories
    )

    create_visualizations(df)

if __name__ == "__main__":
    main()
