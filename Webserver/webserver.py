from flask import Flask
import json


app = Flask(__name__)


@app.route('/')
def hello_world():
    return 'Hello, World!'


@app.route('/current_data', method = 'GET')
def current_data():
    current_temp = 25.2
    current_moisture =


@app.route('/historical_data')
def historical_data():
    pass


@app.route('/feed')
def feed():
    pass


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port='8000')
