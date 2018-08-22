# Bot-Management

This application provides a dashboard to create and manage Merck 
Databots.

## Overview
The project is based on the *Vue.js* framework, a state of the art
Javascript framework to build websites. The *Bootstrap* library is
used for easier styling and responsiveness. The distribution is 
managed by *Webpack* and *babel*. While in development, the code can
be run in a special *node.js* dev-server, which allows hot-reloading. For production, 
the code must be built and mininfied by *node.js* to be then served statically.

#####Tech Stack
- [Vue.js](https://vuejs.org/), including [Vue Router](https://router.vuejs.org/) and [Vuex Store](https://vuex.vuejs.org/)
- [Bootstrap](https://vuejs.org/) used with the [Vue.js Bootsrap Wrapper](https://bootstrap-vue.js.org/docs/)
- [less](http://lesscss.org/) as CSS preprocessor (less code than CSS)
- [Axios](https://github.com/axios/axios) for HTTP requests
- [Webpack](https://webpack.js.org/)

#####Useful commands
- install dependencies
```bash 
npm install 
```
- serve with hot reload at localhost 
```bash 
npm run dev
```
- serve for production
```bash 
npm run dev
```
- build for production with minification
```bash 
npm run build
```

##File Structure
The basic file structure was initially created using the *Vue.js client*
and is based on the guidelines for this framework. The **build** and
**config** folders are used by the *node.js* server to run the enviroment.
Files created with the 'build for production' command are saved in the **dist** file.
These files can copied on webserver like *nginx* or *Apache* 
to be served. The **node_modules** folder stores the used libraries 
and is filled by *node.js* automatically. Moreover, the root folder
contains the *babel* and *eslint* config files, *package.json* for dependencies
and the basic HTML file which *Vue* builds on.

The core of the project is stored in the **src** folder, where all the custom code
is located. It contains these subfolders:
- **views**: *Vue* components for each subroute of the dashboard. If a subroute uses
multiple components, they are combined in a subfolder.   
- **components**: *Vue* components which are meant for reuse in multiple views.   
- **assets**: Static media files like logos and icons 
- **style**: Global *less* files    
- **js**: additional code e.g. the API handler
- **lang**: files that enable translation

##Functionality
#####*main.js* - Vue Setup
This files sets up the Vue framework and imports the used modules. Global used
components are imported here. 

#####*.vue files* - Components
Components bundle certain functionalities and can be reused inside the application.
They contain the HTML layout, the javascript logic in form of a *Vue* object and 
style options in form of *css* or *less*.

#####*App.vue* - Basic Layout
This is the root component of the application that is used for all subroutes.
Basic style is defined here.

#####*js/store.js* - VUEX store
The store serves as central point for storing data and sharing it in different 
components. Custom code here handles the communication to the API. Data fetched
from the API should be loaded, stored and manipulated in the store.

#####*js/api.js* - API wrapper
The code provides a wrapper for loopback backend. It handles the authentication,
formats the calls and delivers the requested data. It also able to
establish a server sent event connection. The *axios* library is used for
HTTP requests.

#####*js/tools.js* - Utilities
JS functions that are used multiple times inside the code are stored here.
They are imported into the *Vue* instance and can be easily accessed in all
components. Example functionalities are cookie getting/setting or deep copying objects.

#####*router.js* - Routing
The router helps implementing single page applications with *Vue*, which means
that you are able to navigate on the website using the url (e.g. *emd-databots.com/admin*).
The subroutes are defined here and corresponding view component is imported.
Router content is displayed in *App.vue* inside the <router-view> tag.

#####*urlConfig.json* - Staging configuration
This file is used to configure the different URLs for the staging (development,
testing, production). It is possible to use different APIs for each stage. The 
stage is detected by the URL of the website. If the hostname changes, make
sure you include it here.

#####*lang/* - Translation
Translation is handled via language *.json* files for each language. They contain
a key which is used inside the components and the corresponding translation value.
The setup is handled in *index.js*. If you want to add a supported language, add
an entry in *support.json*. To streamline the process of adding new language keys,
*build/applyEnAsTemplate.js* can be executed as a *node.js* script. The english language
pack is used as template. So you would add the new key inside this file, execute
the *node* script and the new keys will be added to all other language files.

