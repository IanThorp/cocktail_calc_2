$(document).ready(function(){
	ingredientModule();
	statsModule();
})


var ingredientModule = function() {
	var ingredients = {
		minimumRows: 3,
		blankIngredient: {name: null, volume: null, unit: null, abv: null},
		ingredients: [{name: 'Campari', volume: '8', unit: 'floz', abv: '20' }, {name: 'Averna', volume: '9', unit: 'ml', abv: '25'}],
		init: function(){
			this.cacheDom();
			this.bindEvents();
			this.render();
		},
		cacheDom: function() {
			this.$el = $('#ingredientModule');
			this.$addIngredientButton = this.$el.find('#addIngredientButton');
			this.$resetButton = this.$el.find('.resetButton')
			this.$additionalIngredients = this.$el.find('.additionalIngredients');
			this.template = this.$el.find('#ingredient-template').html();
		},
		bindEvents: function() {
			this.$addIngredientButton.on('click', this.addIngredient.bind(this));
			this.$additionalIngredients.delegate('.del', 'click', this.deleteIngredient.bind(this))
			this.$resetButton.on('click', this.resetIngredients.bind(this));
			this.$calculateButton.on('click', this.calculateRecipe.bind(this));
		},
		render: function() {
			var data = {
				ingredients: this.ingredients
			};
			this.$additionalIngredients.html(Handlebars.compile(this.template)(data));
		},
		addIngredient: function() {
			this.ingredients.push(this.blankIngredient);
			this.render();
		},
		deleteIngredient: function(event) {
			var $remove = $(event.target).closest('li');
			var i = this.$additionalIngredients.find('li').index($remove);
			this.ingredients.splice(i, 1);
			this.render();
		},
		resetIngredients: function() {
			this.ingredients = []
			this.createMinNumRows(this.minimumRows);
		},
		createMinNumRows: function(minimum) {
			for(var i = this.ingredients.length; i < minimum; i++){
				this.addIngredient();
			}
		},
		calculateRecipe: function(){
			var stats = {}
			this.ingredients = this.getIngredientsSpecs();
			$.each(this.ingredients, function(){
				stats.initialAbv 
			})
		},
		getIngredientsSpecs: function(){
			this.$ingredients = $('.additionalIngredients')
			this.$ingredients.find()
		}
	};

	ingredients.init();
}

var statsModule = function(){
	var stats = {

	}
}