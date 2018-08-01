# Rails DB Interactive
This web application is an interactive diagramming tool made specifically for Ruby on Rails apps.
The app uses multiple/single file upload to read schema and model files and create interactive visual
models with that information. With the help of HTML5 canvas as well as the interactive functionality
of the visual models, a user can create a personalized diagram of their Rails database. This app is
specifically targeted at users who are trying to learn an unfamiliar Rails database.

## website url
https://rails-db-interactive.herokuapp.com/

## How to use the Application
To get the most from this application, it is highly recommended to only use this app on a decent sized monitor (24inch+) to allow for diagramming space. To begin diagramming, you must first upload your model files before uploading the schema.  The schema
upload depends on data from the model files in order to combine them properly.

Once the files are uploaded, the application will create visual models with multiple interactive properties.
The models are draggable, resizable, font-adjustable, and rotatable. The models can also be double clicked to display
their attributes and associations on the bottom left and bottom right of the screen respectively.
The individual associations themselves are all clickable text that will visually highlight the associated models.

The canvas button located on the top navigation bar can be clicked to activate the canvas.  Once active, the user can use the canvas color buttons to draw color-coded connections between models. Directional and rotatable arrows can be added by clicking the "Add Arrow" button in the Model Menu side-bar. These arrows can be combined with the canvas drawings to show association directions. All of the menus other than the top-menu bar at this point can be toggled off to allow for more diagramming space.

## Demo screencast
Below is a link to a 2 minute screencast demonstrating the functionality of the app.

https://vimeo.com/260510804

## Screenshot of potential diagram
Below is an example of a potential color-coded diagram with directional arrows.

![Alt text](screenshots/diagram-example.png?raw=true "Example Diagram")


## Installation
This application is very simple to setup. It is written in vanilla javascript and no framework is used.
At this point, the app adds pluralize.js and normalize.css. I have not implemented testing yet, but
plan to use Mocha and chai as well as JSDOM. Cloning the app is all that is required to get started working
on it.


## Contributing
I am relatively new to developing web applications so I strongly encourage criticism of the code from general to specific.
Contributions related to structuring the code for reusability and readability would be very beneficial.  
I am very open to suggestions of what direction to take this application and finding new ways to make the app more useful for people that are
trying to absorb a new Rails database.  This is my first experience using the HTML5 canvas, so any ideas or contributions
related to improving the functionality of the canvas would be very useful as well.  


## Code of Conduct
As long as you are respectful to myself along with anyone else involved in contributing to this application,
you are more than welcome to be a part of developing this application further.  

## License
This project is licensed under the MIT License.
