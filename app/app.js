(function() {
	'use strict';

	angular.module('shoppingList', [])
	.controller('ShopListCtrl', function($scope, orderByFilter) {
		var vm = this;

		// Set variables
		var database = firebase.firestore();
	  	const firestore = database;
  		const settings = {timestampsInSnapshots: true};
  		firestore.settings(settings);

  		vm.formInvalid = false;
		vm.items = [];
		
		vm.init = init;
		vm.getList = getList;
		vm.resetItemForm = resetItemForm;
		vm.setFormInvalid = setFormInvalid;
		vm.addItem = addItem;
		vm.removeItem = removeItem;

		function init() {
			// Read in data from firebase
			getList();
		}
		init();

		function getList() {
			var collections = ["items"];

			angular.forEach(collections, function(key) {
				database.collection(key).get().then((querySnapshot) => {
					querySnapshot.forEach((doc) => {
						if(!angular.toJson(vm[key]).includes(angular.toJson(doc.data()))) {
        					vm[key].push(doc.data());
        					// This exists so that alphabetic ordering is preserved while items are being added to the list
        					vm[key] = orderByFilter(vm[key], 'itemName');
        				}
    				});
					
					// This exists due to changes from firebase occuring outside of angular which are not automatically updated in view
					// TODO: Clean this up so that $scope is not used
					$scope.$apply();
				});
			});
		}

		// ******************** //
		// Start CRUD section
		// ******************** //
		function resetItemForm() {
			vm.newItem = {
				itemName: '',
				itemDetails: ''
			}
		}

		function setFormInvalid() {
			vm.formInvalid = true;
			return vm.formInvalid;
		}

		function addItem(item) {
			if(!item) {
				return false;
			}

			if(!angular.isUndefined(item)) {
				if(item.itemName) {
					database.collection("items").doc("" + item.itemName + "").set({
						itemName: item.itemName,
						itemDetails: (item.itemDetails || '')
					})
					.then(function() {
					    console.log("Document successfully written!");
					    getList();
					})
					.catch(function(error) {
					    console.error("Error writing document: ", error);
					});
				}
				else {
					setFormInvalid();
				}
			}
			else {
				setFormInvalid();
			}

			resetItemForm();
		}

		function removeItem(item) {
			let docToDeleteId = item.itemName;
			let domId = item.itemName.toLowerCase().replace(/\s+/g, '-');

			database.collection("items").doc("" + docToDeleteId + "").delete().then(function() {
			    console.log("Document successfully deleted!");
			    var element = document.getElementById(domId);
			    element.parentNode.removeChild(element);

			    // Make sure vm.items accurately reflects data in Firebase collection after delete
			    var listLength = vm['items'].length;
			    for(var i=0; i < listLength; i++) {
			    	if(vm['items'][i]['itemName'] == docToDeleteId) {
			    		vm['items'].splice(i, 1);
			    	}
			    }
			}).catch(function(error) {
			    console.error("Error removing document: ", error);
			});
		}
	});
})();