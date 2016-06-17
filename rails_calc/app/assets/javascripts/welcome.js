(function() {
	var ingredients = {
		ingredients: [{name: 'Campari'}, {name: 'Averna'}],
		init: function(){
			this.cacheDom();
			this.bindEvents();
			this.render();
		},
		cacheDom: function() {
			this.$el = $('#ingredientModule');
			this.$button = this.$el.find('button');
			this.$input = this.$el.find('input');
			this.$ul = this.$el.find('ul');
			this.template = this.$el.find('#ingredient-template');
		},
		bindEvents: function() {
			this.$button.on('click', this.addIngredient.bind(this));
			this.$ul.delegate('i.del', 'click', this.deleteIngredient.bind(this))
		},
		render: function() {
			var data = {
				names: this.ingredientNames
			};
			this.$ul.html(Handlebars.compile('<h1>{{name}} howdy<h1>', data.names)());
		},
		addIngredient: function() {
			this.names.push(this.$input.val());
			this.render();
			this.$input.val('');
		},
		deleteIngredient: function(event) {
			var $remove = $(event.target).closest('li');
			var i = this.$ul.find('li').index($remove);
			this.names.splice(i, 1);
			this.render();
		}

	};

	ingredients.init();

}())