from flask import Flask, request
import time
from flask_cors import CORS, cross_origin
import json

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

logs = []

def getLogs(timestamp):
    global logs
    ans = [t[0] for t in logs if t[1] > int(timestamp)]
    res = {}
    res['ans'] = ','.join(ans[::-1])
    return json.dumps(res)


@app.route('/register',methods = ['POST'])
def register():
    global logs
    content = request.form['content']
    timestamp = request.form['timestamp']
    logs.append([content,int(time.time())])
    if len(logs) > 10:
        logs = logs[len(logs)-10:len(logs)]
    return getLogs(int(int(timestamp)/1000))

@app.route('/log',methods = ['GET'])
def log():
    global logs
    timestamp = request.args.get('timestamp')
    return getLogs(int(int(timestamp)/1000))

if __name__ == '__main__':
    app.run()
