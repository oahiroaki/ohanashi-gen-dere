App.controller('StoryCtrl', ['$scope', '$window', 'POST',
function($scope, $window, POST) {
  // Canvas
  var canvas = document.createElement("canvas")
    , context = canvas.getContext("2d")

  function getImagesIndex(stamp) {
    return $scope.images.map(function(val) {
      return val.timestamp
    }).indexOf(stamp)
  }
  function swapImages(idx1, idx2) {
    var tmp = $scope.images[idx1]
    $scope.images[idx1] = $scope.images[idx2]
    $scope.images[idx2] = tmp
  }
  $scope.images = []
  $scope.hasStory = false
  $scope.hasResult = false
  $scope.remove = function(stamp) {
    var idx = getImagesIndex(stamp)
    if (idx >= 0)
      $scope.images.splice(idx, 1)
    $scope.hasStory = !!($scope.images.length > 0)
  }
  $scope.moveUp = function(stamp) {
    var idx = getImagesIndex(stamp)
    if (idx > 0)
      swapImages(idx - 1, idx)
  }
  $scope.moveDown = function(stamp) {
    var idx = getImagesIndex(stamp)
    if (idx >= 0 && idx < $scope.images.length - 1)
      swapImages(idx, idx + 1)
  }
  $scope.$on('savedImage', function(e, imgData) {
    var date = new Date().getTime()
    $scope.images.push({timestamp: date, src: imgData})
    $scope.hasStory = !!($scope.images.length > 0)
  })
  $scope.saveImages = function() {
    angular.element(canvas)
      .attr('width', POST.width)
      .attr('height', POST.height * $scope.images.length)
    $scope.images.forEach(function(val, idx) {
      context.drawImage(
        document.getElementById(val.timestamp), 0, POST.height * idx)
    })
    // IEだとdata URIがなんかうまくいかないのでブラウザ判別して分岐
    var ua = $window.navigator.userAgent.toLowerCase()
    if (ua.indexOf('msie') >= 0 || ua.indexOf('trident') >= 0) {
      // IE
      var img = document.createElement('img')
      img.src = canvas.toDataURL('image/jpeg')
      document.getElementById('result-images').appendChild(img) // 画像追加
      $scope.hasResult = true
    } else {
      // ほか
      $window.open(canvas.toDataURL('image/jpeg'), "Story")
    }
  }
  $scope.removeImages = function() {
    var images = document.getElementById('result-images')
    while (images.firstChild)
      images.removeChild(images.firstChild)
    $scope.hasResult = false
  }
}])
;
