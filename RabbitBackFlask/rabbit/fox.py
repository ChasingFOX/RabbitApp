from flask import Flask, jsonify, request #, redirect, url_for
# from flask_restful import Api, Resource
# import numpy as np
# import pickle as p
# import json

app = Flask(__name__)

# dict type
waypoints = {
    'route1': {
        'lat': 0.0,
        'lon': 0.0
    },
    'route2': {
        'lat': 0.0,
        'lon': 0.0
    },
    'route3': {
        'lat': 0.0,
        'lon': 0.0
    },
    'route4': {
        'lat': 0.0,
        'lon': 0.0
    },
    'route5': {
        'lat': 0.0,
        'lon': 0.0
    },
    'route6': {
        'lat': 0.0,
        'lon': 0.0
    },
    'route7': {
        'lat': 0.0,
        'lon': 0.0
    },
    'route8': {
        'lat': 0.0,
        'lon': 0.0
    },
    'route9': {
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

        ### python code 돌리는 something 함수 추가될 예정, 이 함수에서는 9개의 waypoint 반환 ###
        # return(jsonify(something(orig, dest, id)))
        
        ## 이거는 임시 코드
        waypoints['route1']['lat'] = 11.11
        waypoints['route1']['lon'] = 22.22
        waypoints['route2']['lat'] = 33.33
        waypoints['route2']['lon'] = 44.44
        waypoints['route3']['lat'] = 55.55
        waypoints['route3']['lon'] = 66.66
        ##

        return jsonify(waypoints)


@app.route('/api/calculate/', methods=['POST'])
def apiCalc():
    crime = request.json['crime']
    id = request.json['id']

    ##
    # user가 선택한 crime의 가중치를 이용하여, 시카고의 node + edge 파일을 구글 드라이브에 저장하는 자리
    ##
    
    #return jsonify() # ??
    

if __name__=='__main__':
    app.run(debug=True)