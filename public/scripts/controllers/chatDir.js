app.directive('domDirective', function () {
    return {
        restrict: 'A,E',
        link: function ($scope, element, attrs) {
            console.log(element)
            var elementScope = element.isolateScope();
            elementScope.$on('parameter-changed', function(evt, payload) {

            })
            element.on('click', function () {
                element.html('You clicked me!');
            });
            element.on('mouseenter', function () {
                element.css('background-color', 'yellow');
            });
            element.on('mouseleave', function () {
                element.css('background-color', 'white');
            });
        }
    };
});