App.controller('FaceCtrl', ['$scope', 'Icons', 'selectState',
function($scope, Icons, selectState) {
  var icons = Icons.get()
  $scope.icons = null
  $scope.id = null
  icons.$promise.then(function() {
    $scope.icons = icons[selectState.idol.id]
    $scope.id = selectState.idol.id
  })
  $scope.$watch(function() {
    return selectState.idol
  }, function() {
    $scope.id = selectState.idol.id
    $scope.icons = icons[selectState.idol.id]
  })
  $scope.select = function(icon) {
    selectState.icon = 'img/' + $scope.id + '/' + icon
  }
}])
