### for JSON ###
from flask import jsonify

### About Google Drive ###
from googleapiclient.discovery import build
from httplib2 import Http
from oauth2client import file, client, tools

import gdown, os

### About Data Analysis ###
import pandas as pd
import time
import numpy as np
import pickle as pkl

import osmnx as ox
import networkx as nx
import plotly.graph_objects as go
import matplotlib.pyplot as plt
import pandas as pd
import math
import matplotlib
import tqdm
import json

def wayNine(orig, dest, id):
    with open("graph_edges_risk.pkl","rb") as fr:
        edges = pkl.load(fr)

    with open("graph_nodes_risk.pkl","rb") as fr:
        nodes = pkl.load(fr)

    G2 = ox.graph_from_gdfs(nodes, edges)

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
    result_route1 = selected_route1_df.reset_index().loc[:8, ['y', 'x'],]
    result_route2 = selected_route2_df.reset_index().loc[:8, ['y', 'x'],]
    
    waypoints = {
        'waypoint_1': {
            'lat': float(result_route2.iloc[0, 0]),
            'lon': float(result_route2.iloc[0, 1])
        },
        'waypoint_2': {
            'lat': float(result_route2.iloc[1, 0]),
            'lon': float(result_route2.iloc[1, 1])
        },
        'waypoint_3': {
            'lat': float(result_route2.iloc[2, 0]),
            'lon': float(result_route2.iloc[2, 1])
        },
        'waypoint_4': {
            'lat': float(result_route2.iloc[3, 0]),
            'lon': float(result_route2.iloc[3, 1])
        },
        'waypoint_5': {
            'lat': float(result_route2.iloc[4, 0]),
            'lon': float(result_route2.iloc[4, 1])
        },
        'waypoint_6': {
            'lat': float(result_route2.iloc[5, 0]),
            'lon': float(result_route2.iloc[5, 1])
        },
        'waypoint_7': {
            'lat': float(result_route2.iloc[6, 0]),
            'lon': float(result_route2.iloc[6, 1])
        },
        'waypoint_8': {
            'lat': float(result_route2.iloc[7, 0]),
            'lon': float(result_route2.iloc[7, 1])
        },
        'waypoint_9': {
            'lat': float(result_route2.iloc[8, 0]),
            'lon': float(result_route2.iloc[8, 1])
        }
    }

    return (waypoints)