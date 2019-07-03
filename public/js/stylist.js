// Get references to page elements
var $outfitBtn = $("#submit-outfit");
var $outfitCategory = $("#oCategory");
var $outfitImage = $("#oImage");
var $outfitPrice = $("#oPrice");

var $itemBtn = $("#submit-item");
var $itemName = $("#iName");
var $itemImage = $("#iImage");
var $itemPrice = $("#iPrice");
var $itemPurchase = $("#iPurchase");

var outfitId = $outfitBtn.attr("data-id");

// The API object contains methods for each kind of request we'll make
var API = {
  updateOutfit: function(outfit) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "PUT",
      url: "/api/outfit",
      data: JSON.stringify(outfit)
    });
  },
  makeItem: function(item) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "/api/item",
      data: JSON.stringify(item)
    });
  }
};

$outfitBtn.on("click", function(e) {
  e.preventDefault();
  //a
  console.log($outfitCategory.val());

  var newCategory = $outfitCategory.val();
  var newImage = $outfitImage.val().trim();
  var newPrice = parseFloat($outfitPrice.val().trim());

  if (newImage === "" || newPrice === "") {
    alert("Please fill out all fields for this outfit!");
  } else if (isNaN(newPrice) || newPrice < 0) {
    alert("Please enter a valid number for 'Price'.");
  } else {
    var newOutfit = {
      id: outfitId,
      category: newCategory,
      image: newImage,
      price: newPrice
    };

    console.log(newOutfit);

    API.updateOutfit(newOutfit).then(function() {
      // refresh outfit
      location.reload();
    });
  }
});

$itemBtn.on("click", function(e) {
  e.preventDefault();

  console.log($itemName.val());
  var newName = $itemName.val().trim();
  var newPrice = parseFloat($itemPrice.val().trim());
  var newImage = $itemImage.val().trim();
  var newPurchase = $itemPurchase.val().trim();

  if (
    newName === "" ||
    newPrice === "" ||
    newImage === "" ||
    newPurchase === ""
  ) {
    alert("Please fill out all fields for this item!");
  } else if (isNaN(newPrice) || newPrice < 0) {
    alert("Please enter a valid number for 'Price'.");
  } else {
    var newItem = {
      outfitId: outfitId,
      name: newName,
      price: newPrice,
      image: newImage,
      purchase: newPurchase
    };

    console.log(newItem);

    API.makeItem(newItem).then(function() {
      // refresh outfit
      location.reload();
    });
  }
});
