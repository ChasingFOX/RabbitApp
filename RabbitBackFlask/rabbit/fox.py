from flask import Flask, jsonify, request
from flask_mysqldb import MySQL

### About Google Drive API Upload ###
from googleapiclient.http import MediaFileUpload
from Google import Create_Service
import os

app = Flask(__name__)

app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = '1234'
app.config['MYSQL_HOST'] = '192.168.2.117'
app.config['MYSQL_DB'] = 'rabbit'
app.config['MYSQL_CURSORCLASS'] = 'DictCursor'

mysql = MySQL(app)

import way


def calcCrime(crime_val, userId_val):
    ##
    # 원래 user가 선택한 crime의 가중치를 이용하여 분석하는 자리
    ##

    # 일단 테스트 파일을 저장하는 임시 코드로 대체
    

    # 분석 후 해당 유저의 시카고의 Grpah 파일을 구글 드라이브에 저장

    CLIENT_SECRET_FILE = 'client_secret.json'
    API_NAME = 'drive'
    API_VERSION = 'v3'
    SCOPES = ['https://www.googleapis.com/auth/drive']

    service = Create_Service(CLIENT_SECRET_FILE, API_NAME, API_VERSION, SCOPES)

    folder_id = '1Pfj_Qaf8HBHqBQ9hNcIdPCf_dPhmGspY'

    file_name = '%s.pickle' % (userId_val)
    mime_type = 'application/octet-stream' # .pickle file's mime type

    file_metadata = {'name': file_name, 'parents': [folder_id]}
    
    media = MediaFileUpload('/var/www/rabbit/userData/{0}'.format(file_name), mimetype=mime_type)

    service.files().create(body=file_metadata, media_body=media, fields='id').execute()
    file = service.files().create(body=file_metadata, media_body=media, fields='id').execute()
    
    return file.get("id") # uploaded file Id return


@app.route('/api/navi/', methods=['POST'])
def apiNavi():
    orig = request.json['orig']
    dest = request.json['dest']
    id = request.json['id']
    
    return jsonify(way.wayNine(orig, dest, str(id))) # 이 함수에서는 9 + 9 + 9개의 waypoint 반환


@app.route('/api/signup/calculate/', methods=['POST'])
def apiCalc():
    crime = request.json['crime'] # 이거 list 이미 되어있나?
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
    crime = request.json['crime'] # 이거 list 이미 되어있나?
    userId = str(request.json['id'])

    fileId = calcCrime(crime, userId)

    cur = mysql.connection.cursor()
    cur.execute("UPDATE fileinfo SET file_id=%s WHERE user_id is %s" % (fileId, userId))
    
    cur.close()

    return "Done UPDATE crime DB"

if __name__=='__main__':
    app.run(debug=True)