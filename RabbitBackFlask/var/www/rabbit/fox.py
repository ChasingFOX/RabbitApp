### About flask ###
from flask import Flask, jsonify, request
from flask_mysqldb import MySQL
from flask_api import status

### About Google Drive API Upload ###
from googleapiclient.http import MediaFileUpload
from Google import Create_Service

## About scope checking ###
from shapely.geometry import Point, Polygon
import osmnx as ox

### About calcCrime ###
import pickle as pkl
import pandas as pd
import numpy as np
import os
from sklearn.preprocessing import RobustScaler

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
CLIENT_SECRET_FILE = 'client_secret.json' # This file is not uploaded on GitHub for security
API_NAME = 'drive'
API_VERSION = 'v3'
SCOPES = ['https://www.googleapis.com/auth/drive']

service = Create_Service(CLIENT_SECRET_FILE, API_NAME, API_VERSION, SCOPES)

import way # way.py file


# Upload each user's risk graph pickle file to Google Drive
def uploadGoogle(userId_val):
    import socket
    socket.setdefaulttimeout(60*15) # Graph upload time: 15 minutes limit
    
    folder_id = '1Pfj_Qaf8HBHqBQ9hNcIdPCf_dPhmGspY'

    file_name = '%s.pickle' % (userId_val)
    mime_type = 'application/octet-stream' # .pickle file's mime type

    file_metadata = {'name': file_name, 'parents': [folder_id]}
    
    media = MediaFileUpload('/var/www/rabbit/userData/{0}'.format(file_name), mimetype=mime_type)

    file = service.files().create(body=file_metadata, media_body=media, fields='id').execute()
    
    return file.get("id") # Return the uploaded file Id to write it at DB


def calcCrime(crime_val, userId_val):
    with open('/var/www/rabbit/admin/graph_edges.pickle', 'rb') as fr:
        edges = pkl.load(fr)

    crime_list = crime_val.replace(' ', '').split(',')
    st = ' '.join(crime_list)
    st = userId_val + ' ' + st

    # Calculating the user's Graph of weight
    ## Because of Apapche2 issue, this py file is run on terminal
    val = "python3 /var/www/rabbit/dataAnalysis.py %s" % (st)
    os.system(val)

    node_file_path = '/var/www/rabbit/admin/%s_node.pickle' % (userId_val)

    with open(node_file_path, 'rb') as f:
        node = pkl.load(f)

    test_nodes = node
    
    if os.path.exists(node_file_path): # del for os pkl file
        os.remove(node_file_path)
    
    # Combining python codes
    test_nodes.rename(columns={'crime_score': 'risk score'}, inplace=True)
    nodes = test_nodes

    # Imputing risk scores in the edge
    edges_u = edges.reset_index(level=1).reset_index(level=1) # reset the index of edges to 'u'

    edges_u = edges_u.merge(nodes['risk score'], how='inner', left_index=True, right_index=True) # merge edges and nodes

    # add the 'v' to the index
    edges_u.index.rename('u', inplace=True)
    edges_u.set_index([edges_u.index,'v'], inplace=True)
    edges_u.rename(columns={"risk score": "risk score_u"}, inplace=True)

    # reset the index of edges to 'v'
    edges_v = edges_u.reset_index(level=0)

    # merge edges and nodes
    edges_v = edges_v.merge(nodes['risk score'], how='inner', left_index=True, right_index=True)

    # add the 'v' to the index
    edges_v.rename(columns={"u": "v", "risk score" : "risk score_v"}, inplace=True)
    edges_v.index.rename('u', inplace=True)
    edges_v.set_index([edges_v.index,'v'], inplace=True)
    edges_v.set_index([edges_v.index,'key'], inplace=True)

    # get the mean of the start and end nodes's riskiness
    edges_v['risk score'] = (edges_v['risk score_u'] + edges_v['risk score_v'])/2

    # Create the ratio in edge considering the length and riskiness 3:7 & 7:3
    transformer_length = RobustScaler()
    transformer_length.fit(np.reshape(list(edges_v['length']),(-1,1)))

    transformer_risk = RobustScaler()
    transformer_risk.fit(np.reshape(list(edges_v['risk score']),(-1,1)))

    scaled_length = transformer_length.transform(np.reshape(list(edges_v['length']),(-1,1)))
    scaled_risk = transformer_risk.transform(np.reshape(list(edges_v['risk score']),(-1,1)))

    edges_v['l_r_3_7'] = (scaled_length * 0.3 + scaled_risk * 0.7) - min((scaled_length * 0.3 + scaled_risk * 0.7))
    edges_v['l_r_7_3'] = (scaled_length * 0.7 + scaled_risk * 0.3) - min((scaled_length * 0.7 + scaled_risk * 0.3))

    edges = edges_v

    # Re-create the graph based on the nodes and edges considering the riskiness
    G_risk = ox.graph_from_gdfs(nodes, edges) # create graph with nodes and edges including risk score


    # Upload G_risk pkl named by userId at local folder
    with open('/var/www/rabbit/userData/%s.pickle' % (userId_val), 'wb') as f:
        pkl.dump(G_risk, f)

    fileId = uploadGoogle(userId_val) # the Graph pickle file -> Save at Google Drive

    # In local folder, user graph delete because already file uploaded at Gdrive
    file_path = '/var/www/rabbit/userData/%s.pickle' % (userId_val)
    if os.path.exists(file_path):
        os.remove(file_path)

    return fileId


