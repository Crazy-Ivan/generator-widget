angular.module('dashboard')

    .controller('<%= _.camelize(widget.name) %>Ctrl', ['$scope', function($scope) {

        //front side logic goes here

    }])
    <% if(widget.configurable) { %>
    .controller('<%= _.camelize(widget.name) %>EditCtrl', ['$scope', function($scope) {

        //back side configuration logic goes here

    }])
    <% } %>