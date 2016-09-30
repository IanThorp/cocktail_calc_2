var ingredientModule = (function($) {

	var $ul ,$recipeForm ,$ingredientEntries ,$addIngredientButton ,ingredientTemplate, $ingredientOptions, $batchOptions, $hiddenBatchNum, $hiddenBatchInputUnit, $hiddenBatchOutputUnit

	function init(){
		cacheDom();
		bindEvents();
	}

	function cacheDom() {
		$ul = $('#ingredientModule');
		$recipeForm = $ul.find('.new_recipe');
		$ingredientEntries = $ul.find('.ingredientEntries');
		$addIngredientButton = $ul.find('#addIngredientButton');
		$ingredientOptions = $ul.find('.ingredientsOptions');
		$batchOptions = $('.batch-options');
		$hiddenBatchNum = $recipeForm.find('.batch-number-hidden');
		$hiddenBatchInputUnit = $recipeForm.find('.batch-input-unit-hidden');
		$hiddenBatchOutputUnit = $recipeForm.find('.batch-output-unit-hidden');
		ingredientTemplate = $ul.find('#ingredient-template').html();
	}

	function bindEvents() {
		$recipeForm.on('focusout', function() {
			addBatchInfo();
			$recipeForm.submit();
		})
		$ingredientOptions.on('click', function() {
			addBatchInfo();
			$recipeForm.submit();
		})
		$batchOptions.on('focusout', function() {
			addBatchInfo();
			$recipeForm.submit();
		})
		$('.batch-unit-toggle').on('click', batchToggleButton);
		$addIngredientButton.on('click', addIngredientRow);
		$recipeForm.on('ajax:success', submitRecipe);
		$recipeForm.on('ajax:error', ajaxError);
		$ul.delegate('.deleteIngredientButton', 'click', deleteIngredient);
	}

	function submitRecipe(e, data) {
		displayBatchStats(data)
		statsModule.displayStats(data.recipe);
	}

	function ajaxError(error) {
		alert(error);
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

	function addBatchInfo() {
		var batchNum = $batchOptions.find('.batch-num').val();
		var batchInputUnit = $batchOptions.find('.batch-input-unit').val();
		var batchOutputUnit = $batchOptions.find('.batch-output-unit').val();
		$hiddenBatchNum.val(batchNum);
		$hiddenBatchInputUnit.val(batchInputUnit);
	}

	function batchToggleButton() {
		console.log($hiddenBatchOutputUnit)
		if($hiddenBatchOutputUnit === 'ml') {
			$hiddenBatchOutputUnit.val('floz');
		} else {
			$hiddenBatchOutputUnit.val('ml');
		}
		$recipeForm.submit();
	}

	function displayBatchStats(data) {
		// var multiplier = data.batch.multiplier;
		// var ingredients = data.ingredients;
		// var batchHtml = ''
		// for (var i = 0; i < ingredients.length; i++) {
		// 	console.log(ingredients[i])
		// 	if (ingredients[i].name.length > 0){
		// 		batchHtml += '<li>' + ingredients[i].name + ': ' + (ingredients[i].volume_ml * multiplier) + ' mL</li>'
		// 	}
		// }
		$('.batch-stats').html(data.batch.html);
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
	}


	function displayStats(recipe){
		$statsList.find('.statsInitAbv .stats-value').text(Math.round(recipe.initial_abv * 10000) / 100);
		$statsList.find('.statsInitVolume .stats-value').text(recipe.initial_volume);
		$statsList.find('.statsDilution .stats-value').text(recipe.dilution);
		$statsList.find('.statsFinalAbv .stats-value').text(Math.round(recipe.final_abv * 10000) / 100);
		$statsList.find('.statsFinalVolume .stats-value').text(recipe.final_volume);		
	}


	$(function(){
		init();
	});

	return {
		init: init,
		displayStats: displayStats
	};

})(jQuery);

