App.controller('IdolCtrl', ['$scope', 'Idols', 'selectState', 'IDOL',
function($scope, Idols, selectState, IDOL) {
  $scope.attrs = Object.keys(IDOL.attributes).map(function(attr) {
    return {
      attr: attr,
      showName: IDOL.attributes[attr],
      state: true,
      className: 'pure-menu-selected'
    }
  })
  $scope.clickAttr = function(val) {
    val.state = !val.state
    val.className = (val.state) ? 'pure-menu-selected' : ''
  }
  $scope.idols = Idols.query()
  $scope.select = function(idol) {
    selectState.idol = idol
    selectState.icon = 'img/' + idol.id + '/1.png'
  }
}])
