from flask import Flask
from flask_pymongo import PyMongo
import os

app = Flask(__name__)
MONGO_URL = os.environ.get('MONGODB_URI')
app.config["MONGO_URI"] = MONGO_URL
# app.config["MONGO_URI"] = 'mongodb://localhost:27017/testDB'
mongo = PyMongo(app)

def addUser(new_user):
    users = mongo.db.users
    users.insert_one(new_user)

    return

def getEntries():
    contents = list(mongo.db.entries.find())
    returnList = []
    for content in contents:
        if content['receiver_email'] == '':
            ele = {'giver_email': content['giver_email'], 
                'receiver_email': content['receiver_email'],
                'location': content['location'],
                'time': content['time']}
            returnList.append(ele)
    return returnList

def addEntry(new_entry):
    entries = mongo.db.entries
    entries.insert_one(new_entry)

    return

# (def modifyEntry) this function adds the receiver email to entry
def modifyEntry(entry, receiver):
    entries = mongo.db.entries
    entries.update_one(entry,{ '$set': receiver })

    return

def deleteEntries():
    entries = mongo.db.entries
    entries.remove()

    return