from flask import Flask, jsonify, request
import way, os

app = Flask(__name__)

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

        waypoints = way.wayNine(orig, dest, id) # 이 함수에서는 9개의 waypoint 반환
        
        return jsonify(waypoints)


@app.route('/api/calculate/', methods=['POST'])
def apiCalc():
    crime = request.json['crime']
    id = request.json['id']
    
    # id로 구글 드라이브 파일 읽어와야 함

    ##
    # user가 선택한 crime의 가중치를 이용하여, 시카고의 node + edge 파일을 구글 드라이브에 저장하는 자리
    ##
    
    #return jsonify() # ??
    

if __name__=='__main__':
    app.run(debug=True)