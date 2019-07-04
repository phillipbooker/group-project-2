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

var $deleteButton = $(".delete");

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
  },
  deleteItem: function(item) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "DELETE",
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

$deleteButton.on("click", function(e) {
  e.preventDefault();

  var deleteId = $(this).attr("data-id");
  console.log(deleteId);

  var toDelete = {
    id: deleteId
  };

  API.deleteItem(toDelete).then(function() {
    location.reload();
  });
});

$("a[href^='#']").on("click", function(e) {
  // prevent default anchor click behavior
  e.preventDefault();

  // store hash
  var hash = this.hash;

  // animate
  $("html, body").animate(
    {
      scrollTop: $(hash).offset().top
    },
    1000,
    function() {
      // when done, add hash to url
      // (default click behaviour)
      window.location.hash = hash;
    }
  );
});
