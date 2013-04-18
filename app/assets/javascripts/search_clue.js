var map;
var guess;
var mapZoom;
var modalOptions = { onClose: function (dialog) { $.modal.close(); window.location.href = "/"; } };

$(document).on("ready", onReady);

function onReady() {
  $(document).on("fbLoaded", onFBLoaded);
}

function onFBLoaded() {
  if ($("#ruby-values").data("clue")) {
    if ($("#ruby-values").data("can-guess")) {
      // $("#clue-image").attr("src", $("#ruby-values").data("clue-image"));
      $("#num-tickets").text($("#ruby-values").data("remain-tickets") + " DE " + $("#ruby-values").data("total-tickets"))

      var s = document.createElement("script");
      s.type = "text/javascript";
      s.src  = "https://maps.googleapis.com/maps/api/js?v=3&key=AIzaSyDpJbkdk6ozglAO_Fp4bfop3uSg63auvPI&sensor=false&callback=initMap";
      $("head").append(s); 
    }
    else {
      modalAlert("Lo sentimos", "Solamente puedes participar una vez por pista. Espera a la siguiente.", modalOptions);
    }
  }
  else {
    modalAlert("Lo sentimos", "Por el momento no hay ninguna pista. Espera a la siguiente.", modalOptions);
  }
}

function initMap()
{
  var mapOptions = {
    center: new google.maps.LatLng(19.433333, -99.133333),
    minZoom: 13,
    zoom: 13,
    maxZoom: 17,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  map = new google.maps.Map($("#map-canvas")[0], mapOptions);
  google.maps.event.addListener(map, 'click', onClick);
}

function onClick(event) {
  guess = event.latLng;
  mapZoom = map.getZoom();
  setTimeout("placeMarker()", 600);
}

function placeMarker() {
  if (mapZoom == map.getZoom()) {
    google.maps.event.clearListeners(map, 'click');

    var marker = new google.maps.Marker({
      position: guess,
      animation: google.maps.Animation.DROP,
      map: map
    });
    $.ajax({url:"/make_guess", type:"POST", 
      data:{lat: guess.lat(), lng: guess.lng(), clue_id: $("#ruby-values").data("clue-id")}, 
      dataType: "json", success: onPlaceMarker});
  }
}
var result;
function onPlaceMarker(data, textStatus, jqXHR) {
  result = data;
  if (data.won_ticket) {
    modalAlert("Felicidades", "Has ganado un boleto!", null);
     /*var marker = new google.maps.Marker({
      position: guess,
      animation: google.maps.Animation.DROP,
      map: map
    });*/
  }
  else if (!data.error) {
    modalAlert("Lo sentimos", "No has encontrado la pista", modalOptions);
  }
  else if (data.code == 1) {
    modalAlert("Lo sentimos", "Ya no hay boletos para esta pista. Espera a la siguiente.", modalOptions);
  }
  else {
    modalAlert("Lo sentimos", "Solamente puedes participar una vez por pista. Espera a la siguiente.", modalOptions);
  }
}

function testMarker() { alert("added");}
