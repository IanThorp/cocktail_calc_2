class CreateRecipes < ActiveRecord::Migration
  def change
    create_table :recipes do |t|
      t.integer :user_id
      t.boolean :dilute
      t.string :method
      t.string :name

      t.timestamps null: false
    end
  end
end
