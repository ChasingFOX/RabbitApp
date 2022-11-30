### About flask ###
from flask import Flask, jsonify, request
from flask_mysqldb import MySQL

### About Google Drive API Upload ###
from googleapiclient.http import MediaFileUpload
from Google import Create_Service

## About scope checking ###
from shapely.geometry import Point, Polygon
import osmnx as ox

# To connect with MySQL DB
app = Flask(__name__)

app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = '1234'
app.config['MYSQL_HOST'] = '192.168.2.117'
app.config['MYSQL_DB'] = 'rabbit'
app.config['MYSQL_CURSORCLASS'] = 'DictCursor'

mysql = MySQL(app)

# To detect Chicago Scope
ox.config(use_cache=True)
query = {'city': 'Chicago'}
gdf = ox.geocode_to_gdf(query)
coordinates = list(gdf.iloc[0]['geometry'].exterior.coords)
poly = Polygon(coordinates) # Chicago City Polygon

# To connect with Google Drive API
CLIENT_SECRET_FILE = 'client_secret.json'
API_NAME = 'drive'
API_VERSION = 'v3'
SCOPES = ['https://www.googleapis.com/auth/drive']

service = Create_Service(CLIENT_SECRET_FILE, API_NAME, API_VERSION, SCOPES)

import way


def calcCrime(crime_val, userId_val):
    import socket
    socket.setdefaulttimeout(60*3) # 3 minutes
    
    crime_list = crime_val.replace(' ', '').split(',')
    
    ##
    # Space of calculating each user's Graph of weight, now used test data
    # crime_val is string type !!!
    ##

    # the Graph pickle file -> Save at Google Drive

    folder_id = '1Pfj_Qaf8HBHqBQ9hNcIdPCf_dPhmGspY'

    file_name = '%s.pickle' % (userId_val)
    mime_type = 'application/octet-stream' # .pickle file's mime type

    file_metadata = {'name': file_name, 'parents': [folder_id]}
    
    media = MediaFileUpload('/var/www/rabbit/userData/{0}'.format(file_name), mimetype=mime_type)

    file = service.files().create(body=file_metadata, media_body=media, fields='id').execute()
    
    return file.get("id") # uploaded file Id return


@app.route('/api/navi/', methods=['POST'])
def apiNavi():
    orig = request.json['orig']
    dest = request.json['dest']
    id = request.json['id']
    
    p1 = Point(orig['longitude'], orig['latitude'])
    p2 = Point(dest['longitude'], dest['latitude'])

    if (p1.within(poly) and p2.within(poly)):
        return jsonify(way.wayNine(orig, dest, str(id))) # In this func, return 9 + 9 + 9 + 9 + 9 waypoints
    else:
        return 'Error, Please enter correct Chicago Coordinates'
        

@app.route('/api/signup/calculate/', methods=['POST'])  # not exist? then save. After Sign-Up process, user saved. Then this request can be used.
def apiCalc():
    userId = str(request.json['id'])

    cur = mysql.connection.cursor()

    cur.execute("SELECT crime FROM user WHERE id = '%s'" % (userId))
    crime = cur.fetchone()
    crime = str(crime['crime'])

    if crime == 'None': # case 1: user didn't select crime types, so in DB, crime col value is Null
        folder_id = '1Pfj_Qaf8HBHqBQ9hNcIdPCf_dPhmGspY'

        mime_type = 'application/octet-stream' # .pickle file's mime type

        media = MediaFileUpload('/var/www/rabbit/userData/default.pickle', mimetype=mime_type)
        
        file_name = '%s.pickle' % (userId)
        file_metadata = {'name': file_name, 'parents': [folder_id]}
        
        file = service.files().create(body=file_metadata, media_body=media, fields='id').execute()
        fileId = file.get("id") # uploaded file Id return
        cur.execute("INSERT INTO fileinfo (user_id, file_id) VALUES ('%s', '%s')" % (userId, fileId))

    else: # case 2: user selected crime types
        fileId = calcCrime(crime, userId)
        cur.execute("INSERT INTO fileinfo (user_id, file_id) VALUES ('%s', '%s')" % (userId, fileId))

    mysql.connection.commit()
    cur.close()

    return "Done POST crime DB"


# DB Update
@app.route('/api/profile/calculate/', methods=['PUT']) # exist? then revise.
def apiDBUpdate():
    crime = str(request.json['crime'])
    userId = str(request.json['id'])

    fileId = calcCrime(crime, userId)

    cur = mysql.connection.cursor()
    
    # Delete previous User Graph file in Google Drive
    cur.execute("SELECT file_id FROM fileinfo WHERE user_id = '%s'" % (userId))
    pre_file_id = cur.fetchone()
    pre_file_id = str(pre_file_id['file_id'])
    service.files().delete(fileId=pre_file_id).execute()
    
    # Update new User Graph file id
    cur.execute("UPDATE fileinfo SET file_id = '%s' WHERE user_id = '%s'" % (fileId, userId))

    # Change 'user' table crime value
    cur.execute("UPDATE user SET crime = '%s' WHERE id = '%s'" % (crime, userId))
    
    mysql.connection.commit()
    cur.close()

    return "Done UPDATE crime DB"


if __name__=='__main__':
    app.run(debug=True)
