### About Data Analysis ###
import pandas as pd
import pickle as pkl

import osmnx as ox
import math

### About Google Drive API Download ###
import os
import io
from Google import Create_Service
from googleapiclient.http import MediaIoBaseDownload

### About MySQL DB ###
from fox import mysql, service


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


def wayNine(orig, dest, id):
    # Get user_id, after that, DB access, Figure out the file_id of Graph
    user_id = id

    cur = mysql.connection.cursor()
    cur.execute("SELECT file_id FROM fileinfo WHERE user_id=%s" % (user_id))
    
    file_id = cur.fetchone()
    file_id = str(file_id['file_id'])
    cur.close()

    # File Download at Google Drive
    downGoogle(file_id, user_id)

    # Load a file that was saved from local
    with open("/var/www/rabbit/userData/%s.pickle" % (user_id), "rb") as fr:
        G2 = pkl.load(fr) # G2 = ox.graph_from_gdfs(nodes, edges)

    nodes, edges = ox.graph_to_gdfs(G2)

    origi = (orig['latitude'], orig['longitude'])
    desti = (dest['latitude'], dest['longitude'])
    orig_node = ox.distance.nearest_nodes(G2, origi[1], origi[0])
    dest_node = ox.distance.nearest_nodes(G2, desti[1], desti[0])

    route1 = ox.shortest_path(G2, orig_node, dest_node, weight="length")
    route1_length = int(sum(ox.utils_graph.get_route_edge_attributes(G2, route1, "length")))
    route1_risk = int(sum(ox.utils_graph.get_route_edge_attributes(G2, route1, "risk score")))
    print("Route shortest is", route1_length, "meters and has", route1_risk, "riskiness score.")
    
    # get the information about the nodes and edges in route
    route1_nodes = []
    for node in route1:
        route1_nodes.append(list(nodes.loc[[node]].values[0]))

    route1_nodes_df = pd.DataFrame(route1_nodes)
    route1_nodes_df.columns = ['y', 'x', 'street_count', 'ref', 'highway', 'geometry', 'assigned_cell', 'risk score']
    route1_edges = ox.utils_graph.get_route_edge_attributes(G2, route1)
        
    # select the 9 nodes by analyzing the numbers of the node
    num_nodes_route1 = len(route1)
    selected_nodes_route1 = (num_nodes_route1//9)
    selected_route1 = route1_nodes_df.iloc[::selected_nodes_route1]
    selected_route1_df = pd.DataFrame(selected_route1)
    result_num_route1 = selected_route1_df.reset_index().loc[:8, ['y', 'x'],] # return

    # by analyzing the length of the edges
    selected_nodes_len_1 = math.trunc(route1_length/10)
    route1_edges_df = pd.DataFrame(route1_edges)

    # get the riskness of the edges in the route
    route1_edges_riskiness = edges[edges['osmid'].isin(route1_edges_df['osmid'])]

    sum_val = 0
    nodes_idx_1= []
    for index, edge in route1_edges_df.iterrows():
        sum_val += edge["length"]
        if(sum_val >= selected_nodes_len_1):
            nodes_idx_1.append(route1_nodes_df.reset_index().loc[index, ['y', 'x']])
            sum_val = 0

    result_len_route1 = pd.DataFrame(nodes_idx_1)


    route2 = ox.shortest_path(G2, orig_node, dest_node, weight="risk score")
    route2_length = int(sum(ox.utils_graph.get_route_edge_attributes(G2, route2, "length")))
    route2_risk = int(sum(ox.utils_graph.get_route_edge_attributes(G2, route2, "risk score")))
    print("Route safetest is", route2_length, "meters and has", route2_risk, "riskiness score.")

    # get the information about the nodes and edges in route
    route2_nodes = []
    for node in route2:
        route2_nodes.append(list(nodes.loc[[node]].values[0]))

    route2_nodes_df = pd.DataFrame(route2_nodes)
    route2_nodes_df.columns = ['y', 'x', 'street_count', 'ref', 'highway', 'geometry', 'assigned_cell', 'risk score']
    route2_edges = ox.utils_graph.get_route_edge_attributes(G2, route2)
    
    # select the 9 nodes by analyzing the numbers of the node
    num_nodes_route2 = len(route2)
    selected_nodes_route2 = (num_nodes_route2//9)
    selected_route2 = route2_nodes_df.iloc[::selected_nodes_route2] 
    selected_route2_df = pd.DataFrame(selected_route2)
    result_num_route2 = selected_route2_df.reset_index().loc[:8, ['y', 'x'],] # return

    selected_nodes_len_2 = selected_nodes_len_2 = math.trunc(route2_length/10)
    route2_edges_df = pd.DataFrame(route2_edges)

    # get the riskiness of the edges in the route
    route2_edges_riskiness = edges[edges['osmid'].isin(route2_edges_df['osmid'])]

    sum_val = 0
    nodes_idx_2 = []
    for index, edge in route2_edges_df.iterrows():
        sum_val += edge["length"]
        if(sum_val >= selected_nodes_len_2):
            nodes_idx_2.append(route2_nodes_df.reset_index().loc[index, ['y', 'x']])
            sum_val = 0

    result_len_route2 = pd.DataFrame(nodes_idx_2)


    waypoints = {
        'shortest': {
            'total_riskiness': int(route1_risk),
            'waypoint': [
                {
                    'latitude': float(result_num_route1.iloc[0, 0]),
                    'longitude': float(result_num_route1.iloc[0, 1])
                },
                {
                    'latitude': float(result_num_route1.iloc[1, 0]),
                    'longitude': float(result_num_route1.iloc[1, 1])
                },
                {
                    'latitude': float(result_num_route1.iloc[2, 0]),
                    'longitude': float(result_num_route1.iloc[2, 1])
                },
                {
                    'latitude': float(result_num_route1.iloc[3, 0]),
                    'longitude': float(result_num_route1.iloc[3, 1])
                },
                {
                    'latitude': float(result_num_route1.iloc[4, 0]),
                    'longitude': float(result_num_route1.iloc[4, 1])
                },
                {
                    'latitude': float(result_num_route1.iloc[5, 0]),
                    'longitude': float(result_num_route1.iloc[5, 1])
                },
                {
                    'latitude': float(result_num_route1.iloc[6, 0]),
                    'longitude': float(result_num_route1.iloc[6, 1])
                },
                {
                    'latitude': float(result_num_route1.iloc[7, 0]),
                    'longitude': float(result_num_route1.iloc[7, 1])
                },
                {
                    'latitude': float(result_num_route1.iloc[8, 0]),
                    'longitude': float(result_num_route1.iloc[8, 1])
                }
            ]
        },
        'safetest': {
            'total_riskiness': int(route2_risk),
            'waypoint': [
                {
                    'latitude': float(result_num_route2.iloc[0, 0]),
                    'longitude': float(result_num_route2.iloc[0, 1])
                },
                {
                    'latitude': float(result_num_route2.iloc[1, 0]),
                    'longitude': float(result_num_route2.iloc[1, 1])
                },
                {
                    'latitude': float(result_num_route2.iloc[2, 0]),
                    'longitude': float(result_num_route2.iloc[2, 1])
                },
                {
                    'latitude': float(result_num_route2.iloc[3, 0]),
                    'longitude': float(result_num_route2.iloc[3, 1])
                },
                {
                    'latitude': float(result_num_route2.iloc[4, 0]),
                    'longitude': float(result_num_route2.iloc[4, 1])
                },
                {
                    'latitude': float(result_num_route2.iloc[5, 0]),
                    'longitude': float(result_num_route2.iloc[5, 1])
                },
                {
                    'latitude': float(result_num_route2.iloc[6, 0]),
                    'longitude': float(result_num_route2.iloc[6, 1])
                },
                {
                    'latitude': float(result_num_route2.iloc[7, 0]),
                    'longitude': float(result_num_route2.iloc[7, 1])
                },
                {
                    'latitude': float(result_num_route2.iloc[8, 0]),
                    'longitude': float(result_num_route2.iloc[8, 1])
                }
            ]
        }
    }

    return (waypoints)