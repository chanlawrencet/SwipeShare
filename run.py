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

class AddUser(Resource):
    def post(self):
        new_user = {
            "email": request.json['email'],
        }

        testDB.addUser(new_user)
        return

class GetEntries(Resource):
    def get(self):
        return {'entries': testDB.getEntries()}

class AddEntry(Resource):
    def post(self):
        new_entry = {
            "giver_email": request.json['giver_email'],
            "receiver_email": request.json['receiver_email'],
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

class DeleteEntries(Resource):
    def post(self):
        testDB.deleteEntries()
        return

class SendEmail(Resource):
    def get(self):
        message = Mail(
            from_email='toni.imonaco@tufts.edu',
            to_emails='lulu.zheng@tufts.edu',
            subject='Important Update',
            html_content='I am so sorry to inform you that there has been another incident of hate crime')
        try:
            sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
            response = sg.send(message)
            print(response.status_code)
            print(response.body)
            print(response.headers)
        except Exception as e:
            print(e.message)
    
        return

api.add_resource(GetEntries, '/')
# api.add_resource(AddUser, '/adduser')
# api.add_resource(AddEntry, '/addentry')
# api.add_resource(FindEntry, '/findentry')
# api.add_resource(DeleteEntries, '/deleteentries')
# api.add_resource(SendEmail, '/sendemail')

if __name__ == '__main__':
    app.run()