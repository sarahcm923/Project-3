# Dependencies
from bs4 import BeautifulSoup as BS
import requests
import pymongo
import pandas as pd

def data():
    #load in CSV
    review_file = "winemag-data-130k-v2.csv"
    review_df = pd.read_csv(review_file)

    # cut down dataset to ~10k rows
    short_df = review_df[:-120000]
    short_df = short_df.dropna(subset=['price'])
    short_df = short_df.drop('Unnamed: 0', axis=1)

    return short_df.to_json(orient ='records')