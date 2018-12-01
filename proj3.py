import pandas as pd

from flask import (
    Flask,
    render_template,
    jsonify)

from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

# The database URI
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///wine_review.sqlite"

db = SQLAlchemy(app)

# Create database tables
@app.before_first_request
def setup():
    # Recreate database each time for demo
    #db.drop_all()
    db.create_all()


@app.route("/")
def home():

    # Find data
    review_data = SQLAlchemy.db.wine_review.find_one()
    print(review_data)
    # return template and data
    return render_template("index.html", review_data = review_data)

if __name__ == '__main__':
    app.run(debug=True)
