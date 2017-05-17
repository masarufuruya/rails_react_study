class SamplesController < ApplicationController
  def index
  end

  def fetch_random_tiqav_images
    res = Faraday.get 'http://api.tiqav.com/search/random.json'
    images = JSON.parse(res.body)
    random_images = images.map do |image|
      { id: image['id'], imgUrl: "http://img.tiqav.com/#{image['id']}.#{image['ext']}" }
    end
    render json: random_images
  end
end
