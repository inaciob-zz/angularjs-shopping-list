(function() {
	'use strict';

	angular.module('shoppingList', [])
	.controller('ShopListCtrl', function() {
		var vm = this;

		// Set variables
		// TODO: Make this dynamic, add persistence
		vm.items = [{
						"itemName": "Milk",
						"itemDetails": "Preferably skim"
					}, 
					{
						"itemName": "Bread",
						"itemDetails": "Whole Wheat toast"
					}, 
					{
						"itemName": "Cheese",
						"itemDetails": "Aged Cheddar"
					}];
		vm.nextItem = null;
		vm.errorText = "";
		
		vm.init = init;
		vm.addItem = addItem;
		vm.removeItem = removeItem;

		function init() {
			// Startup code goes here
		}
		init();

		function addItem() {
			if(!vm.nextItem) {
				return false;
			}

			if(vm.items.indexOf(vm.nextItem) == -1) {
				vm.items.push(vm.nextItem);	
			}
			else {
				vm.errorText = "The item is already in your shopping list.";
			}
		}

		function removeItem(idx) {
			vm.errorText = "";
			vm.items.splice(idx, 1);
		}
	});
})();
