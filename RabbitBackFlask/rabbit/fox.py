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
from scipy import stats
from pycaret.regression import *

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


def give_weight(user_input, root_dir):
    with open(root_dir + "2018_ped_raw_data.pkl", "rb") as f:
        crime = pkl.load(f)
    with open(root_dir + "crime_weight_info.pkl", "rb") as f:
        crime_weight = pkl.load(f)
    
    input_list = []
    
    if 0 in user_input:
        input_list.extend([3,4,5])
    if 1 in user_input:
        input_list.extend([0, 8])
    if 2 in user_input:
        input_list.extend([1])
    if 3 in user_input:
        input_list.extend([13, 20])
    if 4 in user_input:
        input_list.extend([12])
    if 5 in user_input:
        input_list.extend([6, 9, 16, 7])
    if 6 in user_input:
        input_list.extend([15])
    if 7 in user_input:
        input_list.extend([18])
    if 8 in user_input:
        input_list.extend([2, 10])
    if 9 in user_input:
        input_list.extend([14])
    if 10 in user_input:
        input_list.extend([17, 19])
        
    crime_weight.loc[input_list, "weight"] = 60
    crime_table = crime.merge(crime_weight, how='inner', on='type')
    longitude = []
    latitude = []

    for i in range(len(crime_table)):
        for item in range(crime_table['weight'][i]):
            longitude.append(crime_table['longitude'][i])
            latitude.append(crime_table['latitude'][i])

    crime_df = pd.DataFrame({'longitude':longitude, 'latitude':latitude})
    return crime_df


def get_f(location):
    x = location["longitude"]
    y = location["latitude"]

    xmin = -87.9
    xmax = -87.5
    ymin = 41.6
    ymax = 42.05

    xx, yy = np.mgrid[xmin:xmax:100j, ymin:ymax:100j]

    positions = np.vstack([xx.ravel(), yy.ravel()])
    values = np.vstack([x, y])
    kernel = stats.gaussian_kde(values)

    f = np.reshape(kernel(positions).T, xx.shape)

    return f


def population_normalization(crime_ex_df, root_dir):
    xmin = -87.9
    xmax = -87.5
    ymin = 41.6
    ymax = 42.05
    xx, yy = np.mgrid[xmin:xmax:100j, ymin:ymax:100j]

    with open(root_dir + "chicago_polygon_ratio.pkl", "rb") as f:
        chicago_polygon = pkl.load(f)
        
    chicago_location = chicago_polygon[['the_geom','zipcode','SHAPE_AREA']]
    vectors_list = []
    count = 0
    for vector_set in chicago_polygon['the_geom']:
        tmp = []
        vector_set = vector_set.replace("(","")
        vector_set = vector_set.replace(")","")
        for index, vector in enumerate(vector_set[13:].split(",")):
            if index == 0:
                longitude = vector.split(" ")[0]
                latitude = vector.split(" ")[1]
                tmp.append([float(longitude), float(latitude)])
            else:
                longitude = vector.split(" ")[1]
                latitude = vector.split(" ")[2]
                tmp.append([float(longitude), float(latitude)])
            
        count += 1
        vectors_list.append(tmp)

    for i in range(60):
        xs, ys = zip(*vectors_list[i])
     
    data_list = []
    data_list.append(np.squeeze((np.reshape(xx,(10000,1)))).T)
    data_list.append(np.squeeze((np.reshape(yy,(10000,1)))).T)
    data_list.append(np.squeeze((np.reshape(crime_ex_df,(10000,1)))).T)
    crime_density_vertex = pd.DataFrame(data_list).T

    crime_density_vertex.columns = ['longitude','latitude','crime_density']

    vertex_zipcode_list=  []
    zipcode_area_list = []
    ratio_list = []

    for vertex in crime_density_vertex.itertuples():
        x = vertex.longitude 
        y = vertex.latitude
        z = vertex.crime_density

        isbreak = False
        for polygon_vertex_list, zipcode, area, ratio in zip(vectors_list,chicago_polygon['zipcode'], chicago_polygon['SHAPE_AREA'],chicago_polygon['ratio_2018'] ):
            if Polygon(polygon_vertex_list).contains(Point(x,y)):
                vertex_zipcode_list.append(zipcode)
                zipcode_area_list.append(area)
                ratio_list.append(ratio)
                isbreak = True
                break

        if isbreak is False:
            vertex_zipcode_list.append(0)
            zipcode_area_list.append(0)
            ratio_list.append(0)

    crime_density_vertex['zipcode'] = vertex_zipcode_list
    crime_density_vertex['area'] = zipcode_area_list
    crime_density_vertex['ratio'] = ratio_list

    crime_density_vertex['population'] = 0

    crime_density_vertex['adjust_crime_density'] = 0

    for data_tuple in crime_density_vertex.itertuples():
        if data_tuple.ratio == 0:
            pass
        else:
            if data_tuple.crime_density / data_tuple.ratio != 0:
                crime_density_vertex.loc[data_tuple.Index, 'adjust_crime_density'] = data_tuple.crime_density / (data_tuple.ratio)
                crime_density_vertex.loc[data_tuple.Index, 'crime_density'] = data_tuple.crime_density
    final_chicago_crime = crime_density_vertex[crime_density_vertex['zipcode']!=0]

    return final_chicago_crime

 
