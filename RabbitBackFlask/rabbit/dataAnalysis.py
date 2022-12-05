import pickle as pkl
import pandas as pd
import numpy as np
import sys
from sklearn.preprocessing import RobustScaler
from scipy import stats
from pycaret.regression import *
from shapely.geometry import Point, Polygon

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

def analysis(userId_val, crime_val):
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

    with open('/var/www/rabbit/admin/%s_node.pickle' % (userId_val), 'wb') as f:
        pkl.dump(node, f)
    
    return 0

if __name__ == "__main__":
    list_val = sys.argv
    userId = str(list_val[1])
    crime_list = list_val[2:]
    analysis(userId, crime_list)