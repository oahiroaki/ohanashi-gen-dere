App.controller('PostCtrl', ['$scope', '$window', '$q', 'selectState', 'POST',
function($scope, $window, $q, selectState, POST) {
  $scope.message = 'セリフ'
  $scope.fontSize = 'M'
  $scope.iconSrc = ''
  $scope.name = ''
  $scope.borderColor = POST.borderColor
  $scope.idol = null
  $scope.fileData = null
  $scope.savePost = function() {
    $scope.$broadcast('savedImage', canvas.toDataURL('image/jpeg'))
  }
  // FIXME: この辺からクッソ雑なのでもうちょいまともに書きかえ
  // Canvasに変更通知
  $scope.redraw = function() { $scope.$broadcast('drawAll') }
  $scope.drawMessage = function() { $scope.$broadcast('drawMessage') }
  $scope.drawPost = function() { $scope.$broadcast('drawPost') }
  $scope.drawBorderColor = function() {
    if (! $scope.borderColor.match(/#[0-9A-F]{6}/))
      return
    $scope.$broadcast('drawAll')
  }
  // アイドルが選択された時
  $scope.$watchCollection(function() {
    return selectState
  }, function () {
    $scope.idol = selectState.idol
    $scope.borderColor =
        POST.attrColor[selectState.idol.attr] || POST.borderColor
    $scope.name = selectState.idol.name
    $scope.iconSrc = selectState.icon
    $scope.$broadcast('drawAll')
  })
  // ファイル読み込み時
  $scope.$watch('fileData', function() {
    var reader = new FileReader()
    reader.onload = function(readerEvent) {
      $scope.iconSrc = readerEvent.target.result
      $scope.$broadcast('drawAll')
    }
    if ($scope.fileData)
      reader.readAsDataURL($scope.fileData)
  })
  // window.onloadイベント後でないとcanvasにwebフォントが適用されない
  ;(function() {
    var defer = $q.defer()
    $window.addEventListener('load', function() {
      defer.resolve()
    }, false)
    return defer.promise
  }()).then(function() {
    $scope.idol = selectState.idol
    $scope.borderColor =
        POST.attrColor[selectState.idol.attr] || POST.borderColor
    $scope.name = selectState.idol.name
    $scope.iconSrc = selectState.icon
    $scope.$broadcast('drawAll')
  })
}])
