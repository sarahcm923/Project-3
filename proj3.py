from flask import Flask, render_template, redirect, jsonify
from flask_pymongo import PyMongo
import wine_data
import json

# create instance of Flask app
app = Flask(__name__)

# Use flask_pymongo to set up mongo connection
app.config["MONGO_URI"] = "mongodb://localhost:27017/wine_app"
mongo = PyMongo(app)

data = wine_data.data()


# list of unique country names
pythonlist = json.loads(data)
countrylist = []
for x in pythonlist:
    name = x['country']
    if (not name in countrylist and name != None):
        countrylist.append(name)

countrylist.sort()
#data = data.replace("'", r"\'")
data = {'data':data}
#print(data)
mongo.db.wine_review.drop()
mongo.db.wine_review.insert_one(data)

@app.route("/")
def home():

    # Find data
    review_data = mongo.db.wine_review.find_one()
    #print(review_data)
    # return template and data
    return render_template("index.html", review_data = review_data, uniq_list = countrylist)

@app.route("/data")
def data_load():

    # Find data
    review_data = mongo.db.wine_review.find_one()
    # print(review_data["ObjectId"])
    #review_data = json.dumps(review_data)
    # return template and data
    #print(review_data)
    return jsonify(review_data['data'])
    #return review_data

if __name__ == '__main__':
    app.run(debug=True)
