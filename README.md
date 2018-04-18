# menuet
A client-server application for serving dynamic menus - created to simulate the contribution of cyber or social media analysts in a mission.

## Install globally

`npm i -g menuet-server`

## Run

`menuet-server -r -k localhost:3052 -s localhost:3051`

-r is only needed if you want to publish some default schema's to Apache Kafka (using the [DRIVER+ test-bed](https://github.com/DRIVER-EU/test-bed)).

## Build

`npm install`

and use

`npm run serve`

to start the dev servers.