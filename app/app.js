(function() {
	'use strict';

	angular.module('shoppingList', [])
	.controller('ShopListCtrl', function($scope, $timeout) {
		var vm = this;

		// Set variables
		var database = firebase.firestore();
	  	const firestore = database;
  		const settings = {timestampsInSnapshots: true};
  		firestore.settings(settings);

  		vm.formInvalid = false;
		vm.items = [];
		
		vm.init = init;
		vm.displayChanges = displayChanges;
		vm.resetItemForm = resetItemForm;
		vm.setFormInvalid = setFormInvalid;
		vm.addItem = addItem;
		vm.removeItem = removeItem;

		function init() {
			// Read in data from firebase
			var collections = ["items"];

			angular.forEach(collections, function(key) {
				database.collection(key).get().then((querySnapshot) => {
					querySnapshot.forEach((doc) => {
        				vm[key].push(doc.data());
    				});
					
					// This exists due to changes from firebase occuring outside of angular which are not automatically updated in view
					// TODO: Clean this up so that $scope is not used
					$scope.$apply();
				});
			});
		}
		init();

		function displayChanges() {
			$timeout(function(){ 
		    	var collections = ["items"];

				angular.forEach(collections, function(key) {
					database.collection(key).get().then((querySnapshot) => {
						querySnapshot.forEach((doc) => {
							// TODO: Make sure no duplicates exist before inserting next document
							if(!angular.toJson(vm[key]).includes(angular.toJson(doc.data()))) {
								vm[key].push(doc.data());
							}
	    				});

	    				$scope.$apply();
					});
				});
			}, 0);
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
					    displayChanges();
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

			database.collection("items").doc("" + docToDeleteId + "").delete().then(function() {
			    console.log("Document successfully deleted!");
			    // TODO: Adjust this for immediate visual feedback
			    displayChanges();
			}).catch(function(error) {
			    console.error("Error removing document: ", error);
			});
		}
	});
})();