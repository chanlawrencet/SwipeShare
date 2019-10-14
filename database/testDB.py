from flask import Flask
from flask_pymongo import PyMongo
import os
import random
from bson.objectid import ObjectId
import datetime
import pytz

app = Flask(__name__)
MONGO_URL = os.environ.get('MONGODB_URI')
app.config["MONGO_URI"] = MONGO_URL
# app.config["MONGO_URI"] = 'mongodb://localhost:27017/testDB'
mongo = PyMongo(app)


def removeByID(targetID):
    mongo.db.entries.delete_one({"_id": ObjectId(str(targetID))})
    return
    
def makeRequest(targetID, email):
    print('email:')
    writeR = mongo.db.entries.update({"_id": ObjectId(str(targetID))}, {'$set': {"receiver_email" : str(email)}})

    return "200", 200

        
def verify(email, code):
    users = mongo.db.users
    correct_users = (users.find({"email": email},{'code': 1}))
    correct_code = ''
    for x in correct_users:
        correct_code = str(x['code'])
    print(correct_code)
    if (correct_code == str(code)):
        return correct_code, 200
    else:
        return code, 403

def updateUser(email):
    code = random.randint(100000,999999)
    users = mongo.db.users
    
    print(email)
    print(users.find({"email": email}).count())

    if (users.find({"email": email}).count() != 0):
        users.update_one({"email": email},{ '$set': {"code":code} })
        print("User already exists")
    else:
        print("User does not exist")
        new_user = {
            "email": email,
            "code": code
        }
        users.insert_one(new_user)
    
    return code

def getUserSwipes(email):
    currentTimeUnknown = datetime.datetime.now()
    timezone = pytz.timezone("America/New_York")
    currentTimeKnown = timezone.localize(currentTimeUnknown)
    currentTimeString = str(currentTimeKnown.isoformat()[:23]) + 'Z'



    allGivingC = list(mongo.db.entries.find({"giver_email" : email}).sort('time', 1))
    allGiving = []
    for content in allGivingC:
        if currentTimeString <= content['time']:
            ele = {
                'id': str(content['_id']), 
                'location': content['location'],
                'time': content['time'],
                'past': False
            }
            allGiving.append(ele)
        else:
            ele = {
                'id': str(content['_id']), 
                'location': content['location'],
                'time': content['time'],
                'past': True
            }
            allGiving.append(ele)
    allReceivingC = list(mongo.db.entries.find({"receiver_email" : email}).sort('time', 1))
    allReceiving = []
    for content in allReceivingC:
        if currentTimeString <= content['time']:
            ele = {
                'id': str(content['_id']), 
                'location': content['location'],
                'time': content['time'],
                'past': False
            }
            allReceiving.append(ele)
        else:
            ele = {
                'id': str(content['_id']), 
                'location': content['location'],
                'time': content['time'],
                'past': True
            }
            allGiving.append(ele)

    return allGiving, allReceiving

def getUsers():
    contents = list(mongo.db.users.find())
    returnList = []
    for content in contents:
        ele = {'email': content['email'], 
               'code': content['code']}
        returnList.append(ele)
    return returnList

def getEntries():
    currentTimeUnknown = datetime.datetime.now()
    timezone = pytz.timezone("America/New_York")
    currentTimeKnown = timezone.localize(currentTimeUnknown)
    currentTimeString = str(currentTimeKnown.isoformat()[:23]) + 'Z'

    contents = list(mongo.db.entries.find().sort('time', 1))
    returnList = []
    for content in contents:
        print(content)
        if currentTimeString <= content['time'] and content['receiver_email'] == '':
            ele = {'id': str(content['_id']), 
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

def deleteUsers():
    entries = mongo.db.users
    entries.remove()

    return

def deleteEntries():
    entries = mongo.db.entries
    entries.remove()

    return