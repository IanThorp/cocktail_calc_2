var ingredientModule = (function($) {

	var $ul ,$recipeForm ,$ingredientEntries ,$addIngredientButton ,ingredientTemplate, $clickRefresh, $batchOptions, $hiddenBatchNum, $hiddenBatchInputUnit, $hiddenRecipeOutputUnit, $saveButton

	function init(){
		cacheDom();
		bindEvents();
	}

	function cacheDom() {
		$ul = $('#ingredientModule');
		$recipeForm = $ul.find('.new_recipe');
		$ingredientEntries = $ul.find('.ingredientEntries');
		$addIngredientButton = $ul.find('#addIngredientButton');
		$clickRefresh = $ul.find('.click-refresh');
		$batchOptions = $('.batch-options');
		$hiddenBatchNum = $recipeForm.find('.batch-number-hidden');
		$hiddenBatchInputUnit = $recipeForm.find('.batch-input-unit-hidden');
		$hiddenRecipeOutputUnit = $recipeForm.find('.recipe-output-unit-hidden');
		$saveButton = $ul.find('#save-button');
		ingredientTemplate = $ul.find('#ingredient-template').html();
	}

	function bindEvents() {
		$recipeForm.on('focusout', recalculate);
		$clickRefresh.on('click', recalculate);
		$batchOptions.on('focusout', recalculate)
		$('.batch-unit-toggle').on('click', batchToggleButton);
		$addIngredientButton.on('click', addIngredientRow);
		$saveButton.on('click', saveRecipe)
		$recipeForm.on('ajax:success', submitRecipe);
		$recipeForm.on('ajax:error', ajaxError);
		$ul.delegate('.deleteIngredientButton', 'click', deleteIngredient);
	}

	function saveRecipe(e, data) {
		addBatchInfo();
		$recipeForm.attr('action', '/recipes/save')
		.submit()
		.attr('action', '/recipes/calculate')
	}

	function submitRecipe(e, data) {
		if (typeof data.batch != 'undefined') {
			displayBatchStats(data)
			statsModule.displayStats(data.recipe);
		} else {
			if (data.success === true) {
				var recipeName = data.data.recipe.name;
				$('#alert-messages').append('<div class="alert alert-success fade in"><a href="#" class="close" data-dismiss="alert">&times;</a><strong>' + recipeName + '</strong> recipe has been saved.</div>')
			}
		}
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
		}
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
		if($hiddenRecipeOutputUnit.val() === 'ml') {
			$hiddenRecipeOutputUnit.val('fl oz');
		} else {
			$hiddenRecipeOutputUnit.val('ml');
		}
		$recipeForm.submit();
	}

	function displayBatchStats(data) {
		$('.batch-stats').html(data.batch.html);
	}

	function recalculate() {
		addBatchInfo();
		$recipeForm.attr('novalidate', true)
		.submit()
		.removeAttr('novalidate')
	}

	$(document).on('page:change', function() {
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
		$statsList.find('.statsInitAbv.stats-value').text((Math.round(recipe.initial_abv * 10000) / 100) + " %");
		$statsList.find('.statsInitVolume.stats-value').text((recipe.initial_volume) + " " + recipe.output_unit);
		$statsList.find('.statsDilution.stats-value').text((recipe.dilution) + " " + recipe.output_unit) ;
		$statsList.find('.statsFinalAbv.stats-value').text((Math.round(recipe.final_abv * 10000) / 100) + " %");
		$statsList.find('.statsFinalVolume.stats-value').text((recipe.final_volume) + " " + recipe.output_unit);
	}


	$(document).on('page:change', function() {
		init();
	});

	return {
		init: init,
		displayStats: displayStats
	};

})(jQuery);

