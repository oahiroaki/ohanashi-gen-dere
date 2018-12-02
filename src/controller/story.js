App.controller("StoryCtrl", [
  "$scope",
  "$window",
  "POST",
  function($scope, $window, POST) {
    // Canvas
    var canvas = document.createElement("canvas"),
      context = canvas.getContext("2d")

    function getImagesIndex(stamp) {
      return $scope.images
        .map(function(val) {
          return val.timestamp
        })
        .indexOf(stamp)
    }

    function swapImages(idx1, idx2) {
      var tmp = $scope.images[idx1]
      $scope.images[idx1] = $scope.images[idx2]
      $scope.images[idx2] = tmp
    }

    function downloadByLink(url) {
      var link = document.createElement("a")
      var results = document.querySelector("#result-images")
      link.href = url
      link.download = "story.png" // デフォルトファイル名
      results.appendChild(link)
      link.click()
      results.removeChild()
    }

    /**
     * Canvasを画像に変換してダウンロードする
     * @param {HTMLCanvasElement} canvas
     */
    function downloadCanvas(canvas) {
      if (canvas.msToBlob) {
        // IE11, Edgeなど
        var blob = canvas.msToBlob()
        navigator.msSaveOrOpenBlob(blob, "story.png")
      } else if (canvas.toBlob) {
        // Chrome, Firefoxなど
        canvas.toBlob(function(blob) {
          var url = URL.createObjectURL(blob)
          downloadByLink(url)
        })
      } else if (canvas.toDataURL) {
        // Safariなど
        var url = canvas.toDataURL()
        downloadByLink(url)
      } else {
        alert("対応していないブラウザです。")
      }
    }

    $scope.images = []
    $scope.hasStory = false
    $scope.hasResult = false
    $scope.remove = function(stamp) {
      var idx = getImagesIndex(stamp)
      if (idx >= 0) $scope.images.splice(idx, 1)
      $scope.hasStory = !!($scope.images.length > 0)
    }
    $scope.moveUp = function(stamp) {
      var idx = getImagesIndex(stamp)
      if (idx > 0) swapImages(idx - 1, idx)
    }
    $scope.moveDown = function(stamp) {
      var idx = getImagesIndex(stamp)
      if (idx >= 0 && idx < $scope.images.length - 1) swapImages(idx, idx + 1)
    }
    $scope.$on("savedImage", function(e, imgData) {
      var date = new Date().getTime()
      $scope.images.push({ timestamp: date, src: imgData })
      $scope.hasStory = !!($scope.images.length > 0)
    })
    $scope.saveImages = function() {
      angular
        .element(canvas)
        .attr("width", POST.width)
        .attr("height", POST.height * $scope.images.length)
      $scope.images.forEach(function(val, idx) {
        context.drawImage(
          document.getElementById(val.timestamp),
          0,
          POST.height * idx
        )
      })

      downloadCanvas(canvas)
    }
  }
])
