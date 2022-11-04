from flask import Flask, jsonify, request #, redirect, url_for
# from flask_restful import Api, Resource
# import numpy as np
# import pickle as p
# import json

app = Flask(__name__)

# dict type
tests = {
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
        }
}

# 스프링/프론트랑 연결하게 post랑 get 주소 간단히 나누는 작업 추가 필요
@app.route('/api/test/', methods=['GET', 'POST'])
def testing():

    global tests

    if request.method == 'GET':
        what = tests # 저장했던 way point json 파일 반환하는 과정으로 바꾸는 자리
        return jsonify(what)

    else:
        orig = request.json['orig']
        dest = request.json['dest']
        kde = request.json['kde']

        ### python code 돌리는 something 함수 추가될 예정, 이 함수에서는 9개의 waypoint 반환 ###
        # return(jsonify(something(orig, dest, kde)))
        
        ## 이거는 임시 코드
        tests['route1']['lat'] = 11.11
        tests['route1']['lon'] = 22.22
        tests['route2']['lat'] = 33.33
        tests['route2']['lon'] = 44.44
        tests['route3']['lat'] = 55.55
        tests['route3']['lon'] = 66.66
        ##

        return jsonify(tests)


if __name__=='__main__':
    app.run(debug=True)