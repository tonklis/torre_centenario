var TAB_PAGE = 'http://www.facebook.com/In2Teck?v=app_132164533632870';
var TERMS_PATH;

// EVEN BEFORE the document is ready, so it doesn't load the page.
if (getURLParameter('request_ids') != "null" ) {
  window.top.location.href = TAB_PAGE + "&app_data="+getURLParameter('request_ids');
}

$(document).on("ready", onReady);

function onReady() {
  $(document).on("updateData", onUpdateData);
  $(document).on("fbLoaded", onFBLoaded);
  TERMS_PATH = $("#ruby-values").data("terms-path").replace("/","");
  if ($("#ruby-values").data("is-fan")) {
    $("#section-no-fan").css({display: "none"});
    $("#section-fan").css({display: "block"});
  }
}

function onUpdateData(event, values) {
  $("#ruby-values").append(values);
  var attributes = $("#ruby-values div").prop("attributes");
  $.each(attributes, function() {
    $("#ruby-values").attr(this.name, this.value);
  });
  $(document).trigger('fbLoaded');
}

function onFBLoaded() {
  verifyAccount();

  var appData = $("#ruby-values").data("app-data").toString();
  if (appData != ""){
    var requestsList = appData.split(',');
    callRequestsBatch(requestsList);
  }
  
  $("#menu div").on("click", onMenuClick);
}

function verifyAccount() {
  FB.api({
    method: 'fql.query',
    query: 'SELECT friend_count FROM user WHERE uid = ' + $("#ruby-values").data("user-uid")
  }, function(response) {
    if (parseInt(response[0].friend_count) > 30) {
      synchUser(parseInt(response[0].friend_count), $("#ruby-values").data("user-id"));
    } else {
      window.location.href = TERMS_PATH + "/?authorized=false";
    }
  });
}

function synchUser(friend_count, user_id) {
  update_data = {
    friend_count: friend_count
  }

  if (($("#ruby-values").data("is-fan")) != "") {
    update_data["is_fan"] = $("#ruby-values").data("is-fan")
  }

  $.ajax({
    type: "POST",
    url: "/users/" + user_id + "/synch",
    dataType: "json",
    data: update_data,
    success: function(){
      //alert("synch succesful");
    },
    error: function() {
      alert("Error sincronizando la información del usuario. Intenta entrar nuevamente a la aplicación.");
    } 
  });
  
}

function callRequestsBatch(requestsList){
  var requestsBatch = [];
  $.each(requestsList, function(){
    requestsBatch.push({
      "method": "GET",
      "relative_url": this.toString()
    });
  });
  
  var assignedToTower = eval($("#ruby-values").data("assigned-to-tower"));
  if (!assignedToTower && requestsBatch.length > 0) {
    FB.api("/", "POST", {
      batch: requestsBatch
    }, function(response){
      if (!response || response.error) {
        alert("Error de comunicación con Facebook, intenta nuevamente en unos minutos.");
      } else {
        var usersHash = {};
        $.each(response, function(){
          responseBody = JSON.parse(this.body);
          userName = responseBody.from.name.split(" ");
          usersHash[responseBody.from.id] = userName[0] + " " + userName[userName.length - 1];
        });
        selectUsersTower(usersHash);
      }
    });
  } else if (assignedToTower) {
    if (requestsList.length > 0) {
      alert("No has podido aceptar la invitación. Ya fuiste asignado a la torre de otro amigo.");
    }
    if (requestsBatch.length > 0) {
      removeRequests(requestsList);
    }
  }
}

function onMenuClick(event) {
  var url = $(event.currentTarget).data("path");
  window.location.href = url;
}

function getURLParameter(name) {
  return decodeURI(
    (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
  );
}

function selectUsersTower(usersHash) {
  $("#userTower").show();
  $("#menu").hide();
  $.each(usersHash, function(value, key){
    // ADDING USER REQUESTS
    $("#userTower").append("<div id='"+value+"'>"+key+"</div>");
    $("#"+value).append("<button class='acceptRequestButton' onclick='acceptRequest("+value+")'>SELECT</button>");
  });
}

function acceptRequest(userUID){

  referral = {
    origin_user_uid: userUID.toString(),
    referred_user_id: $("#ruby-values").data("user-id")
  };

  $.ajax({
    type: "POST",
    url: "/referrals/accept",
    dataType: "json",
    data: referral,
    success: function(){
      removeRequests($("#ruby-values").data("app-data").toString().split(','));

      $("#userTower").hide();
      $("#menu").show();
    },
    error: function() {
      alert("Error aceptando la invitación. Probablemente fue eliminada, intenta aceptando otra.");
    } 
  });
}

function removeRequests(requestsList){
  var requestsBatch = [];
  $.each(requestsList, function(){
    requestsBatch.push({
      "method": "DELETE",
      "relative_url": this.toString()
    });
  });
  FB.api("/", "POST", {
    batch: requestsBatch
  }, function(response) {
    if (!response || response.error) {
      alert("Error de comunicación con Facebook, intenta nuevamente en unos minutos.");
    } else {
      //Para debuggear
      //console.log(response);
    }
  });
}
