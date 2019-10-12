from flask import Flask, request, jsonify
from flask_restful import Resource, Api, reqparse, abort
from database import testDB
import json

app = Flask(__name__)
api = Api(app)
parser = reqparse.RequestParser()
parser.add_argument('first', type=str)
parser.add_argument('last', type=str)
parser.add_argument('email', type=str)
parser.add_argument('date', type=str)
parser.add_argument('time', type=str)
parser.add_argument('location', type=str)

# look I'm a comment

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

api.add_resource(GetEntries, '/')
api.add_resource(AddUser, '/adduser')
api.add_resource(AddEntry, '/addentry')
api.add_resource(FindEntry, '/findentry')
api.add_resource(DeleteEntries, '/deleteentries')

if __name__ == '__main__':
    app.run(debug=True)