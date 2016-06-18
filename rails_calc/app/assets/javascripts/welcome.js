$(document).ready(function(){
	ingredientModule();
	statsModule();
	$('#new_recipe').on('ajax:success', function(e, data, status, xhr){
		console.log("made it here");
		console.log(data);
	})
})


var ingredientModule = function() {
	var ingredients = {
		ingredients: [],
		init: function(){
			this.cacheDom();
		},

		cacheDom: function(){
			this.$el = $('#ingredientModule')
		},

		bindListeners: function(){

		},
	}


	ingredients.init();
}

var statsModule = function(){
	var stats = {

	}
}

// {name: 'Campari', volume: '8', unit: 'floz', abv: '20' }, {name: 'Averna', volume: '9', unit: 'ml', abv: '25'}