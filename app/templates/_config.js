angular.module('dashboard')
    .config(function(widgetServiceProvider) {
        widgetServiceProvider.register('<%= widget.name %>', {
            sizex: <%= widget.width %>,
            sizey: <%= widget.height %>,  <% if(widget.color){ %>
            color: '<%= widget.color %>', <% } %>
            template: '<%= _.camelize(widget.name) %>_front.html'<% if(widget.configurable) { %>,
            editTemplate: '<%= _.camelize(widget.name) %>_back.html'<% } %><% if(widget.dataBind) { %>,
            dataBind: {
                type: '<%= widget.dataBindType %>',
                source: '<%= widget.dataBindUrl %>'<% if(widget.dataBindInterval) { %>,
                interval: <%= widget.dataBindInterval %> <% } %>
            } <% } %>
        });
    });