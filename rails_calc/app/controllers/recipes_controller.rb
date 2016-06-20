class RecipesController < ApplicationController

	def index
		p params
		p "hit index route recipes"
		respond_to do |format|
			format.json {render json: params}
			format.html 
		end
	end


	def create
		data = { recipe: params[:recipe], ingredients: params[:ingredients]}
		respond_to do |format|
			format.json {render json: data}
			format.html
		end
	end

	def calculate
		data = { recipe: params[:recipe], ingredients: params[:ingredients]}
		data[:ingredients].each do |ingredient|
			ingredient[:volume_ml] = volume_to_ml(ingredient)
		end

		respond_to do |format|
			format.json {render json: data}
			format.html
		end
	end

	private

	def volume_to_ml(ingredient)
		ingredient[:volume] = ingredient[:volume].to_i
		volume_ml = 0
		case ingredient[:unit]
		when "floz"
			volume_ml = ingredient[:volume] * 29.375
		when "drop"
			volume_ml = ingredient[:volume] * 0.8
		when "dash"
			volume_ml = ingredient[:volume] * 0.05
		else 
			volume_ml = ingredient[:volume]
		end
		volume_ml
	end
end
