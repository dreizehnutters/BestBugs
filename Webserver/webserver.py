from flask import Flask
from flask_restful import Api, Resource, reqparse, fields, marshal
import json
import functools
import shelve


app = Flask(__name__)
api = Api(app)


api.app.config['DATABASE'] = 'database_shelve'


def shelve_db_decorator(func):
    @functools.wraps(func)
    def inner(*args, **kwargs):
        global shelve_db  # global is necessary, otherwise func can't see shelve_db
        # opens and closes shelve database automatically even if an exception is raised
        with shelve.open(api.app.config['DATABASE'], writeback=True) as shelve_db:
            rv = func(*args, **kwargs)
        return rv
    return inner


class RootAPI(Resource):
    @shelve_db_decorator
    def get(self):
        return shelve_db['test']


class CurrentDataAPI(Resource):
    def get(self):
        current_temp = 30.2
        current_moisture = 80

        data = {'current_temp': current_temp, 'current_moisture': current_moisture}

        return json.dumps(data)


class HistoricalDataAPI(Resource):
    def get(self):
        time = [0, 1, 2, 3, 4, 5, 6, 7]
        temp = [25, 26, 25.8, 27.0, 28.3, 29, 30.3, 31]
        moisture = [80, 75, 70, 74, 80, 85, 90, 92]

        data = {'time': time, 'temp': temp, 'moisture': moisture}

        return json.dumps(data)


class FeedAPI(Resource):
    def get(self):
        pass

    def post(self):
        pass


class ContainerListAPI(Resource):
    # get list of containers with all data
    def get(self):
        pass

    # add new container
    def post(self):
        pass


class ContainerAPI(Resource):
    # get container data
    def get(self, container_id):
        pass

    # post sensor data
    def post(self, container_id):
        pass

    # delete container
    def delete(self, container_id):
        pass


api.add_resource(RootAPI, '/', endpoint='/')
api.add_resource(CurrentDataAPI, '/current_data', endpoint='current_data')
api.add_resource(HistoricalDataAPI, '/historical_data', endpoint='historical_data')
api.add_resource(FeedAPI, '/feed', endpoint='feed')
api.add_resource(ContainerListAPI, '/containers', endpoint='containers')
api.add_resource(ContainerAPI, '/containers/<container_id>', endpoint='container')


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port='8000')
