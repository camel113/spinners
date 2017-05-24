$( document ).ready(function() {
	$('.cart-counter').hide()
  Snipcart.subscribe('item.added', function (ev, item, items) {
    // You can call preventDefault method in event object if you don't want to add
    // the item to the cart.
    if(Snipcart.api.items.count()>0){
    	$('.cart-counter').show()
    }
    $('.cart-counter').text(Snipcart.api.items.count())
	});

	Snipcart.subscribe('item.removed', function (ev, item, items) {
    // You can call preventDefault method in event object if you don't want to add
    // the item to the cart.
    if(Snipcart.api.items.count()==0){
    	$('.cart-counter').hide()
    }

	});
});