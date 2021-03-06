class MobileController < ApplicationController

  authorize_resource :class => false

  def index
    @has_ticket =  current_user && current_user.ticket ? true : false;
    if @has_ticket
      @folio = current_user.ticket.folio
    end
  end

  def search_ticket
    lat = params[:lat]
    lng = params[:lng]
    result = {}
    
    result = Ticket.locate_and_assign(lat, lng, :mobile, current_user)
    
    render :json => result
  end

  def new_fan
    current_user.update_attribute(:is_fan, true)
    current_user.activities << Activity.find_by_description(:fan)
    render :nothing => true
  end

end
