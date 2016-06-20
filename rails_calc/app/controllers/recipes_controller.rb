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
		data = { recipe: params[:recipe], ingredients: params[:ingredients] }
		respond_to do |format|
			format.json {render json: data}
			format.html
		end
	end

	def calculate
		data = { recipe: params[:recipe], ingredients: params[:ingredients] }
		data[:recipe][:initial_volume] = 0
		data[:recipe][:initial_alcohol_volume] = 0

		data[:ingredients].each do |ingredient|
			ingredient[:volume_ml] = volume_to_ml(ingredient)
			data[:recipe][:initial_volume] += ingredient[:volume]
			data[:recipe][:initial_alcohol_volume] += ingredient[:volume].to_i * ingredient[:abv].to_i/100
		end

		data[:recipe][:initial_abv] = data[:recipe][:initial_alcohol_volume]/data[:recipe][:initial_volume]

		if data[:recipe][:autoDilute]
			data[:recipe][:dilution] = dilute(data[:recipe])
		else
			data[:recipe][:dilution] = 0
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

	def dilute(recipe)
		case recipe[:method]
		when "stirred"
			dilution = (recipe[:initial_abv] ** 2 * -1.21 + 1.246 * recipe[:initial_abv] + 0.145)
		when "shaken"
			dilution = 0
		else
			dilution = 0
		end
	end
end
