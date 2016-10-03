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

	def show

	end

	def calculate
		data = { 
			recipe: params[:recipe], 
			ingredients: params[:ingredients],
			batch: params[:batch],
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

		respond_to do |format|
			format.json {render json: data}
			format.html 
		end
	end

	def save
		data = { 
			recipe: params[:recipe], 
			ingredients: params[:ingredients],
			batch: params[:batch],
		}
		@recipe = Recipe.new(user_id: current_user[:id], dilute: to_boolean(data[:recipe][:autoDilute]), method: data[:recipe][:method], name: data[:recipe][:name])
		if @recipe.save
			data[:ingredients].each do |ingredient|
				@ingredient = Ingredient.new(name: ingredient[:name], abv: ingredient[:abv])
				if @ingredient.save
					@ingredients_recipes = IngredientsRecipe.new(recipe_id: @recipe.id, ingredient_id: @ingredient.id, volume: ingredient[:volume], unit: ingredient[:unit])
					@ingredients_recipes.save
				end
			end
		end
		respond_to do |format|
			format.json {render json: {success: true, data: data}}
		end
		return
	end

	private

	def to_boolean(str)
		str == 'true'
	end

	def calculate_ingredient_multiplier(batch, final_volume)
		batch[:number] = batch[:number].to_f
		multiplier = 1
		case batch[:input_unit]
		when "floz"
			multiplier = batch[:number] * 29.375 / final_volume
		when "ml"
			multiplier = batch[:number] / final_volume
		else
			# batch[:input_unit] must be 'drinks' at this point
			multiplier = batch[:number]
		end
		multiplier
	end

	def create_batch_stats_html(data)
		# batch_html = ''
		headers_html = '<tr>'
		stats_html = '<tr>'
		total_volume = 0
		if data[:batch][:output_unit] == 'floz'
			unit_conversion = 29.375
			unit_text = 'fl oz'
		else
			unit_conversion = 1
			unit_text = 'mL'
		end
		data[:ingredients].each do |ingredient|
			if ingredient[:volume] > 0
				headers_html += "<th>#{ingredient[:name]}</th>"
				stats_html += "<td>#{(ingredient[:volume_ml] * data[:batch][:multiplier] / unit_conversion).round(2).to_s} #{unit_text}</td>"
				total_volume += (ingredient[:volume_ml] * data[:batch][:multiplier] / unit_conversion)
			end
		end
		if data[:recipe][:dilution] > 0
			headers_html += "<th>Water</th>"
			stats_html += "<td>#{(data[:recipe][:dilution] * data[:batch][:multiplier] / unit_conversion).round(2).to_s} #{unit_text}</td>"
			total_volume += (data[:recipe][:dilution] * data[:batch][:multiplier] / unit_conversion)
		end
		headers_html += "</tr>"
		stats_html += "</tr>"
		batch_html = headers_html + stats_html
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
