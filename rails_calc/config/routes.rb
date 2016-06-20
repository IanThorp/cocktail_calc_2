Rails.application.routes.draw do
	get '/recipes/calculate', to: 'recipes#calculate'
	resources :recipes
	resources :ingredients_recipes
	resources :ingredients
	devise_for :users
	root 'welcome#index'
end
