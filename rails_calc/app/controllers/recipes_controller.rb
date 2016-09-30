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
			ingredients: params[:ingredients],
			batch: params[:batch]
		}
		data[:recipe][:initial_volume] = 0
		data[:recipe][:initial_alcohol_volume] = 0

		data[:ingredients].each do |ingredient|
			ingredient[:volume_ml] = volume_to_ml(ingredient)
			data[:recipe][:initial_volume] += ingredient[:volume_ml]
			data[:recipe][:initial_alcohol_volume] += (ingredient[:volume_ml].to_f * (ingredient[:abv].to_f/100))
		end

		data[:recipe][:initial_volume] = data[:recipe][:initial_volume].round(2)
		data[:recipe][:initial_alcohol_volume] = data[:recipe][:initial_alcohol_volume].round(2)
		data[:recipe][:initial_abv] = (data[:recipe][:initial_alcohol_volume]/data[:recipe][:initial_volume]).round(4)
		data[:recipe][:dilution] = dilute(data[:recipe]).round(2)
		data[:recipe][:final_volume] = (data[:recipe][:dilution] + data[:recipe][:initial_volume]).round(2)
		data[:recipe][:final_abv] = (data[:recipe][:initial_alcohol_volume]/data[:recipe][:final_volume]).round(4)

		data[:batch][:multiplier] = calculate_ingredient_multiplier(data[:batch], data[:recipe][:final_volume])
		data[:batch][:html] = create_batch_stats_html(data)

		# data[:batch][:multiplier] = ingredient_multiplier
		respond_to do |format|
			format.json {render json: data}
			format.html 
		end
	end

	private

	def calculate_ingredient_multiplier(batch, final_volume)
		batch[:number] = batch[:number].to_f
		multiplier = 1
		case batch[:unit]
		when "floz"
			multiplier = batch[:number] * 29.375 / final_volume
		when "ml"
			multiplier = batch[:number] / final_volume
		else
			# batch[:unit] must must 'drinks' at this point
			multiplier = batch[:number]
		end
		multiplier
	end

	def create_batch_stats_html(data)
		batch_html = ''
		total_volume = 0
		data[:ingredients].each do |ingredient|
			batch_html += '<li>' + ingredient[:name] + ': ' + (ingredient[:volume_ml] * data[:batch][:multiplier]).round(2).to_s + ' mL</li>'
			total_volume += (ingredient[:volume_ml] * data[:batch][:multiplier])
		end
		if data[:recipe][:dilution] > 0
			batch_html += '<li> Water: ' + (data[:recipe][:dilution] * data[:batch][:multiplier]).round(2).to_s + ' mL</li>'
			total_volume += (data[:recipe][:dilution] * data[:batch][:multiplier])
		end
		batch_html += '<li> Total Volume: ' + total_volume.round(2).to_s + ' mL</li>'
		batch_html
	end

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
		(dilution * recipe[:initial_volume])
	end
end
