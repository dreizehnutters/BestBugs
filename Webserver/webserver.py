from flask import Flask
from flask_restful import Api, Resource, reqparse, fields, marshal
import json


app = Flask(__name__)
api = Api(app)


@app.route('/')
def hello_world():
    return 'Hello, World!'


class CurrentDataAPI(Resource):
    def get(self):
        pass

    def post(self):
        pass


class HistoricalDataAPI(Resource):
    def get(self):
        pass


class FeedAPI(Resource):
    def get(self):
        pass


api.add_resource(CurrentDataAPI, '/current_data', endpoint='current_data')
api.add_resource(HistoricalDataAPI, '/historical_data', endpoint='historical_data')
api.add_resource(FeedAPI, '/feed', endpoint='feed')


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port='8000')
