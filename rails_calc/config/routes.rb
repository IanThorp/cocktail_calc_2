Rails.application.routes.draw do
  resources :recipes
  resources :ingredients_recipes
  resources :ingredients
  devise_for :users
  root 'welcome#index'
end
