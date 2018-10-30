// Container file for any custom filters

// Replace any spaces with dashes for creation of valid DOM Id attributes - 
// approach taken from https://stackoverflow.com/questions/27474503/trying-to-replace-spaces-with-dashes-using-ng-model
angular.module('shoppingList')
.filter('nospaces',function() {
    return function(input) {
        if (input) {
            return input.replace(/\s+/g, '-');    
        }
    }
});
