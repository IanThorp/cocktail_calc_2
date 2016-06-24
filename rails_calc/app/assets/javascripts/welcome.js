$(document).ready(function(){
	ingredientModule();
	statsModule();
})

var ingredientModule = function() {
	var ingredients = {
		init: function(){
			this.cacheDom();
			this.bindEvents();
		},

		cacheDom: function() {
			this.$ul = $('#ingredientModule');
			this.$recipeForm = this.$ul.find('.new_recipe');
			this.$calculateButton = this.$ul.find('.calculateButton');
			this.$ingredientEntries = this.$ul.find('.ingredientEntries');
			this.$addIngredientButton = this.$ul.find('#addIngredientButton');
			this.ingredientTemplate = this.$ul.find('#ingredient-template').html();
		},

		bindEvents: function() {
			this.$addIngredientButton.on('click', this.addIngredientRow.bind(this));
			this.$recipeForm.on('ajax:success', this.submitRecipe.bind(this));
			this.$recipeForm.on('ajax:error', this.ajaxError.bind(this));
			this.$ul.delegate('.deleteIngredientButton', 'click', this.deleteIngredient.bind(this));
		},

		submitRecipe: function(e, data) {
			console.log(data);
		},

		ajaxError: function() {
			console.log(error);
		},

		addIngredientRow: function(e) {
			e.preventDefault();
			this.$ingredientEntries.append(this.ingredientTemplate);
		},

		deleteIngredient: function(e) {
			var $remove = $(e.target).closest('li');
			var i = this.$ul.find('li').index($remove);

			$remove.remove()
		}
	}
	ingredients.init()
}

var statsModule = function(){
	var stats = {
		init: function(){
			this.bindEvents
		},

		bindEvents: function(){
			
		},
	}
}

