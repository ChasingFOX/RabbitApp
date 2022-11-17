### for JSON ###
from flask import jsonify

### About Data Analysis ###
import pandas as pd
import pickle as pkl

import osmnx as ox
import pandas as pd
import math

### About Google Drive API ###
import os
import io
from Google import Create_Service
from googleapiclient.http import MediaIoBaseDownload

### About MySQL DB ###
from flask_mysqldb import MySQL
from fox import app

app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = '1234'
app.config['MYSQL_HOST'] = '192.168.2.117'
app.config['MYSQL_DB'] = 'rabbit'
app.config['MYSQL_CURSORCLASS'] = 'DictCursor'

mysql = MySQL(app)

def downGoogle(fileIdVal, userIdVal):
    CLIENT_SECRET_FILE = '/var/www/rabbit/client_secret.json'
    API_NAME = 'drive'
    API_VERSION = 'v3'
    SCOPES = ['https://www.googleapis.com/auth/drive']

    service = Create_Service(CLIENT_SECRET_FILE, API_NAME, API_VERSION, SCOPES)

    file_id = fileIdVal
    file_name = userIdVal + ".pickle"
    
    print('\n')
    print(file_id)
    print('\n')
    
    request = service.files().get_media(fileId=file_id)
    
    fh = io.BytesIO()
    downloader = MediaIoBaseDownload(fd=fh, request=request)

    done = False

    while not done:
        status, done = downloader.next_chunk()
        print('Download progress {0}'.format(status.progress() * 100))

    fh.seek(0)

    with open(os.path.join('/var/www/rabbit/userData', file_name), 'wb') as f:
        f.write(fh.read())
        f.close()

def wayNine(orig, dest, id):
    # user_id를 받아서 DB에서 접근 후, G2 file_id 알아냄
    user_id = id

    cur = mysql.connection.cursor()
    cur.execute("SELECT file_id FROM fileinfo WHERE user_id=%s" % (user_id))
    
    file_id = cur.fetchone()
    file_id = str(file_id['file_id'])
    cur.close()

    # Google Drive에서 파일 다운로드
    downGoogle(file_id, user_id)

    # local에 저장된 파일 가져오기
    with open("/var/www/rabbit/userData/%s.pickle" % (user_id), "rb") as fr:
        G2 = pkl.load(fr) # G2 = ox.graph_from_gdfs(nodes, edges)

    nodes, edges = ox.graph_to_gdfs(G2)

    origi = (orig['lat'], orig['lon'])
    desti = (dest['lat'], dest['lon'])
    orig_node = ox.distance.nearest_nodes(G2, origi[1], origi[0])
    dest_node = ox.distance.nearest_nodes(G2, desti[1], desti[0])
    route1 = ox.shortest_path(G2, orig_node, dest_node, weight="length")
    route2 = ox.shortest_path(G2, orig_node, dest_node, weight="risk score")

    route1_length = int(sum(ox.utils_graph.get_route_edge_attributes(G2, route1, "length")))
    route2_length = int(sum(ox.utils_graph.get_route_edge_attributes(G2, route2, "length")))
    route1_risk = int(sum(ox.utils_graph.get_route_edge_attributes(G2, route1, "risk score")))
    route2_risk = int(sum(ox.utils_graph.get_route_edge_attributes(G2, route2, "risk score")))

    print("Route 1 is", route1_length, "meters and has", route1_risk, "riskiness score.")
    print("Route 2 is", route2_length, "meters and has", route2_risk, "riskiness score.")

    route1_nodes = nodes[nodes.index.isin(route1)]
    route2_nodes = nodes[nodes.index.isin(route2)]

    route1_edges = ox.utils_graph.get_route_edge_attributes(G2, route1)
    route2_edges = ox.utils_graph.get_route_edge_attributes(G2, route2)

    num_nodes_route1 = len(route1_nodes)
    num_nodes_route2 = len(route2_nodes)
    selected_nodes_route1 = (num_nodes_route1//9)
    selected_nodes_route2 = (num_nodes_route2//9)

    selected_route1 = route1_nodes.iloc[::selected_nodes_route1]
    selected_route2 = route2_nodes.iloc[::selected_nodes_route2]
    selected_route1_df = pd.DataFrame(selected_route1)
    selected_route2_df = pd.DataFrame(selected_route2)
    result_num_route1 = selected_route1_df.reset_index().loc[:8, ['y', 'x'],]
    result_num_route2 = selected_route2_df.reset_index().loc[:8, ['y', 'x'],]
    
    
    ### by analyzing the length of the edges ###

    selected_nodes_len_1 = math.trunc(route1_length/10)
    selected_nodes_len_2 = math.trunc(route2_length/10)

    route1_edges_df = pd.DataFrame(route1_edges)
    route2_edges_df = pd.DataFrame(route2_edges)

    route1_nodes_df = pd.DataFrame(route1_nodes)
    route2_nodes_df = pd.DataFrame(route2_nodes)

    # get the riskiness of the edges in the route
    route1_edges_riskiness = edges[edges['osmid'].isin(route1_edges_df['osmid'])]
    route2_edges_riskiness = edges[edges['osmid'].isin(route2_edges_df['osmid'])]

    sum_value = 0
    nodes_idx_1= []
    for index, edge in route1_edges_df.iterrows():
        sum_value += edge["length"]
        if(sum_value >= selected_nodes_len_1):
            nodes_idx_1.append(route1_nodes_df.reset_index().loc[index, ['y', 'x']])
            sum_value = 0

    sum_value = 0

    nodes_idx_2 = []
    for index, edge in route2_edges_df.iterrows():
        sum_value += edge["length"]
        if(sum_value >= selected_nodes_len_2):
            nodes_idx_2.append(route2_nodes_df.reset_index().loc[index, ['y', 'x']])
            sum_value = 0

    result_len_route1 = pd.DataFrame(nodes_idx_1)
    result_len_route2 = pd.DataFrame(nodes_idx_2)
    
    ### end ###

    waypoints = {
        'waypoint_1': {
            'lat': float(result_num_route2.iloc[0, 0]),
            'lon': float(result_num_route2.iloc[0, 1])
        },
        'waypoint_2': {
            'lat': float(result_num_route2.iloc[1, 0]),
            'lon': float(result_num_route2.iloc[1, 1])
        },
        'waypoint_3': {
            'lat': float(result_num_route2.iloc[2, 0]),
            'lon': float(result_num_route2.iloc[2, 1])
        },
        'waypoint_4': {
            'lat': float(result_num_route2.iloc[3, 0]),
            'lon': float(result_num_route2.iloc[3, 1])
        },
        'waypoint_5': {
            'lat': float(result_num_route2.iloc[4, 0]),
            'lon': float(result_num_route2.iloc[4, 1])
        },
        'waypoint_6': {
            'lat': float(result_num_route2.iloc[5, 0]),
            'lon': float(result_num_route2.iloc[5, 1])
        },
        'waypoint_7': {
            'lat': float(result_num_route2.iloc[6, 0]),
            'lon': float(result_num_route2.iloc[6, 1])
        },
        'waypoint_8': {
            'lat': float(result_num_route2.iloc[7, 0]),
            'lon': float(result_num_route2.iloc[7, 1])
        },
        'waypoint_9': {
            'lat': float(result_num_route2.iloc[8, 0]),
            'lon': float(result_num_route2.iloc[8, 1])
        }
    }

    return (waypoints)