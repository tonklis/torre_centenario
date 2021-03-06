TorreCentenario::Application.routes.draw do
  resources :activities

  resources :referrals do
    match 'create_batch', :on => :collection
    match 'accept', :on => :collection
  end

  resources :clues do
		match 'assign_tickets', :on => :collection
    match 'activate_web'
    match 'activate'
    match 'deactivate'
	end

  resources :tickets do
    match 'assign_to_user', :on => :collection
  end

  resources :roles

  devise_for :users, :controllers => {:omniauth_callbacks => "users/omniauth_callbacks"}

  devise_scope :user do
	  get 'logout', :to => "devise/sessions#destroy", :as => :logout
	  get 'signin', :to => "devise/sessions#new", :as => :signin
	  get 'signup', :to => "devise/registrations#new", :as => :signup
  end

  resources :users do
    match 'synch'
  end
	
  get 'admin', :to => "admin#index", :as => :admin_index
  
  get 'admin/logout', :to => "admin#logout", :as => :admin_logout

  get 'admin/create_clue_mobile', :to => "admin#create_clue_mobile", :as => :admin_create_clue_mobile
	
  get 'admin/create_clue_web', :to => "admin#create_clue_web", :as => :admin_create_clue_web
	
  get 'admin/edit_clue_mobile/:id', :to => "admin#edit_clue_mobile", :as => :admin_edit_clue_mobile
  
  get 'admin/edit_clue_web/:id', :to => "admin#edit_clue_web", :as => :admin_edit_clue_web

  get 'admin/users_referrals', :to => "admin#users_referrals", :as => :admin_users_referrals

  get 'admin/clues_list_mobile', :to => "admin#clues_list_mobile", :as => :admin_clues_list_mobile

  get 'admin/clues_list_web', :to => "admin#clues_list_web", :as => :admin_clues_list_web

  get 'admin/reports', :to => "admin#reports", :as => :admin_reports
  
  get 'admin/reports_summary', :to => "admin#reports_summary", :as => :admin_reports_summary
  
  get 'admin/reports_users', :to => "admin#reports_users", :as => :admin_reports_users
  
  get 'admin/reports_winners', :to => "admin#reports_winners", :as => :admin_reports_winners

  match 'search_clue' => 'display#search_clue', :as => :search_clue

  match 'make_guess' => 'display#make_guess', :as => :make_guess

  match 'invite_friends' => 'display#invite_friends', :as => :invite_friends
  
  match 'fun_facts' => 'display#fun_facts', :as => :fun_facts

  match 'martin_facts' => 'display#martin_facts', :as => :martin_facts

  match 'mobile/' => 'mobile#index', :as => :mobile

  match 'mobile/search_ticket' => 'mobile#search_ticket', :as => :mobile_search_ticket

  match 'mobile/new_fan' => 'mobile#new_fan', :as => :mobile_new_fan

  match 'terms_and_conditions' => 'display#terms_and_conditions', :as => :terms_and_conditions

  match 'youtube_channel' => 'display#youtube_channel', :as => :youtube_channel

  get 'check_availability' => 'display#check_availability', :as => :check_availability

  # The priority is based upon order of creation:
  # first created -> highest priority.

  # Sample of regular route:
  #   match 'products/:id' => 'catalog#view'
  # Keep in mind you can assign values other than :controller and :action

  # Sample of named route:
  #   match 'products/:id/purchase' => 'catalog#purchase', :as => :purchase
  # This route can be invoked with purchase_url(:id => product.id)

  # Sample resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Sample resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Sample resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Sample resource route with more complex sub-resources
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', :on => :collection
  #     end
  #   end

  # Sample resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end

  # You can have the root of your site routed with "root"
  # just remember to delete public/index.html.
  root :to => 'display#index'

  # See how all your routes lay out with "rake routes"

  # This is a legacy wild controller route that's not recommended for RESTful applications.
  # Note: This route will make all actions in every controller accessible via GET requests.
  # match ':controller(/:action(/:id))(.:format)'
end
