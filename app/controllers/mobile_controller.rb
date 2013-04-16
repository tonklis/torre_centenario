class MobileController < ApplicationController

  def index
  end

  def search_ticket
    #puts 'diego diego ' + current_user.first_name
    lat = params[:lat]
    lng = params[:lng]
    result = {}
    
    guess = Ticket.locate_and_assign(lat, lng, :mobile, current_user)
    result = {:result => guess}
    
    render :json => result
  end

end
