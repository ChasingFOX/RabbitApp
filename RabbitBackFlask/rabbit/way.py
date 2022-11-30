### About Data Analysis ###
import pandas as pd
import pickle as pkl

import osmnx as ox
import math

### About Google Drive API Download ###
import os
import io
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

    # ---------------------#
    route1 = ox.shortest_path(G2, orig_node, dest_node, weight="risk score")
    route1_length = int(sum(ox.utils_graph.get_route_edge_attributes(G2, route1, "length")))
    route1_risk = int(sum(ox.utils_graph.get_route_edge_attributes(G2, route1, "risk score")))
    print("Route blue is", route1_length, "meters and has", route1_risk, "riskiness score.")
    
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
    # ---------------------#
    route2 = ox.shortest_path(G2, orig_node, dest_node, weight="l_r_3_7")
    route2_length = int(sum(ox.utils_graph.get_route_edge_attributes(G2, route2, "length")))
    route2_risk = int(sum(ox.utils_graph.get_route_edge_attributes(G2, route2, "risk score")))
    print("Route green is", route2_length, "meters and has", route2_risk, "riskiness score.")
    
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

    # by analyzing the length of the edges
    selected_nodes_len_2 = math.trunc(route2_length/10)
    route2_edges_df = pd.DataFrame(route2_edges)

    # get the riskness of the edges in the route
    route2_edges_riskiness = edges[edges['osmid'].isin(route2_edges_df['osmid'])]

    sum_val = 0
    nodes_idx_2= []
    for index, edge in route2_edges_df.iterrows():
        sum_val += edge["length"]
        if(sum_val >= selected_nodes_len_2):
            nodes_idx_2.append(route2_nodes_df.reset_index().loc[index, ['y', 'x']])
            sum_val = 0

    result_len_route2 = pd.DataFrame(nodes_idx_2)

    # ---------------------#
    route3 = ox.shortest_path(G2, orig_node, dest_node, weight="l_r_5_5")
    route3_length = int(sum(ox.utils_graph.get_route_edge_attributes(G2, route3, "length")))
    route3_risk = int(sum(ox.utils_graph.get_route_edge_attributes(G2, route3, "risk score")))
    print("Route yellow is", route3_length, "meters and has", route3_risk, "riskiness score.")

    # get the information about the nodes and edges in route
    route3_nodes = []
    for node in route3:
        route3_nodes.append(list(nodes.loc[[node]].values[0]))

    route3_nodes_df = pd.DataFrame(route3_nodes)
    route3_nodes_df.columns = ['y', 'x', 'street_count', 'ref', 'highway', 'geometry', 'assigned_cell', 'risk score']
    route3_edges = ox.utils_graph.get_route_edge_attributes(G2, route3)
    
    # select the 9 nodes by analyzing the numbers of the node
    num_nodes_route3 = len(route3)
    selected_nodes_route3 = (num_nodes_route3//9)
    selected_route3 = route3_nodes_df.iloc[::selected_nodes_route3] 
    selected_route3_df = pd.DataFrame(selected_route3)
    result_num_route3 = selected_route3_df.reset_index().loc[:8, ['y', 'x'],] # return

    selected_nodes_len_3 = selected_nodes_len_3 = math.trunc(route3_length/10)
    route3_edges_df = pd.DataFrame(route3_edges)

    # get the riskiness of the edges in the route
    route3_edges_riskiness = edges[edges['osmid'].isin(route3_edges_df['osmid'])]

    sum_val = 0
    nodes_idx_3 = []
    for index, edge in route3_edges_df.iterrows():
        sum_val += edge["length"]
        if(sum_val >= selected_nodes_len_3):
            nodes_idx_3.append(route3_nodes_df.reset_index().loc[index, ['y', 'x']])
            sum_val = 0

    result_len_route3 = pd.DataFrame(nodes_idx_3)
    # ---------------------#
    route4 = ox.shortest_path(G2, orig_node, dest_node, weight="l_r_7_3")
    route4_length = int(sum(ox.utils_graph.get_route_edge_attributes(G2, route4, "length")))
    route4_risk = int(sum(ox.utils_graph.get_route_edge_attributes(G2, route4, "risk score")))
    print("Route orange is", route4_length, "meters and has", route4_risk, "riskiness score.")

    # get the information about the nodes and edges in route
    route4_nodes = []
    for node in route4:
        route4_nodes.append(list(nodes.loc[[node]].values[0]))

    route4_nodes_df = pd.DataFrame(route4_nodes)
    route4_nodes_df.columns = ['y', 'x', 'street_count', 'ref', 'highway', 'geometry', 'assigned_cell', 'risk score']
    route4_edges = ox.utils_graph.get_route_edge_attributes(G2, route4)
    
    # select the 9 nodes by analyzing the numbers of the node
    num_nodes_route4 = len(route4)
    selected_nodes_route4 = (num_nodes_route4//9)
    selected_route4 = route4_nodes_df.iloc[::selected_nodes_route4] 
    selected_route4_df = pd.DataFrame(selected_route4)
    result_num_route4 = selected_route4_df.reset_index().loc[:8, ['y', 'x'],] # return

    selected_nodes_len_4 = selected_nodes_len_4 = math.trunc(route4_length/10)
    route4_edges_df = pd.DataFrame(route4_edges)

    # get the riskiness of the edges in the route
    route4_edges_riskiness = edges[edges['osmid'].isin(route4_edges_df['osmid'])]

    sum_val = 0
    nodes_idx_4 = []
    for index, edge in route4_edges_df.iterrows():
        sum_val += edge["length"]
        if(sum_val >= selected_nodes_len_4):
            nodes_idx_4.append(route4_nodes_df.reset_index().loc[index, ['y', 'x']])
            sum_val = 0

    result_len_route4 = pd.DataFrame(nodes_idx_4)
    # ---------------------#
    route5 = ox.shortest_path(G2, orig_node, dest_node, weight="length")
    route5_length = int(sum(ox.utils_graph.get_route_edge_attributes(G2, route5, "length")))
    route5_risk = int(sum(ox.utils_graph.get_route_edge_attributes(G2, route5, "risk score")))
    print("Route red is", route5_length, "meters and has", route5_risk, "riskiness score.")

    # get the information about the nodes and edges in route
    route5_nodes = []
    for node in route5:
        route5_nodes.append(list(nodes.loc[[node]].values[0]))

    route5_nodes_df = pd.DataFrame(route5_nodes)
    route5_nodes_df.columns = ['y', 'x', 'street_count', 'ref', 'highway', 'geometry', 'assigned_cell', 'risk score']
    route5_edges = ox.utils_graph.get_route_edge_attributes(G2, route5)
    
    # select the 9 nodes by analyzing the numbers of the node
    num_nodes_route5 = len(route5)
    selected_nodes_route5 = (num_nodes_route5//9)
    selected_route5 = route5_nodes_df.iloc[::selected_nodes_route5] 
    selected_route5_df = pd.DataFrame(selected_route5)
    result_num_route5 = selected_route5_df.reset_index().loc[:8, ['y', 'x'],] # return

    selected_nodes_len_5 = selected_nodes_len_5 = math.trunc(route5_length/10)
    route5_edges_df = pd.DataFrame(route5_edges)

    # get the riskiness of the edges in the route
    route5_edges_riskiness = edges[edges['osmid'].isin(route5_edges_df['osmid'])]

    sum_val = 0
    nodes_idx_5 = []
    for index, edge in route5_edges_df.iterrows():
        sum_val += edge["length"]
        if(sum_val >= selected_nodes_len_5):
            nodes_idx_5.append(route5_nodes_df.reset_index().loc[index, ['y', 'x']])
            sum_val = 0

    result_len_route5 = pd.DataFrame(nodes_idx_5)
    # ---------------------#

    waypoints = {
        'blue': { # safetest
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
        'green': {
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
        },
        'yellow': {
            'total_riskiness': int(route3_risk),
            'waypoint': [
                {
                    'latitude': float(result_num_route3.iloc[0, 0]),
                    'longitude': float(result_num_route3.iloc[0, 1])
                },
                {
                    'latitude': float(result_num_route3.iloc[1, 0]),
                    'longitude': float(result_num_route3.iloc[1, 1])
                },
                {
                    'latitude': float(result_num_route3.iloc[2, 0]),
                    'longitude': float(result_num_route3.iloc[2, 1])
                },
                {
                    'latitude': float(result_num_route3.iloc[3, 0]),
                    'longitude': float(result_num_route3.iloc[3, 1])
                },
                {
                    'latitude': float(result_num_route3.iloc[4, 0]),
                    'longitude': float(result_num_route3.iloc[4, 1])
                },
                {
                    'latitude': float(result_num_route3.iloc[5, 0]),
                    'longitude': float(result_num_route3.iloc[5, 1])
                },
                {
                    'latitude': float(result_num_route3.iloc[6, 0]),
                    'longitude': float(result_num_route3.iloc[6, 1])
                },
                {
                    'latitude': float(result_num_route3.iloc[7, 0]),
                    'longitude': float(result_num_route3.iloc[7, 1])
                },
                {
                    'latitude': float(result_num_route3.iloc[8, 0]),
                    'longitude': float(result_num_route3.iloc[8, 1])
                }
            ]
        },
        'orange': {
            'total_riskiness': int(route4_risk),
            'waypoint': [
                {
                    'latitude': float(result_num_route4.iloc[0, 0]),
                    'longitude': float(result_num_route4.iloc[0, 1])
                },
                {
                    'latitude': float(result_num_route4.iloc[1, 0]),
                    'longitude': float(result_num_route4.iloc[1, 1])
                },
                {
                    'latitude': float(result_num_route4.iloc[2, 0]),
                    'longitude': float(result_num_route4.iloc[2, 1])
                },
                {
                    'latitude': float(result_num_route4.iloc[3, 0]),
                    'longitude': float(result_num_route4.iloc[3, 1])
                },
                {
                    'latitude': float(result_num_route4.iloc[4, 0]),
                    'longitude': float(result_num_route4.iloc[4, 1])
                },
                {
                    'latitude': float(result_num_route4.iloc[5, 0]),
                    'longitude': float(result_num_route4.iloc[5, 1])
                },
                {
                    'latitude': float(result_num_route4.iloc[6, 0]),
                    'longitude': float(result_num_route4.iloc[6, 1])
                },
                {
                    'latitude': float(result_num_route4.iloc[7, 0]),
                    'longitude': float(result_num_route4.iloc[7, 1])
                },
                {
                    'latitude': float(result_num_route4.iloc[8, 0]),
                    'longitude': float(result_num_route4.iloc[8, 1])
                }
            ]
        },
        'red': { # shotest
            'total_riskiness': int(route5_risk),
            'waypoint': [
                {
                    'latitude': float(result_num_route5.iloc[0, 0]),
                    'longitude': float(result_num_route5.iloc[0, 1])
                },
                {
                    'latitude': float(result_num_route5.iloc[1, 0]),
                    'longitude': float(result_num_route5.iloc[1, 1])
                },
                {
                    'latitude': float(result_num_route5.iloc[2, 0]),
                    'longitude': float(result_num_route5.iloc[2, 1])
                },
                {
                    'latitude': float(result_num_route5.iloc[3, 0]),
                    'longitude': float(result_num_route5.iloc[3, 1])
                },
                {
                    'latitude': float(result_num_route5.iloc[4, 0]),
                    'longitude': float(result_num_route5.iloc[4, 1])
                },
                {
                    'latitude': float(result_num_route5.iloc[5, 0]),
                    'longitude': float(result_num_route5.iloc[5, 1])
                },
                {
                    'latitude': float(result_num_route5.iloc[6, 0]),
                    'longitude': float(result_num_route5.iloc[6, 1])
                },
                {
                    'latitude': float(result_num_route5.iloc[7, 0]),
                    'longitude': float(result_num_route5.iloc[7, 1])
                },
                {
                    'latitude': float(result_num_route5.iloc[8, 0]),
                    'longitude': float(result_num_route5.iloc[8, 1])
                }
            ]
        }
    }

    return (waypoints)