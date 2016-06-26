var ingredientModule = (function($) {

	var $ul ,$recipeForm ,$calculateButton ,$ingredientEntries ,$addIngredientButton ,ingredientTemplate

	function init(){
		cacheDom();
		bindEvents();
	}

	function cacheDom() {
		$ul = $('#ingredientModule');
		$recipeForm = $ul.find('.new_recipe');
		$calculateButton = $ul.find('.calculateButton');
		$ingredientEntries = $ul.find('.ingredientEntries');
		$addIngredientButton = $ul.find('#addIngredientButton');
		ingredientTemplate = $ul.find('#ingredient-template').html();
	}

	function bindEvents() {
		$addIngredientButton.on('click', addIngredientRow);
		$recipeForm.on('ajax:success', submitRecipe);
		$recipeForm.on('ajax:error', ajaxError);
		$ul.delegate('.deleteIngredientButton', 'click', deleteIngredient);
	}

	function submitRecipe(e, data) {
		statsModule.displayStats(data.recipe);
	}

	function ajaxError(error) {
		console.log(error);
	}

	function addIngredientRow(e) {
		if (typeof e === "object"){
			e.preventDefault();
		}
		$ingredientEntries.append(ingredientTemplate);
	}

	function deleteIngredient(e) {
		if (typeof e === "object"){
			var $remove = $(e.target).closest('li');
		}// var i = this.$ul.find('li').index($remove);
		else if (typeof e === "number"){
			var $remove = $ul.find('.ingredientEntries').get(e)
		} else {
			console.log("Argument passed must be a number.")
		}

		$remove.remove();
	}

	$(function() {
		init()
	});

	return {
		submitRecipe: submitRecipe,
		addIngredientRow: addIngredientRow,
		deleteIngredient: deleteIngredient
	}

})(jQuery);


var statsModule = (function($){

	var $ul, $statsList, statsTemplate

	function init() {
		cacheDom();
	}

	function cacheDom() {
		$ul = $('#statsModule');
		$statsList = $ul.find('#statsList');
		statsTemplate = $statsList.html();
		console.log("stats Template: " + statsTemplate)
	}


	function displayStats(recipe){
		$statsList.find('.statsInitAbv').text("Initial ABV: " + recipe.initial_abv);
		$statsList.find('.statsInitVolume').text("Initial Volume: " + recipe.initial_volume);
		$statsList.find('.statsDilution').text("Dilution: " + recipe.dilution);
		$statsList.find('.statsFinalAbv').text("Final ABV: " + recipe.final_abv);
		$statsList.find('.statsFinalVolume').text("Final Volume: " + recipe.final_volume);		
	}


	$(function(){
		init();
		console.log('loaded');
	});

	return {
		init: init,
		displayStats: displayStats
	};

})(jQuery);

