$(document).ready(function(){
	ingredientModule();
	statsModule();
})


var ingredientModule = function() {
	var ingredients = {
		ingredients: [],
		init: function(){
			this.cacheDom();
			this.bindEvents();
		},

		cacheDom: function() {
			this.$el = $('#ingredientModule');
			this.$recipeForm = this.$el.find('.new_recipe');
			this.$calculateButton = this.$el.find('.calculateButton');
			this.$ingredientEntries = this.$el.find('.ingredientEntries');
			this.$addIngredientButton = this.$el.find('#addIngredientButton');
			this.ingredientTemplate = this.$el.find('#ingredient-template').html();
		},

		bindEvents: function() {
			this.$addIngredientButton.on("click", this.addIngredientRow.bind(this));
			this.$recipeForm.on("ajax:success", this.submitRecipe.bind(this));
			this.$recipeForm.on("ajax:error", this.ajaxError.bind(this));
			this.$el.delegate('.deleteIngredientButton', 'click', this.deleteIngredient.bind(this));
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
			var i = this.$el.find('li').index($remove);

			$remove.remove()
		}
	}

	ingredients.init();
}

var statsModule = function(){
	var stats = {

	}
}

