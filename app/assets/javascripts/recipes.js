$(document).on('page:change', function() {
	deleteRecipeListener();
})

function deleteRecipeListener() {
	$('.delete-recipe').on('click', function() {
		var target_div = $(this).closest('div')
		target_div.remove()
	})
}
