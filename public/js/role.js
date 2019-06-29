// Get references to page elements
var $stylistBtn = $("#stylist-button");
var $clientBtn = $("#client-button");

// User variables
var gid;
var gname;

gid = 125;
gname = "dev";

// The API object contains methods for each kind of request we'll make
var API = {
  makeOutfit: function(outfit) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "api/outfit",
      data: JSON.stringify(outfit)
    });
  },
  getOutfit: function(id) {
    return $.ajax({
      type: "GET",
      url: "stylist/" + id
    });
  }
};

$stylistBtn.on("click", function() {
  //create outfit using db
  var outfit = {
    stylistId: gid,
    stylistName: gname
  };

  API.makeOutfit(outfit).then(function(newFit) {
    console.log(newFit);
    location.replace("/stylist/" + newFit.id);
  });
});

$clientBtn.on("click", function() {
  location.replace("/client");
});
