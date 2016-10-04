class UserController < ApplicationController

	def show
		@user = User.find(params[:id])
		@recipes = Recipe.where(user_id: @user.id)
	end
end
