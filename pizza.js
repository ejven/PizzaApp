AppData = {
	getOrder: function() {
		try {
			return JSON.parse(localStorage.getItem("order"));
		}
		catch(err) {
			return new Array();
		}
	},

	setOrder: function(order) {
		localStorage.setItem("order", JSON.stringify(order));
	},

	getPhone: function() {
		return JSON.parse(localStorage.getItem("phone"));
	},

	setPhone: function(phone) {
		localStorage.setItem("phone", JSON.stringify(phone));
	},

	getAddress: function() {
		return JSON.parse(localStorage.getItem("address"));
	},

	setAddress: function(phone) {
		localStorage.setItem("address", JSON.stringify(phone));
	}
}

function populateContainer(jsonArray, templateId, containerId) {
	jsonArray = JSON.parse(jsonArray);

	for (var i = 0; i < jsonArray.length; i++) {
		var item = jsonArray[i];

		var el = $("<li>").loadTemplate($(templateId), {
			name: item.name,
			desc: item.desc,
			price: item.price,
			id: item.id
		});

		$(el).addClass('list-group-item');
		$(el).attr('pizza-id', item.id);
		$(el).data("pizza", item);

		$(containerId).append(el);
	}
}

function createOrderItemElement(item, templateId) {
	var el = $('<li/>').loadTemplate($(templateId), {
		name: item.name,
		price: item.price,
		amount: item.amount,
		id: item.id
	});
	
	$(el).addClass('list-group-item');
	$(el).attr('pizza-id', item.id);
	$(el).data("pizza", item);
	
	return el;	
}

function addPizza_click(e) {
	var pizza = $(e).closest("li").data("pizza");

	addPizzaToOrder(pizza);
	refreshPizzaList();
}

function deletePizza_click(e) {
	var pizza = $(e).closest("li").data("pizza");

	deletePizzaFromOrder(pizza);
	refreshPizzaList();
}

function addPizzaOrder_click(e) {
	var pizza = $(e).closest("li").data("pizza");

	addPizzaToOrder(pizza);
	refreshConfirmPage();
}

function deletePizzaOrder_click(e) {
	var pizza = $(e).closest("li").data("pizza");

	deletePizzaFromOrder(pizza);
	refreshConfirmPage();
}

function addPizzaToOrder(pizza) {
	var order = AppData.getOrder();
	var founded = false;

	if (!order) order = new Array();

	for (var i = 0; i < order.length; i++) {
		item = order[i];

		if (item.id == pizza.id) {
			item.amount++;
			founded = true;
		}
	}

	if (!founded) {
		pizza.amount = 1;
		order.push(pizza)
	}

	AppData.setOrder(order);
}

function deletePizzaFromOrder(pizza) {
	var order = AppData.getOrder();
	var founded = false;

	if (!order) return 0;

	for (var i = 0; i < order.length; i++) {
		item = order[i];

		if (item.id == pizza.id) {
			if (item.amount > 1) item.amount--;
			else order.splice(i, 1);
		}
	}

	AppData.setOrder(order);
}

function refreshPizzaList() {
	var order = AppData.getOrder();

	$("#pizza-list li span.amount").html('');
	$("#pizza-list li .price").removeClass('added');

	if (order) {
		order.forEach(function(i) {
			var pizzaEl = $("#pizza-list").find("[pizza-id=".concat(i.id).concat("]"));

			pizzaEl.find('span.amount').html(i.amount + " x ");
			pizzaEl.find('.price').addClass('added');
		});
	}
}

function refreshOrderList() {
	var order = AppData.getOrder();

	if (order) {
		$("#order-list li").attr('valid', 'false');

		order.forEach(function(i) {
			var pizzaEl = $("#order-list").find("[pizza-id=".concat(i.id).concat("]"));
			
			if (pizzaEl.length) {				
				pizzaEl.find('span.amount').html(i.amount);
				pizzaEl.attr('valid', 'true');
			}
			else {
				pizzaEl = createOrderItemElement(i, '#pizza-order-item');
				$("#order-list").append(pizzaEl);
			}				
		});

		$("#order-list li[valid='false']").remove();
	} else $("#order-list li").remove();
}

function refreshTotal() {
	var order = AppData.getOrder();
	var total = 0;
	
	if (order) {
		order.forEach(function(i) {
			total += i.price * i.amount;
		});
	}

	$('#total').html(total);
}

function refreshConfirmPage() {
	refreshOrderList();
	refreshTotal();
	
	var order = AppData.getOrder();			
	if (order.length == 0) {
		$('.empty-order').show();
		$('#submit-part').hide();
	}
	else {
		$('.empty-order').hide();
		$('#submit-part').show();
	}
	
}
