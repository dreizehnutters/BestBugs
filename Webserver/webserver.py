from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from flask_restful import Api, Resource, reqparse, fields, marshal
import json
import functools
import shelve
import os
from datetime import datetime, timezone
import platform

platform = platform.system()

app = Flask(__name__, static_folder='/webapp/build/static', template_folder='webapp/build')

# allow cors access to all resources on the server
CORS(app, resources=r'/*', allow_headers='Content-Type')

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


@app.route('/demo/', defaults={'path': ''}, methods=['GET'])
@app.route('/demo/<path:path>', methods=['GET'])
def demo_app(path):
    #log.warning('Loading from path: ' + str(path) + ' ' + str(os.getcwd()) + ' ' + str(os.path.dirname(os.path.abspath(__file__))))
    demo_path = "webapp/build"
    #log.warning(demo_path)

    if path and os.path.exists(os.path.join(demo_path, path)):
        return send_from_directory(demo_path, path)
    else:
        #log.warning('files in path does not exist: ' + demo_path)
        return send_from_directory(demo_path, 'index.html')


class RootAPI(Resource):
    @shelve_db_decorator
    def get(self):
        return shelve_db['test']


class CurrentDataAPI(Resource):
    def get(self):
        current_temp = 30.2
        current_moisture = 80

        data = {'current_temp': current_temp, 'current_moisture': current_moisture}

        return jsonify(data)


class HistoricalDataAPI(Resource):
    @shelve_db_decorator
    def get(self):
        container_id = '1'

        hist_temp = shelve_db['containers'][container_id]['historical_data']['temp_history']
        hist_moist = shelve_db['containers'][container_id]['historical_data']['moisture_history']

        data = {'hist_temp': hist_temp, 'hist_moist': hist_moist}

        return jsonify(data)


class FeedAPI(Resource):
    @shelve_db_decorator
    def get(self):
        jsonify
        pass

    @shelve_db_decorator
    def post(self):
        data = request.get_json()
        pass


class ContainerListAPI(Resource):
    # get list of containers with all data
    @shelve_db_decorator
    def get(self):
        return(jsonify(list(shelve_db['containers'].keys())))

    # add new container
    @shelve_db_decorator
    def post(self):
        new_key = str(request.get_json()["name"])
        shelve_db['containers'][new_key] = {}
        shelve_db['containers'][new_key]['historical_data'] = {'temp_history' : [], 'moisture_history': [] } 



"""
curl -i -H "Content-Type: application/json" -X POST -d '{"current_temp": 555511115666, "current_moisture": 555511115123}' 0.0.0.0:8000/containers/2
"""


class ContainerAPI(Resource):
    # get container data
    @shelve_db_decorator
    def get(self, container_id):
        return json.dumps(shelve_db['containers'][container_id])

    # post sensor data
    @shelve_db_decorator
    def post(self, container_id):
        cur_data = request.get_json()
        
        shelve_db['containers'][container_id]['current_data'] = cur_data

        hist_data = shelve_db['containers'][container_id]['historical_data']

        if platform != 'Windows':
            cur_time = datetime.now(timezone.utc).strftime("%d.%m.%Y %H:%M:%s")
        else:
            cur_time = datetime.now(timezone.utc).strftime("%d.%m.%Y %H:%M")

        hist_data['temp_history'].append([cur_time, cur_data['current_temp']])
        hist_data['moisture_history'].append([cur_time, cur_data['current_moisture']])
        
        shelve_db['containers'][container_id]['historical_data'] = hist_data


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