def minimum_search (longitude, latitude, cell_longitude, cell_latitude):
    result = np.sqrt((cell_longitude - longitude)** 2 + (cell_latitude - latitude) ** 2)
    maxind = np.argmin(result)

    return maxind

def dataAnalysis(crime_val):
    root_dir = '/var/www/rabbit/admin/'

    with open(root_dir + "100by100_urban_5_dataset.pkl", "rb") as f:
        urban_dataset = pkl.load(f)
    with open(root_dir + "al_riskscore_graph.pkl", "rb") as f:
        node = pkl.load(f)

    model = load_model(root_dir+"r_c_f_ET_0.99996")
    
    user_input = crime_val # User's crime selected list
    
    # Give a weight
    crime_df = give_weight(user_input, root_dir)
    
    # Get F value
    crime_ex_df = get_f(crime_df)
    
    # Population normalization
    chicago_crime = population_normalization(crime_ex_df, root_dir)
    
    # Data scailing
    urban_dataset["crime_2018"] = chicago_crime["adjust_crime_density"]
    features = ["shotspotter", "abd_building", "lightout", "support", "garbage_data", "crime_2018"]
    x = urban_dataset.loc[:, features].values
    x = RobustScaler().fit_transform(x)
    scailed_data = pd.DataFrame(x, columns=features)
    
    # Combine urban factor and crime to risk score (model predict)
    dataset = predict_model(model, scailed_data)
    
    dataset = dataset.reset_index(drop=True)
    dataset["longitude"] = chicago_crime["longitude"].reset_index(drop=True)
    dataset["latitude"] = chicago_crime["latitude"].reset_index(drop=True)

    # Assign node
    nearst_cell_index_list = []
    crime_score_list = []
    for pos_longitude, pos_latitude in zip(node['x'],node['y']):
        index = minimum_search(pos_longitude, pos_latitude, dataset['longitude'], dataset['latitude'])
        nearst_cell_index_list.append(dataset.iloc[index].name)
        crime_score_list.append(dataset.iloc[index]["Label"])
        
    node["assigned_cell"] = nearst_cell_index_list
    node["crime_score"] = crime_score_list
 
    return node # Graph return


def uploadGoogle(userId_val):
    import socket
    socket.setdefaulttimeout(60*3) # Graph upload time: 3 minutes limit
    
    folder_id = '1Pfj_Qaf8HBHqBQ9hNcIdPCf_dPhmGspY'

    file_name = '%s.pickle' % (userId_val)
    mime_type = 'application/octet-stream' # .pickle file's mime type

    file_metadata = {'name': file_name, 'parents': [folder_id]}
    
    media = MediaFileUpload('/var/www/rabbit/userData/{0}'.format(file_name), mimetype=mime_type)

    file = service.files().create(body=file_metadata, media_body=media, fields='id').execute()
    
    return file.get("id") # uploaded file Id return


def calcCrime(crime_val, userId_val):
    crime_list = crime_val.replace(' ', '').split(',')

    with open('/var/www/rabbit/admin/graph_edges.pickle', 'rb') as fr:
        edges = pkl.load(fr)

    # Space of calculating each user's Graph of weight, now used test data
    test_nodes = dataAnalysis(crime_list)
    
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

    # Create the ratio in edge considering the length and riskiness 3:7 & 5:5 & 7:3
    transformer_length = RobustScaler()
    transformer_length.fit(np.reshape(list(edges_v['length']),(-1,1)))

    transformer_risk = RobustScaler()
    transformer_risk.fit(np.reshape(list(edges_v['risk score']),(-1,1)))

    scaled_length = transformer_length.transform(np.reshape(list(edges_v['length']),(-1,1)))
    scaled_risk = transformer_risk.transform(np.reshape(list(edges_v['risk score']),(-1,1)))

    edges_v['l_r_3_7'] = (scaled_length * 0.3 + scaled_risk * 0.7) - min((scaled_length * 0.3 + scaled_risk * 0.7))
    edges_v['l_r_5_5'] = (scaled_length * 0.5 + scaled_risk * 0.5) - min((scaled_length * 0.5 + scaled_risk * 0.5))
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


@app.route('/api/navi/', methods=['POST'])
def apiNavi():
    orig = request.json['orig']
    dest = request.json['dest']
    id = request.json['id']
    
    p1 = Point(orig['longitude'], orig['latitude'])
    p2 = Point(dest['longitude'], dest['latitude'])

    if (p1.within(poly) and p2.within(poly)):
        return jsonify(way.wayNine(orig, dest, str(id))) # In this func, return 9 + 9 + 9 + 9 + 9 waypoints
    else: # Error 400
        return 'Error, Please enter correct Chicago Coordinates', status.HTTP_400_BAD_REQUEST
        

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
