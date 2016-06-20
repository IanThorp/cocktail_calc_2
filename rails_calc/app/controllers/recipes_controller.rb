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
		params[:ingredients].each do |ingredient|
			p "#{ingredient[:name]}"
		end
		p "hit create route recipes"
		respond_to do |format|
			format.json {render json: params}
			format.html
		end
	end
end
