# Project Rabbit

Navigation Algorithm & Service that guides you to avoid dangerous area

## Team ChasingFox

|                                                                  ![](https://github.com/chersiakingdom.png)                                                                   |                                                                    ![](https://github.com/21700340JuwonBaek.png)                                                                    |                                                                       ![](https://github.com/zihooy.png)                                                                        |                                                                   ![](https://github.com/YesHyeon.png)                                                                    |                                                                       ![](https://github.com/heewoneha.png)                                                                       |                                                                    ![](https://github.com/bruiz114.png)                                                                     |
| :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|                                                                                 **Daye Kim**                                                                                  |                                                                                   **Juwon Baek**                                                                                    |                                                                                  **Jihu Yang**                                                                                  |                                                                               **Hyun Roh**                                                                                |                                                                                 **Heewon Jeong**                                                                                  |                                                                              **Bryanna Ruiz**                                                                               |
|                                                                            **Kyunghee University**                                                                            |                                                                            **Handong Global University**                                                                            |                                                                          **Handong Global University**                                                                          |                                                                          **Kyunghee University**                                                                          |                                                                         **Chungbuk National University**                                                                          |                                                                            **Purdue University**                                                                            |
| <a href="mailto:rlaek4793@khu.ac.kr"><img src="https://img.shields.io/badge/EMAIL-F0F0F0?style=flat-square&logo=Gmail&logoColor=orange&link=mailto:rlaek4793@khu.ac.kr"/></a> | <a href="mailto:21700340@handong.ac.kr"><img src="https://img.shields.io/badge/EMAIL-F0F0F0?style=flat-square&logo=Gmail&logoColor=orange&link=mailto:21700340@handong.ac.kr"/></a> | <a href="mailto:zihooy@handong.ac.kr"><img src="https://img.shields.io/badge/EMAIL-F0F0F0?style=flat-square&logo=Gmail&logoColor=orange&link=mailto:zihooy@handong.ac.kr"/></a> | <a href="mailto:yeshyun@khu.ac.kr"><img src="https://img.shields.io/badge/EMAIL-F0F0F0?style=flat-square&logo=Gmail&logoColor=orange&link=mailto:yeshyun@khu.ac.kr"/></a> | <a href="mailto:jhjmo0719h@cbnu.ac.kr"><img src="https://img.shields.io/badge/EMAIL-F0F0F0?style=flat-square&logo=Gmail&logoColor=orange&link=mailto:jhjmo0719h@cbnu.ac.kr"/></a> | <a href="mailto:ruiz114@purdue.edu"><img src="https://img.shields.io/badge/EMAIL-F0F0F0?style=flat-square&logo=Gmail&logoColor=orange&link=mailto:ruiz114@purdue.edu"/></a> |

## Result of This Project

Video

[Application Activation Video](https://youtu.be/Z5gqHrr86ao)

Image
![resultApp](https://user-images.githubusercontent.com/74031620/208217084-8373ec6c-0d0b-4eaf-be46-bde740060fe5.png)

## Goal of Rabbit

Team FOX wanted to make the application that can recommend the safe route to the destination. Definition of safe route is ‘The route that has less probability to experience crime’. The Rabbit App is based on an safety route recommendation algorithm that considers the distance and crime occurence rate, as well as factor which shows high association with the crime occurence rate. The boundary of the Rabbit App is limited in Chicago.

## Research Problem Statements

Public safety is one of the most significant concerns in the United States since crime rates in the United States are higher than other OECD countries. According to the [OECD Better Life Index](https://www.oecdbetterlifeindex.org/countries/united-states/), the homicide rate (the number of murders per 100,000 inhabitants) of United States is 6, which is 2.6 higher than the average of the OECD countries. Since major map applications, such as Google Map or Apple Map, recommend the route based on the distance from starting point to destination, we, the team Chasing FOX made the application that recommend the route based on distance and safety of the road.

## Research Novelty

(1) Not only for the crime data, but also service request and city facility data were used and analyzed to define the road riskiness score.

(2) Road riskiness score is defined based on predicted crime density, and therefore, user can prevent the future crime.

(3) The personal risk perception to the type of crime was considered to define the road riskiness score. This can make application to recommend the personal safety route. It was applied in the direction(or route) recommendation service of the application.

## Tech Stack

| Division        | Stack                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Front-end       | <img src="https://img.shields.io/badge/react native-61DAFB?style=for-the-badge&logo=react&logoColor=black"> <img src="https://img.shields.io/badge/type script-007acc?style=for-the-badge&logo=typescript&logoColor=black"> <img src="https://img.shields.io/badge/Google Map API-1EA362?style=for-the-badge&logo=google&logoColor=DD4B3E">                                                                                                      |
| Back-end        | <img src="https://img.shields.io/badge/springboot-6DB33F?style=for-the-badge&logo=springboot&logoColor=black"> <img src="https://img.shields.io/badge/jpa-6DB33F?style=for-the-badge&logo=springboot&logoColor=black"> <img src="https://img.shields.io/badge/FLASK-181717?style=for-the-badge&logo=flask&logoColor=white"> <img src="https://img.shields.io/badge/Google Drive API-D9D9D9?style=for-the-badge&logo=googleDrive&logoColor=blue"> |
| Code Management | <img src="https://img.shields.io/badge/git-F05032?style=for-the-badge&logo=git&logoColor=black"> <img src="https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white">                                                                                                                                                                                                                                          |
| Formatting      | <img src="https://img.shields.io/badge/prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=black">                                                                                                                                                                                                                                                                                                                                       |
| DB              | <img src="https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=black">                                                                                                                                                                                                                                                                                                                                             |

## Overall Process

<img align="center" width="500" src="https://user-images.githubusercontent.com/74031620/208148703-aa06b616-de77-451c-9d6a-a7f276b8f639.png">

## Database ERD

<img align="center" width="400" src="https://user-images.githubusercontent.com/74031620/208148714-40b624bf-4ec7-45c1-8e94-6c407df79236.png">

## Front-end

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

<summary>First setting</summary>

[Official Document] (https://reactative.dev/)

1. Initial setting: [must follow] (https://reactative.dev/docs/environment-setup)
2. java 17 version should not be installed (11 version should be installed), and environmental variables should be set well (JAVA_HOME)
3. Must have Android SDK 30. Receive virtual machines with Nexus 5
4. [adb](https://developer.android.com/studio/releases/platform-tools) install
5. [m1 mac setting](https://qnrjs42.blog/react-native/m1-arm64-setting)

If the following error occurs during installation

```
error Error: Failed to install CocoaPods dependencies for iOS project, which is required by this template.
Please try again manually: "cd ./FoodDeliveryApp/ios && pod install".
```

You have to enter the command below.

```shell
cd ./RabbitFront/ios && pod install
```

```shell
cd RabbitFront # Move to Project Folder
npm run android # Android Run Commands
npm run ios # iOS Run Commands
```

If you write this code, the Metro server will appear.
If the server does not pop up and an error message appears, enter the command again while running the emulator.
It compiles the source code from the Metro server and sends it to the app.
If the Metro server is turned off, open another terminal.

```shell
npm start
```

To protect API address values and Google Maps API key values, you must create a '.env' file in the 'RabbitFront' folder.

```shell
# ./RabbitApp/RabbitFront/.env
API_URL='API_URL_VALUE'
DIRECTION_API_URL='API_URL_VALUE'
GOOGLE_API_URL='GOOGLE_MAP_API_URL_VALUE'
```

In order to display Google Maps, you must enter GOOGLE MAP API KEY in the file below.

```shell
# ./RabbitApp/RabbitFront/android/app/src/main/AndroidManifest.xml
...
android:value="Google Map API Key"
...
# ./RabbitApp/RabbitFront/ios/RabbitFront/AppDelegate.mm
[GMSServices provideAPIKey:@"Google Map API Key"]
```

<summary>
Folder Structure
</summary>

1. android: android native folder
2. ios: ios native folder
3. node_modules: node library
4. babel.config.js: barbell settings
5. index.js: main file
6. App.tsx: Default App Components
7. metro.config.js: metro settings file (use instead of webpack)
8. tscconfig.json: TypeScript settings
9. Android/app/src/main/java/com/fooddeliveryapp/mainActivity.java: Android activity to execute react code via js engine + bridge

<summary>
React Native Folder Structure
</summary>

1. src/assets: images, fonts, etc
2. src/pages: components per page
3. src/components: Other components
4. src/constants: polygon data
5. src/modules: native module
6. src/store: redux store setting
7. src/slices: redux slice
8. types:type definition

<summary>
After load an application
</summary>

1. Reloading with cmd + R
2. Debug menu with cmd + D
3. Developer tools available with Debugging with Chrome
4. Configure Bundler allows you to change the metro server port
5. Show Perf Monitor lets you measure frames

## Back-end

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
⚙ Sign-up / Sign-in API manual
</summary>
<div markdown="1">

Before you run the code, Java 1.8 and IntelliJ are required. And the database is needed. The schema of the database is as follows:

1. Install Java 8
   You can download Java 8 here (https://www.oracle.com/java/technologies/downloads/).

2. git clone https://github.com/ChasingFOX/RabbitApp.git

3. Open IntelliJ
   You can download IntelliJ here (https://www.jetbrains.com/idea/download/#section=mac).

4. Open your git folder as a new project.

5. Edit the database configuration file. Enter your database information in the ‘application.properties’ file. <br> path: RabbitApp/RabbitBack/src/main/resources/application.properties

   ```
       spring.datasource.url=CHANGE TO YOUR OWN DB URL
       spring.datasource.username=CHANGE TO YOUR USERNAME
       spring.datasource.password=CHANGE TO YOUR PASSWORD
   ```

6. Add ‘Run Configuration’.
   In this process, you have to set the module to ‘Java 1.8’ and main class as ‘com.purdue.project.RabbitBackApplication’.

7. Run the code.

</div>
</details>

<details>
<summary>
⚙ Route API manual
</summary>
<div markdown="2">

You should follow the below instructions.

1. Install ubuntu, python3, flask, apache2.
2. Get Google Drive API credentials file.
3. Download all code files from GitHub(RabbitBackFlask). And download all pickle files from [here](https://drive.google.com/drive/folders/1dEzDcpUyoP_Ez0LBw91PIL_B53y5vyFH?usp=sharing).
4. In Ubuntu, install python packages that I wrote below.
5. Do some apache2 environment settings that I wrote below.
6. In fox.py, change from original to `app.config['MYSQL_HOST'] = 'YOUR_LOCAL_HOST_IP'`, `folder_id = 'YOUR_OWN_GDRIVE_FOLDER_ID'`
7. In rabbit.conf, change from original to `ServerName YOUR_LOCAL_HOST_IP`
8. Start apache2, and request the API once. Then you can get the API key token. You need to do this. `sudo chmod 777 token_drive_v3.pickle`
9. After that, restart apache2, and request the API anytime!

- File Path

    <pre>
    📂/
      └📂etc
        └📂apache2
          └📂sites-available
              └📄rabbit.conf ✅
              └📄000-default.conf
              └...
      └📂var
        └📂www
          └📂rabbit
            └📄fox.py ✅
            └📄way.py ✅
            └📄Google.py ✅
            └📄dataAnalysis.py ✅
            └📄httpd.wsgi ✅
            └📂admin
               └📖2018_ped_raw_data.pkl
               └📖al_riskscore_graph.pkl
               └📖chicago_polygon_ratio.pkl
               └📖crime_weight_info.pkl
               └📖graph_edges.pickle
               └📖r_c_f_ET_0.99996.pkl
               └📖urban_5_dataset.pkl
            └📂userData
               └📖default.pickle
            └📄client_secret.json
    </pre>

- To install apache2

  ```
  sudo apt-get update
  sudo apt-get install apache2
  ```

- To set rabbit.conf file to main conf in '/etc/apache2/sites-available'

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
