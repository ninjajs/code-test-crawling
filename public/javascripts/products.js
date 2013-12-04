

$(document).ready(function() {
	var source = $("#product-template").html();
	window.template = Handlebars.compile(source);

	// load json file when page loads
	$.ajax({
		url: 'data/products.json',
		dataType: 'json',
		success: function(data) {
			window.products = data;
			//console.log(data);

			renderProducts();
		}
	});

	// sort by dropdown
	$('select').change(function() {
		
		if (this.value) {
			if (this.value == 'name') {

				window.products.sort(sortByName);
				renderProducts();
			}
			else if (this.value == 'price') {
				window.products.sort(sortByPrice);
				renderProducts();
			}

		}
	})
});

function renderProducts() {
	var data = window.products;

	$('#products').html('');

	for (var i = 0; i < data.length; i++) {

		var curr = {};
		jQuery.extend(curr,data[i]);

		curr.colors = curr.colors.join(', ');

		if (curr.description.length > 75)
			curr.description = curr.description.substring(0, 75) + '...';

		var html = window.template(curr);
		$('#products').append(html);
	}
}

function sortByName(a, b){
  var aName = a.name.toLowerCase();
  var bName = b.name.toLowerCase(); 
  return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
}

function sortByPrice(a, b){
  var aPrice = parseFloat(a.price.substring(1));
  var bPrice = parseFloat(b.price.substring(1));
  return ((aPrice < bPrice) ? -1 : ((aPrice > bPrice) ? 1 : 0));
}
