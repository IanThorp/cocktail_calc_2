# cocktail_calc_2
The reason for this release is to completely redo the Cocktail Calculator App.
The old version has so much spaghetti code that it was worth it to just restart from scratch. 

##Summary
This web app will allow you to enter a single cocktail recipe, and number of batches.
You will than be given the proportions necessary to create batches of the desired quantity.

One of the key features is the automatic water dilution depending on type of preparation method (e.g. stir, shake, build).

##Features
* Written in Ruby (Rails), JavaScript, and jQuery
* Not hosted on the net yet... will come soon. 

##To Contribute
* Clone to local computer
* Create new feature branch
* Write some code
	* Perform something on the to do list below
	* Fix bugs
	* Create a new feature I have never though of
* Submit a pull request

##To Do

###MVP
* Need an elegant design
* Possibly add PubSub to JavaScript(need to do research on pros and cons)
* Statistics Module
	* Display statistics of recipe (calculations are done, just need to display)
	* Make it prettier than just a list
* Batching Module
	* Create HTML and CSS for displaying this.
	* Add form and listeners for getting number of batches
* Recipe Module
	* Display final recipe information (ingredients and quantities)
	* Allow easy printing and saving (PDF maybe?)
* Add front end for user auth (Log in, Log out, Register)
* User display page for all saved recipes
* Easily shareable recipes (Bit.ly style links)
* Option to save recipes to data base (DB entries are already created)

###Stretch
* HTTPS on all user auth pages
* Auto populating ingredients while typing
