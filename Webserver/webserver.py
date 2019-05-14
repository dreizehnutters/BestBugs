from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_restful import Api, Resource, reqparse, fields, marshal
import json


app = Flask(__name__)

# allow cors access to all resources on the server
CORS(app, resources=r'/*', allow_headers='Content-Type')

api = Api(app)


@app.route('/')
def hello_world():
    return 'Hello, World!'


class CurrentDataAPI(Resource):
    def get(self):
        current_temp = 30.2
        current_moisture = 80

        data = {'current_temp': current_temp, 'current_moisture': current_moisture}

        return jsonify(data)


class HistoricalDataAPI(Resource):
    def get(self):
        time = [0, 1, 2, 3, 4, 5, 6, 7]
        temp = [25, 26, 25.8, 27.0, 28.3, 29, 30.3, 31]
        moisture = [80, 75, 70, 74, 80, 85, 90, 92]

        data = {'time': time, 'temp': temp, 'moisture': moisture}

        return jsonify(data)


class FeedAPI(Resource):
    def get(self):
        pass

    def post(self):
        data = request.get_json()
        print(json.dumps(data))

        pass


api.add_resource(CurrentDataAPI, '/current_data', endpoint='current_data')
api.add_resource(HistoricalDataAPI, '/historical_data', endpoint='historical_data')
api.add_resource(FeedAPI, '/feed', endpoint='feed')


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port='8000')
