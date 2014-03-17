App.directive('file', ['$window',
function($window) {
  return {
    scope: {
      file: '='
    },
    link: function(scope, element, attr) {
      element.bind('change', function(e) {
        if (! e.target.files[0].type.match(/image\/(?:jpeg|png)/)) {
          $window.alert("Invalid file type")
          return
        }
        scope.$apply(function() {
          scope.file = e.target.files[0]
        })
      })
    }
  }
}])