# Direction Recommendation & Navigation page API
@app.route('/api/navi/', methods=['POST'])
def apiNavi():
    id = request.json['id']

    cur = mysql.connection.cursor()
    cur.execute("SELECT making FROM user WHERE id = '%s'" % (id))
    making = cur.fetchone()
    making = int(making['making']) # bool type, Is user's graph making or not from sign up/profile edit
    cur.close()

    if making == 0: # User's risk graph is not making now
        orig = request.json['orig']
        dest = request.json['dest']
        
        p1 = Point(orig['longitude'], orig['latitude'])
        p2 = Point(dest['longitude'], dest['latitude'])

        if (p1.within(poly) and p2.within(poly)): # Check the lat and lon, Are they in Chicago or not
            return jsonify(way.wayNine(orig, dest, str(id))) # In this func, return 9 + 9 + 9 + 9 waypoints
        else: # Not in Chicago, Error 400
            return 'Error, Please enter correct Chicago Coordinates', status.HTTP_400_BAD_REQUEST
    else: # making == 1, User's risk graph is now making, User can't access to the navi page
        return 'Please wait until processing your previous request.', status.HTTP_400_BAD_REQUEST


# After call Spring API, this API will be called to make new user's risk graph
@app.route('/api/signup/calculate/', methods=['POST'])
def apiCalc():
    userId = str(request.json['id'])

    cur = mysql.connection.cursor()

    cur.execute("SELECT crime FROM user WHERE id = '%s'" % (userId))
    crime = cur.fetchone()
    crime = str(crime['crime'])

    if crime == 'None': # case 1: user didn't select crime types, so in DB, crime col value is Null, then use default risk graph
        folder_id = '1Pfj_Qaf8HBHqBQ9hNcIdPCf_dPhmGspY'

        mime_type = 'application/octet-stream' # .pickle file's mime type

        media = MediaFileUpload('/var/www/rabbit/userData/default.pickle', mimetype=mime_type)
        
        file_name = '%s.pickle' % (userId)
        file_metadata = {'name': file_name, 'parents': [folder_id]}
        
        file = service.files().create(body=file_metadata, media_body=media, fields='id').execute()
        fileId = file.get("id") # uploaded file Id return
        cur.execute("INSERT INTO fileinfo (user_id, file_id) VALUES ('%s', '%s')" % (userId, fileId))

    else: # case 2: user selected crime types, then make new user's risk graph
        fileId = calcCrime(crime, userId)
        cur.execute("INSERT INTO fileinfo (user_id, file_id) VALUES ('%s', '%s')" % (userId, fileId))

    cur.execute("UPDATE user SET making = 0 WHERE id = '%s'" % (userId)) # making Status update (done making user's graph)
    
    mysql.connection.commit()
    cur.close()

    return "Done POST crime DB"


# In Profile edit page, user requested to edit crime lists that user want to avoid, then this API will be called
@app.route('/api/profile/calculate/', methods=['PUT'])
def apiDBUpdate():
    userId = str(request.json['id'])

    cur = mysql.connection.cursor()

    cur.execute("SELECT crime FROM user WHERE id = '%s'" % (userId))
    crime = cur.fetchone()
    crime = str(crime['crime'])

    if crime == 'None': # case 1: If the user edit their crime type non click
        cur.execute("UPDATE user SET making = 1 WHERE id = '%s'" % (userId)) # making Status update (making user's graph)
        mysql.connection.commit()

        folder_id = '1Pfj_Qaf8HBHqBQ9hNcIdPCf_dPhmGspY'

        mime_type = 'application/octet-stream' # .pickle file's mime type

        media = MediaFileUpload('/var/www/rabbit/userData/default.pickle', mimetype=mime_type)
        
        file_name = '%s.pickle' % (userId)
        file_metadata = {'name': file_name, 'parents': [folder_id]}
        
        file = service.files().create(body=file_metadata, media_body=media, fields='id').execute()
        fileId = file.get("id") # uploaded file Id return

        # Update User new Graph file id
        cur.execute("UPDATE fileinfo SET file_id = '%s' WHERE user_id = '%s'" % (fileId, userId))

    else: # case 2: user normally edit their crime list that they want to avoid in profile page
        cur.execute("UPDATE user SET making = 1 WHERE id = '%s'" % (userId)) # making Status update (making user's graph)
        mysql.connection.commit()

        fileId = calcCrime(crime, userId)
        
        # Delete previous User Graph file in Google Drive
        cur.execute("SELECT file_id FROM fileinfo WHERE user_id = '%s'" % (userId))
        pre_file_id = cur.fetchone()
        pre_file_id = str(pre_file_id['file_id'])
        service.files().delete(fileId=pre_file_id).execute()
        
        # Update User new Graph file id
        cur.execute("UPDATE fileinfo SET file_id = '%s' WHERE user_id = '%s'" % (fileId, userId))
        
    # Change 'user' table making status original
    cur.execute("UPDATE user SET making = 0 WHERE id = '%s'" % (userId))

    # Change 'user' table processing status original
    cur.execute("UPDATE user SET processing = 0 WHERE id = '%s'" % (userId))

    mysql.connection.commit()
    cur.close()

    return "Done UPDATE crime DB"


if __name__=='__main__':
    app.run(debug=True) # Flask Debug mode True
