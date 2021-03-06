Rails.application.routes.draw do
	get '/recipes/calculate', to: 'recipes#calculate'
	get '/recipes/save', to: 'recipes#save'
	resources :recipes
	resources :ingredients_recipes
	resources :ingredients
	devise_for :users
	get '/users/:id', to: 'user#show', :as => 'user_show'
	root 'welcome#index'
end
