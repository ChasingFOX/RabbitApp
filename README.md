# Project Rabbit

Navigation Algorithm & Service that guides you to avoid dangerous area

## Team ChasingFox

| ![](https://github.com/chersiakingdom.png) | ![](https://github.com/21700340JuwonBaek.png) | ![](https://github.com/zihooy.png) | ![](https://github.com/YesHyeon.png) | ![](https://github.com/heewoneha.png) | ![](https://github.com/bruiz114.png) |
| :----------------------------------------: | :-------------------------------------------: | :--------------------------------: | :----------------------------------: | :-----------------------------------: | :----------------------------------: |
|                **Daye Kim**                |                **Juwon Baek**                 |           **Jihu Yang**            |             **Hyun Roh**             |            **Heewon Jeong**            |           **Bryanna Ruiz**           |
|          **Kyunghee University**           |         **Handong Global University**         |   **Handong Global University**    |       **Kyunghee University**        |        **Chungbuk National University**        |        **Purdue University**         |
|          **rlaek4793@khu.ac.kr**           |         **21700340@handong.ac.kr**         |   **zihooy@handong.ac.kr**    |       **yeshyun@khu.ac.kr**        |        **jhjmo0719h@cbnu.ac.kr**        |        **ruiz114@purdue.edu**         |

## Result of This Project


## Goal of Rabbit

Team FOX wanted to make the application that can recommend the safe route to the destination. Definition of safe route is ‘The route that has less probability to experience crime’. The Rabbit App is based on an safety route recommendation algorithm that considers the distance and crime occurence rate, as well as factor which shows high association with the crime occurence rate. The boundary of the Rabbit App is limited in Chicago.

## Research Problem Statements

Public safety is one of the most significant concerns in the United States since crime rates in the United States are higher than other OECD countries. According to the [OECD Better Life Index](https://www.oecdbetterlifeindex.org/countries/united-states/), the homicide rate (the number of murders per 100,000 inhabitants) of United States is 6, which is 2.6 higher than the average of the OECD countries. Since major map applications, such as Google Map or Apple Map, recommend the route based on the distance from starting point to destination, we, the team Chasing FOX made the application that recommend the route based on distance and safety of the road.

## Research Novelty

(1) To predict the safe area, not only crime data but also the city facilities data were used in data analysis, and analyzed by various data analysis method.  
(2) Based on the result from (1), it is possible to explain the weight in the shortest-path algorithm, which was used to calculate the riskiness and safety score of the edge.


## Tech Stack

| Division        | Stack                                                                                                                                                                                                                                                                                                                                       |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Front-end       | <img src="https://img.shields.io/badge/react native-61DAFB?style=for-the-badge&logo=react&logoColor=black"> <img src="https://img.shields.io/badge/type script-007acc?style=for-the-badge&logo=typescript&logoColor=black"> <img src="https://img.shields.io/badge/Google Map API-1EA362?style=for-the-badge&logo=google&logoColor=DD4B3E"> |
| Back-end        | <img src="https://img.shields.io/badge/springboot-6DB33F?style=for-the-badge&logo=springboot&logoColor=black"> <img src="https://img.shields.io/badge/jpa-6DB33F?style=for-the-badge&logo=springboot&logoColor=black"> <img src="https://img.shields.io/badge/FLASK-181717?style=for-the-badge&logo=flask&logoColor=white">   <img src="https://img.shields.io/badge/Google Drive API-D9D9D9?style=for-the-badge&logo=googleDrive&logoColor=blue">                                                                                                                     |
| Code Management | <img src="https://img.shields.io/badge/git-F05032?style=for-the-badge&logo=git&logoColor=black"> <img src="https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white">                                                                                                                                     |
| Formatting      | <img src="https://img.shields.io/badge/prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=black">                                                                                                                                                                                                                                  |
| DB              | <img src="https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=black">                                                                                                                                                                                                                                        |


## Overall Process

<img align="center" width="500" src="https://user-images.githubusercontent.com/74031620/208148703-aa06b616-de77-451c-9d6a-a7f276b8f639.png">

## Database ERD

<img align="center" width="400" src="https://user-images.githubusercontent.com/74031620/208148714-40b624bf-4ec7-45c1-8e94-6c407df79236.png">

## Environment

Front-end
```
Xcode: 13.3.1
react-native-cli: 7.0.4
type-script: 6.10.4
react-native: 0.68.2
Home brew: 3.6.1
nvm: 0.39.1
node: 16.10.0
watchman: 2022.09.12
cocoapods: 1.11.3
JDK(Java): 11
ffi
```
Back-end

```
Java: 1.8.0
Tomcat: 9.0
Spring boot: 2.7.3
```

```
Ubuntu 20.04.3
Python: 3.8.10
Flask: 2.2.2
Werkzeug 2.2.2
apache2: 2.4.41(Ubuntu)
```

<details>
<summary>
Sign-up / Sign-in API manual
</summary>
<div markdown="1">
~~~Jihoo~~~
</div>
</details>


<details>
<summary>
Route API manual
</summary>
<div markdown="2">

- File Path

    <pre>
    📂/
      └📂etc
        └📂apache2
          └📂sites-available
              └📄rabbit.conf ✅
              └📄000-default.conf
              └📄default-ssl.conf
      └📂var
        └📂www
          └📂rabbit
            └📄fox.py ✅
            └📄way.py ✅
            └📄Google.py ✅
            └📄dataAnalysis.py ✅
            └📄httpd.wsgi ✅
            └📂admin
               └🧾2018_ped_raw_data.pkl
               └🧾al_riskscore_graph.pkl
               └🧾chicago_polygon_ratio.pkl
               └🧾crime_weight_info.pkl
               └🧾graph_edges.pickle
               └🧾r_c_f_ET_0.99996.pkl
               └🧾urban_5_dataset.pkl
            └📂userData
            └🧾default.pickle
            └📄client_secret.json
    </pre>

- To install apache2

    ```
    sudo apt-get update
    sudo apt-get install apache2
    ```

- To set rabbit.conf file to main conf

    ```
    sudo a2dissite 000-default
    sudo a2ensite rabbit
    ```

- To open port 80

    ```
    iptables -I INPUT 1 -p tcp --dport 80 -j ACCEPT
    sudo ufw allow 80/tcp
    ```

- To run code, install python packages

    ```
    pip install flask
    pip install --upgrade google-api-python-client google-auth-httplib2 google-auth-oauthlib
    pip install oauth2client
    pip install pandas
    pip install numpy
    pip install osmnx
    pip install networkx
    pip install matplotlib==3.1.3
    pip install plot
    pip install plotly
    pip install -U scikit-learn
    sudo apt-get install python-dev default-libmysqlclient-dev libssl-dev
    pip install flask-mysqldb
    pip install shapely
    pip install geopandas
    pip install Flask-API
    pip install pycaret
    ```

- To get Google Drive API credentials file

    [How to get credentials file](https://developers.google.com/drive/api/quickstart/python)
    
    → From this, you can get a credentials file. Then rename the file to 'client_secret.json'<br>
    → After you run this code once, you can get the token_drive_v3.pickle file. Then run again to start normally.


- For new generated token_drive_v3.pickle file

    ```
    sudo chmod token_drive_v3.pickle 777
    ```

- To (re)start apache2

    ```
    sudo systemctl restart apache2
    ```

</div>
</details>