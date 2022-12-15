### About Data Analysis ###
import pandas as pd
import pickle as pkl

import osmnx as ox
import math
import json

from sklearn.preprocessing import MinMaxScaler

### About Google Drive API Download ###
import os
import io
from googleapiclient.http import MediaIoBaseDownload

### About MySQL DB ###
from fox import mysql, service


# Download pickle file from Google Drive
def downGoogle(fileIdVal, userIdVal):
    file_id = fileIdVal
    file_name = userIdVal + ".pickle"
    
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


# Algorithm part, Return 9 waypoints of each route
def wayNine(orig, dest, id):
    # Get user_id, after that, DB access, Figure out the file_id of Graph
    user_id = id

    cur = mysql.connection.cursor()
    cur.execute("SELECT file_id FROM fileinfo WHERE user_id=%s" % (user_id))
    
    file_id = cur.fetchone()
    file_id = str(file_id['file_id'])
    cur.close()

    # File Download from Google Drive
    downGoogle(file_id, user_id)

    # Load a file that was saved from local
    with open("/var/www/rabbit/userData/%s.pickle" % (user_id), "rb") as fr:
        G2 = pkl.load(fr) # G2 is the user's personal risk graph

    nodes, edges = ox.graph_to_gdfs(G2)

    origi = (orig['latitude'], orig['longitude'])
    desti = (dest['latitude'], dest['longitude'])
    orig_node = ox.distance.nearest_nodes(G2, origi[1], origi[0])
    dest_node = ox.distance.nearest_nodes(G2, desti[1], desti[0])

    # ---------------------#
    route1 = ox.shortest_path(G2, orig_node, dest_node, weight="risk score")
    route1_length = int(sum(ox.utils_graph.get_route_edge_attributes(G2, route1, "length")))
    route1_risk = int(sum(ox.utils_graph.get_route_edge_attributes(G2, route1, "risk score")))
    
    # get the information about the nodes and edges in route
    route1_nodes = []
    for node in route1:
        route1_nodes.append(list(nodes.loc[[node]].values[0]))

    route1_nodes_df = pd.DataFrame(route1_nodes)
    route1_nodes_df.columns = ['y', 'x', 'street_count', 'ref', 'highway', 'geometry', 'assigned_cell', 'risk score']
    #route1_edges = ox.utils_graph.get_route_edge_attributes(G2, route1)
    
    # select the 9 nodes by analyzing the numbers of the node
    num_nodes_route1 = len(route1)
    ways_one = []

    if (num_nodes_route1 < 9):
        result_num_route1 = route1_nodes_df

        for i in range(0, num_nodes_route1):
            ways_one.append({'latitude': float(result_num_route1.iloc[i, 0]),
                    'longitude': float(result_num_route1.iloc[i, 1])})
    else:
        selected_nodes_route1 = (num_nodes_route1//9)

        selected_route1 = route1_nodes_df.loc[[i for j, i in enumerate(route1_nodes_df.index) if j % selected_nodes_route1 == 0]]
        #selected_route1 = route1_nodes_df.iloc[::selected_nodes_route1]
        selected_route1_df = pd.DataFrame(selected_route1)
        result_num_route1 = selected_route1_df.reset_index().loc[:8, ['y', 'x'],] # return

        for i in range(0, 9):
            ways_one.append({'latitude': float(result_num_route1.iloc[i, 0]),
                    'longitude': float(result_num_route1.iloc[i, 1])})
    # ---------------------#
    route2 = ox.shortest_path(G2, orig_node, dest_node, weight="l_r_3_7")
    route2_length = int(sum(ox.utils_graph.get_route_edge_attributes(G2, route2, "length")))
    route2_risk = int(sum(ox.utils_graph.get_route_edge_attributes(G2, route2, "risk score")))
    
    # get the information about the nodes and edges in route
    route2_nodes = []
    for node in route2:
        route2_nodes.append(list(nodes.loc[[node]].values[0]))

    route2_nodes_df = pd.DataFrame(route2_nodes)
    route2_nodes_df.columns = ['y', 'x', 'street_count', 'ref', 'highway', 'geometry', 'assigned_cell', 'risk score']
    #route2_edges = ox.utils_graph.get_route_edge_attributes(G2, route2)
    
    # select the 9 nodes by analyzing the numbers of the node
    num_nodes_route2 = len(route2)
    ways_two = []

    if (num_nodes_route2 < 9):
        result_num_route2 = route2_nodes_df

        for i in range(0, num_nodes_route2):
            ways_two.append({'latitude': float(result_num_route2.iloc[i, 0]),
                'longitude': float(result_num_route2.iloc[i, 1])})
    else:
        selected_nodes_route2 = (num_nodes_route2//9)

        selected_route2 = route2_nodes_df.loc[[i for j, i in enumerate(route2_nodes_df.index) if j % selected_nodes_route2 == 0]]
        #selected_route2 = route2_nodes_df.iloc[::selected_nodes_route2]
        selected_route2_df = pd.DataFrame(selected_route2)
        result_num_route2 = selected_route2_df.reset_index().loc[:8, ['y', 'x'],] # return

        for i in range(0, 9):
            ways_two.append({
                'latitude': float(result_num_route2.iloc[i, 0]),
                'longitude': float(result_num_route2.iloc[i, 1])
            })
    # ---------------------#
    route4 = ox.shortest_path(G2, orig_node, dest_node, weight="l_r_7_3")
    route4_length = int(sum(ox.utils_graph.get_route_edge_attributes(G2, route4, "length")))
    route4_risk = int(sum(ox.utils_graph.get_route_edge_attributes(G2, route4, "risk score")))

    # get the information about the nodes and edges in route
    route4_nodes = []
    for node in route4:
        route4_nodes.append(list(nodes.loc[[node]].values[0]))

    route4_nodes_df = pd.DataFrame(route4_nodes)
    route4_nodes_df.columns = ['y', 'x', 'street_count', 'ref', 'highway', 'geometry', 'assigned_cell', 'risk score']
    #route4_edges = ox.utils_graph.get_route_edge_attributes(G2, route4)
    
    # select the 9 nodes by analyzing the numbers of the node
    num_nodes_route4 = len(route4)
    ways_four = []

    if (num_nodes_route4 < 9):
        result_num_route4 = route4_nodes_df
        for i in range(0, num_nodes_route4):
            ways_four.append({
                'latitude': float(result_num_route4.iloc[i, 0]),
                'longitude': float(result_num_route4.iloc[i, 1])
            })
    else:
        selected_nodes_route4 = (num_nodes_route4//9)

        selected_route4 = route4_nodes_df.loc[[i for j, i in enumerate(route4_nodes_df.index) if j % selected_nodes_route4 == 0]]
        # selected_route4 = route4_nodes_df.iloc[::selected_nodes_route4] 
        selected_route4_df = pd.DataFrame(selected_route4)
        result_num_route4 = selected_route4_df.reset_index().loc[:8, ['y', 'x'],] # return

        for i in range(0, 9):
            ways_four.append({
                'latitude': float(result_num_route4.iloc[i, 0]),
                'longitude': float(result_num_route4.iloc[i, 1])
            })
    # ---------------------#
    route5 = ox.shortest_path(G2, orig_node, dest_node, weight="length")
    route5_length = int(sum(ox.utils_graph.get_route_edge_attributes(G2, route5, "length")))
    route5_risk = int(sum(ox.utils_graph.get_route_edge_attributes(G2, route5, "risk score")))

    # get the information about the nodes and edges in route
    route5_nodes = []
    for node in route5:
        route5_nodes.append(list(nodes.loc[[node]].values[0]))

    route5_nodes_df = pd.DataFrame(route5_nodes)
    route5_nodes_df.columns = ['y', 'x', 'street_count', 'ref', 'highway', 'geometry', 'assigned_cell', 'risk score']
    #route5_edges = ox.utils_graph.get_route_edge_attributes(G2, route5)
    
    # select the 9 nodes by analyzing the numbers of the node
    num_nodes_route5 = len(route5)
    ways_five = []

    if (num_nodes_route5 < 9):
        result_num_route5 = route5_nodes_df

        for i in range(0, num_nodes_route5):
            ways_five.append({
                'latitude': float(result_num_route5.iloc[i, 0]),
                'longitude': float(result_num_route5.iloc[i, 1])
            })
    else:
        selected_nodes_route5 = (num_nodes_route5//9)

        selected_route5 = route5_nodes_df.loc[[i for j, i in enumerate(route5_nodes_df.index) if j % selected_nodes_route5 == 0]]
        #selected_route5 = route5_nodes_df.iloc[::selected_nodes_route5]
        selected_route5_df = pd.DataFrame(selected_route5)
        result_num_route5 = selected_route5_df.reset_index().loc[:8, ['y', 'x'],] # return

        for i in range(0, 9):
            ways_five.append({
                'latitude': float(result_num_route5.iloc[i, 0]),
                'longitude': float(result_num_route5.iloc[i, 1])
            })
    # ---------------------#
        # edges_risk = edges.iloc[:,[7]]
        # risk_score_edges = pd.DataFrame([route1_risk/len(route1), route2_risk/len(route2), route4_risk/len(route4), route5_risk/len(route5)], columns=['risk score'])
        
        # # use MinMax Scaler
        # scaler = MinMaxScaler()
        # scaler.fit(edges_risk)
        # train_scaled_edges = scaler.transform(edges_risk)
        # test_scaled_edges = scaler.transform(risk_score_edges)
        # total_score = (test_scaled_edges * 10).round(1)
    # ---------------------#

    waypoints = {
        'safetest': { # safetest
            'total_riskiness': int(route1_risk),
            'length': route1_length,
            'waypoint': ways_one
        },
        'safe': {
            'total_riskiness': int(route2_risk),
            'length': route2_length,
            'waypoint': ways_two
        },
        'short': {
            'total_riskiness': int(route4_risk),
            'length': route4_length,
            'waypoint': ways_four
        },
        'shortest': { # shotest
            'total_riskiness': int(route5_risk),
            'length': route5_length,
            'waypoint': ways_five
        }
    }

    return (waypoints)