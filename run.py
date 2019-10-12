from flask import Flask, request, jsonify
from flask_restful import Resource, Api, reqparse, abort
from flask_cors import CORS
from database import testDB
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
import os
import json

app = Flask(__name__)
api = Api(app)
CORS(app)

# Login(Resource) verifies user's code
class LogIn(Resource):
    def post(self):
        return testDB.verify(request.json['email'], request.json['code'])

# SendCode(Resource) sends a unique code to user
#  user already exists == update the code
#  user does not exist == add new user

class SendCode(Resource):
    def post(self):
        print("HERE")
        print(request.json)
        email = request.json['email']
        print(request.json)
        code = testDB.updateUser(email)

        message = Mail(
            from_email='swipesharetufts@gmail.com',
            to_emails=str(email),
            subject='Your Login Code for Swipe Share',
            html_content='Here is your code: ' + str(code) + '<br>This is an automated message. Please do not reply to this email.</br>')
        try:
            sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
            response = sg.send(message)
            print(response.status_code)
            print(response.body)
            print(response.headers)
            return 200
        except Exception as e:
            print(e.message)
    
        return 403

class GetUsers(Resource):
    def get(self):
        return {'users': testDB.getUsers()}

class GetUserSwipes(Resource):
    def post(self):
        email = request.json['email']
        (giving, receiving) = testDB.getUserSwipes(email)
        toReturn = {
            'giving': giving,
            'receiving': receiving
        }
        return toReturn

class DeleteEntry(Resource):
    def post(self):
        theID = request.json['id']
        testDB.removeByID(theID)
        return 

class GetEntries(Resource):
    def get(self):
        return {'entries': testDB.getEntries()}

class MakeRequest(Resource):
    def post(self):
        targetID = request.json['id']
        receiver_email = request.json['receiver_email']
        testDB.makeRequest(targetID, receiver_email)

class AddEntry(Resource):
    def post(self):
        new_entry = {
            "giver_email": request.json['giver_email'],
            "receiver_email": "",
            "location": request.json['location'],
            "time": request.json['time']
        }

        testDB.addEntry(new_entry)
        return

class FindEntry(Resource):
    def put(self):
        entry = {"giver_email":request.json['giver_email'],
                 "location": request.json['location'],
                 "time": request.json['time']
            }
        
        receiver = { "receiver_email": request.json['receiver_email'] }
        testDB.modifyEntry(entry, receiver)
        return

class DeleteUsers(Resource):
    def post(self):
        testDB.deleteUsers()
        return

class DeleteEntries(Resource):
    def post(self):
        testDB.deleteEntries()
        return

api.add_resource(LogIn, '/login')
api.add_resource(SendCode, '/sendcode')
api.add_resource(GetUsers, '/getusers')
api.add_resource(GetUserSwipes, '/getuserswipes')
api.add_resource(GetEntries, '/')
api.add_resource(AddEntry, '/addentry')
api.add_resource(DeleteEntry, '/deleteentry')
api.add_resource(MakeRequest, '/makerequest')
api.add_resource(FindEntry, '/findentry')
api.add_resource(DeleteUsers, '/deleteusers')
api.add_resource(DeleteEntries, '/deleteentries')

if __name__ == '__main__':
    app.run()