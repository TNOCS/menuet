# menuet
A client-server application for serving dynamic menus - created to simulate the contribution of cyber or social media analysts in a mission.

The basic idea is as follows: when you click an item in the menu, any associated actions are executed, e.g. publish a VBS request on the Kafka bus. When a response is received, the menu is updated, and new menu entries may become available.

A default menu is displayed at start up. In the HOME menu, you can reset the server (and reload the browser).

You can also create your own menu and specify it on the command line using the -f command. For an example of a menu structure, see [menu.yaml](https://github.com/TNOCS/menuet/blob/master/packages/server/config/menu.yaml).

Updating the menu is based on events: every item you click generates an event (namely the menuId). When an external response is received, an event may be generated too (when the request SUCCEEDED), and treated similarly. Each raised event is matched with all menuItem conditions. If there is a match, the menuItem is activated and displayed.

Also, when you click a menuItem, and the `multiple` property is 1 or more, the `multiple` property is decreased by 1. When it reaches 0, the menuItem is hidden. menuItems with a `multiple` property of -1 are always visible.

## Install globally

`npm i -g menuet-server`

## Run

`menuet-server --help` to see all options, e.g.

`menuet-server -r -k localhost:3052 -s localhost:3051`

-r is only needed if you want to publish some default schema's to Apache Kafka (using the [DRIVER+ test-bed](https://github.com/DRIVER-EU/test-bed)).

## Build

`npm install`

and use

`npm run serve`

to start the dev servers.

In addition, you can fake the VBS3 responses by running the `echo-service` using `node dist/echo-service.js`. Every VBS-action-request is matched with a VBS3-action-response with a status SUCCEEDED.