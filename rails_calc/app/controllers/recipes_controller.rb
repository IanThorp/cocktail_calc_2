class RecipesController < ApplicationController

	def index
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
		data = { 
			recipe: params[:recipe], 
			ingredients: params[:ingredients] 
		}
		data[:recipe][:initial_volume] = 0
		data[:recipe][:initial_alcohol_volume] = 0

		data[:ingredients].each do |ingredient|
			ingredient[:volume_ml] = volume_to_ml(ingredient)
			data[:recipe][:initial_volume] += ingredient[:volume_ml]
			data[:recipe][:initial_alcohol_volume] += (ingredient[:volume_ml].to_f * (ingredient[:abv].to_f/100)).round(3)
		end

		data[:recipe][:initial_abv] = (data[:recipe][:initial_alcohol_volume]/data[:recipe][:initial_volume]).round(4)

		data[:recipe][:dilution] = dilute(data[:recipe])


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
		if recipe[:autoDilute]
			case recipe[:method]
			when "stirred"
				dilution = (recipe[:initial_abv] ** 2 * -1.21 + 1.246 * recipe[:initial_abv] + 0.145).round(3)
			when "shaken"
				dilution = (recipe[:initial_abv] ** 2 * -1.567 + 1.742 * recipe[:initial_abv] + 0.203).round(3)
			else
				dilution = 0
			end
		else
			dilution = 0
		end
		(dilution * recipe[:initial_volume]).round(2)
	end
end
