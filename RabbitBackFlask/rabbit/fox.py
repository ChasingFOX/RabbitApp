from flask import Flask, jsonify, request
from flask_mysqldb import MySQL
import os

app = Flask(__name__)

app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = '1234'
app.config['MYSQL_HOST'] = '192.168.2.117'
app.config['MYSQL_DB'] = 'rabbit'
app.config['MYSQL_CURSORCLASS'] = 'DictCursor'

mysql = MySQL(app)

import way

# dict type
waypoints = {
    'waypoint_1': {
        'lat': 0.0,
        'lon': 0.0
    },
    'waypoint_2': {
        'lat': 0.0,
        'lon': 0.0
    },
    'waypoint_3': {
        'lat': 0.0,
        'lon': 0.0
    },
    'waypoint_4': {
        'lat': 0.0,
        'lon': 0.0
    },
    'waypoint_5': {
        'lat': 0.0,
        'lon': 0.0
    },
    'waypoint_6': {
        'lat': 0.0,
        'lon': 0.0
    },
    'waypoint_7': {
        'lat': 0.0,
        'lon': 0.0
    },
    'waypoint_8': {
        'lat': 0.0,
        'lon': 0.0
    },
    'waypoint_9': {
        'lat': 0.0,
        'lon': 0.0
    }
}

### 계산하고 file_id 리턴할 함수
def calcCrime(crime_val, userId_val):
    ##
    # user가 선택한 crime의 가중치를 이용하여, 시카고의 G2 파일을 구글 드라이브에 저장하는 자리
    ##
    pass

@app.route('/api/navi/', methods=['GET', 'POST'])
def apiNavi():

    global waypoints

    if request.method == 'GET':
        what = waypoints # 저장했던 way point json 파일 반환하는 과정으로 바꾸는 자리
        return jsonify(what)

    else:
        orig = request.json['orig']
        dest = request.json['dest']
        id = request.json['id']
        option = request.json['option']

        waypoints = way.wayNine(orig, dest, str(id), int(option)) # 이 함수에서는 9개의 waypoint 반환
        
        return jsonify(waypoints)


@app.route('/api/signup/calculate/', methods=['POST'])
def apiCalc():
    crime = request.json['crime']
    userId = str(request.json['id'])

    fileId = calcCrime(crime, userId)

    cur = mysql.connection.cursor()
    if (cur.execute("SELECT user_id FROM fileinfo WHERE user_id=%s" % (userId)) == None): # 존재하지 않으면 적재
        cur.execute("INSERT INTO fileinfo (user_id, file_id) VALUES (%s, %s)" % (userId, fileId))
    else: # 존재하면 수정
        cur.execute("UPDATE fileinfo SET file_id=%s WHERE user_id is %s" % (fileId, userId))

    cur.close()

    return "Done POST crime DB"


# DB Update
@app.route('/api/profile/calculate/', methods=['PUT'])
def apiDBUpdate():
    crime = request.json['crime']
    userId = request.json['id']

    fileId = calcCrime(crime, userId)

    cur = mysql.connection.cursor()
    cur.execute("UPDATE fileinfo SET file_id=%s WHERE user_id is %s" % (fileId, userId))
    
    cur.close()

    return "Done UPDATE crime DB"

if __name__=='__main__':
    app.run(debug=True)