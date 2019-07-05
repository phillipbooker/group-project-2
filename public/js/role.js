// Get references to page elements
var $stylistBtn = $("#stylist-button");
var $clientBtn = $("#client-button");

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
  }
};

$stylistBtn.on("click", function() {
  // create outfit using db
  // defaults to interview since it is the first option in the dropdown
  var outfit = {
    stylistId: userId,
    stylistName: gname,
    category: "interview"
  };

  API.makeOutfit(outfit).then(function(newFit) {
    console.log(newFit);
    location.replace("/stylist/" + newFit.id);
  });
});

$clientBtn.on("click", function() {
  location.replace("/client");
});
