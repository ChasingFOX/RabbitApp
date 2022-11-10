# (TBD - In progress)

## Project Rabbit

Navigation Algorithm & Service that guides you to avoid dangerous area

## Team ChasingFox

| ![](https://github.com/chersiakingdom.png) | ![](https://github.com/21700340JuwonBaek.png) | ![](https://github.com/zihooy.png) | ![](https://github.com/YesHyeon.png) | ![](https://github.com/heewoneha.png) | ![](https://github.com/bruiz114.png) |
| :----------------------------------------: | :-------------------------------------------: | :--------------------------------: | :----------------------------------: | :-----------------------------------: | :----------------------------------: |
|                **Daye Kim**                |                **Juwon Baek**                 |           **Jihu Yang**            |             **Hyun Roh**             |            **Heewon Jeong**            |           **Bryanna Ruiz**           |
|          **Kyunghee University**           |         **Handong Global University**         |   **Handong Global University**    |       **Kyunghee University**        |        **Chungbuk University**        |        **Purdue University**         |

## Goal of Rabbit

Team FOX wanted to make the application that can recommend the safe route to the destination. Definition of safe route is ‘The route that has less probability to experience crime’. The Rabbit App is based on an safety route recommendation algorithm that considers the distance and crime occurence rate, as well as factor which shows high association with the crime occurence rate. The boundary of the Rabbit App is limited in Chicago.

## Research Problem Statements

Public safety is one of the most significant concerns in the United States since crime rates in the United States are higher than other OECD countries. According to the [OECD Better Life Index](https://www.bbc.com/news/57581270), the homicide rate (the number of murders per 100,000 inhabitants) of United States is 6, which is 2.6 higher than the average of the OECD countries. Since major map applications, such as Google Map or Apple Map, recommend the route based on the distance from starting point to destination, we, the team Chasing FOX made the application that recommend the route based on distance and safety of the road.

## Research Novelty

(1) To predict the safe area, not only crime data but also the city facilities data were used in data analysis, and analyzed by various data analysis method.  
(2) Based on the result from (1), it is possible to explain the weight in the shortest-path algorithm, which was used to calculate the riskiness and safety score of the edge.

## Overview

<img align="center" width="500" alt="image" src="https://user-images.githubusercontent.com/101122651/196250447-9df4550a-6066-4f6e-8414-6f93e017a336.png">

## Tech Stack

| Division        | Stack                                                                                                                                                                                                                                                                                                                                       |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Front-end       | <img src="https://img.shields.io/badge/react native-61DAFB?style=for-the-badge&logo=react&logoColor=black"> <img src="https://img.shields.io/badge/type script-007acc?style=for-the-badge&logo=typescript&logoColor=black"> <img src="https://img.shields.io/badge/Google Map API-1EA362?style=for-the-badge&logo=google&logoColor=DD4B3E"> |
| Back-end        | <img src="https://img.shields.io/badge/springboot-6DB33F?style=for-the-badge&logo=springboot&logoColor=black"> <img src="https://img.shields.io/badge/jpa-6DB33F?style=for-the-badge&logo=springboot&logoColor=black"> <img src="https://img.shields.io/badge/FLASK-181717?style=for-the-badge&logo=flask&logoColor=white">                                                                                                                       |
| Code Management | <img src="https://img.shields.io/badge/git-F05032?style=for-the-badge&logo=git&logoColor=black"> <img src="https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white">                                                                                                                                     |
| Formatting      | <img src="https://img.shields.io/badge/prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=black">                                                                                                                                                                                                                                  |
| DB              | <img src="https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=black">                                                                                                                                                                                                                                        |

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
Python: 3.8.10
Flask: 2.2.2
Werkzeug 2.2.2
apache2: 2.4.41(Ubuntu)
```