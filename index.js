// Gloval angular module variable
var App = angular.module('ohanashi-generator-dere', ['ngResource'])

App.constant('IDOL', {
  attributes: { // 属性定義
    Cu: 'キュート',
    Co: 'クール',
    Pa: 'パッション',
    Ex: 'その他'
  }
})

App.constant('POST', {
  width: 640,
  height: 160,
  margin: 5,
  padding: 5,
  iconSize: 160,
  separaterHeight: 12, // 名前の下の区切り線の幅
  color: "#333333", // 文字色
  nameColor: "#333333", // 名前の文字色
  bgColor: "#FFFFFF", // 背景色
  borderRadius: 5, // 角の丸み
  borderColor: "#666666", // 枠線の色
  borderWidth: 1, // 枠線太さ
  iconBgColor: "#FFFFFF", // アイコン背景色
  frameBgColor: "#000000", // 外枠の色
  lineRadius: 2, // 点線の丸半径
  lineSpace: 2, // 点線の間隔
  attrColor: { // 属性色
    Cu: '#FF66AA',
    Co: '#4477EE',
    Pa: '#FFAA33',
    Ex: '#666666'
  }
})

App.factory('Idols', ['$resource',
function($resource) {
  return $resource('idol_list.json')
}])

App.factory('Icons', ['$resource',
function($resource) {
  return $resource('face_list.json')
}])

// Save global state of selection
App.value('selectState', {
  idol: {"id": "aiko", "name": "高森藍子", "attr": "Pa"},
  icon: 'img/aiko/1.png'
})

App.filter('byAttrsFilter', [
function() {
  return function(idols, attrs) {
    var def = {}
    attrs.forEach(function(val) {
      def[val.attr] = val.state
    })
    return idols.filter(function(idol) {
      return def[idol.attr]
    })
  }
}])

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

App.directive('postCanvas', ['POST', 'Idols',
function(POST, Idols) {
  var width  = POST.width // 全体幅
    , height = POST.height // 全体高さ
    , margin = POST.margin // 外側とのスペース
    , padding = POST.padding // 内側とのスペース
    , iconSize = POST.iconSize // アイコンサイズ
    , postWidth = width - iconSize // 吹き出し部幅
    , postHeight = height // 吹き出し部高さ
    , diff = margin + padding
    , separaterHeight = POST.separaterHeight // 区切り線部高さ
    , frameWidth = postWidth - margin * 2
    , frameHeight = postHeight - margin * 2
    , contentWidth = frameWidth - padding * 2
    , contentHeight = frameHeight - padding * 2
    , lineHeight = ~~((contentHeight - separaterHeight) / 5)
    , nameFrameWidth = ~~(frameWidth / 2.5)
    , nameFrameHeight = lineHeight + padding

  function drawBackground(context) {
    context.clearRect(0, 0, width, width)
    context.fillStyle = POST.frameBgColor
    context.fillRect(0, 0, width, height)
  }

  function drawIcon(context, imgSrc, option) {
    var opt = option || {}
      , radius = POST.borderRadius
      , iconFrameSize = iconSize - margin * 2

    context.beginPath()
    context.arc(
        margin + radius, margin + radius,
        radius, -Math.PI, -0.5 * Math.PI, false)
    context.arc(
        margin + iconFrameSize - radius, margin + radius,
        radius, -0.5 * Math.PI, 0, false)
    context.arc(
        margin + iconFrameSize - radius, margin + iconFrameSize - radius,
        radius, 0, 0.5 * Math.PI, false)
    context.arc(
        margin + radius, margin + iconFrameSize - radius,
        radius, 0.5 * Math.PI, Math.PI, false)
    context.closePath()

    context.fillStyle = opt.iconBgColor || POST.iconBgColor
    context.fill()
    context.strokeStyle = opt.borderColor || POST.borderColor
    context.lineWidth = opt.borderWidth || POST.borderWidth
    context.stroke()

    var img = new Image()
    img.src = imgSrc
    img.onload = function() {
      var size = iconFrameSize - POST.borderWidth * 2
      context.drawImage(img,
          margin + POST.borderWidth, margin + POST.borderWidth, size, size)
    }
  }

  function drawFrame(context, option) {
    var opt = option || {}
      , radius = POST.borderRadius // 角の丸み
      , curveWidth = 30 // 斜線部の幅
      , bezierCurveWidth = 10 // 斜線部の歪みの大きさ

    function lineToWithMargin(x, y) {
      context.lineTo(iconSize + margin + x, margin + y)
    }
    function bezierCurveToWithMargin(x1, y1, x2, y2, x3, y3) {
      context.bezierCurveTo(
          iconSize + margin + x1, margin + y1,
          iconSize + margin + x2, margin + y2,
          iconSize + margin + x3, margin + y3)
    }
    function moveToWithMargin(x, y) {
      context.moveTo(iconSize + margin + x, margin + y)
    }
    function arcToWithMargin(x1, y1, x2, y2) {
      context.arcTo(
          iconSize + margin + x1, margin + y1,
          iconSize + margin + x2, margin + y2, radius)
    }

    context.beginPath()
    moveToWithMargin(0, radius) // 左上
    arcToWithMargin(0, 0, radius, 0)
    lineToWithMargin(nameFrameWidth, 0) // 斜線部
    bezierCurveToWithMargin(
        nameFrameWidth + bezierCurveWidth, 0,
        nameFrameWidth + curveWidth - bezierCurveWidth, nameFrameHeight,
        nameFrameWidth + curveWidth, nameFrameHeight)
    lineToWithMargin(frameWidth - radius, nameFrameHeight) // 右上
    arcToWithMargin(
        frameWidth, nameFrameHeight,
        frameWidth, nameFrameHeight + radius)
    lineToWithMargin(frameWidth, frameHeight - radius) // 右下
    arcToWithMargin(
        frameWidth, frameHeight,
        frameWidth - radius, frameHeight)
    lineToWithMargin(radius, frameHeight) // 左下
    arcToWithMargin(0, frameHeight, 0, frameHeight - radius)
    context.closePath()

    context.fillStyle = opt.bgColor || POST.bgColor
    context.fill()
    context.lineWidth = opt.borderWidth || POST.borderWidth
    context.strokeStyle = opt.borderColor || POST.borderColor
    context.stroke()
  }

  function drawTitle(context, name, option) {
    var opt = option || {}
      , separaterCenter = ~~(separaterHeight / 2)
      , radius = POST.lineRadius
      , space = POST.lineSpace
      , step = (radius + space) * 2

    function arcWithDiff(x, y) {
      context.arc(x + diff + iconSize, y, radius, 0, Math.PI * 2)
    }
    context.fillStyle = opt.borderColor || POST.borderColor
    // 横の点線
    for (var x = radius, max = contentWidth; x < max; x += step) {
      context.beginPath()
      arcWithDiff(x, nameFrameHeight + margin + separaterCenter)
      context.closePath()
      context.fill()
    }
    // 縦の点線
    for (var i = 0; i < 3; i++) {
      for (var y = nameFrameHeight + separaterCenter + margin,
          min = diff; y > min; y -= step) {
        context.beginPath()
        arcWithDiff(radius + step * i, y)
        context.closePath()
        context.fill()
      }
    }
    context.font = lineHeight + "px 'rounded-mplus-1m-medium'"
    context.textBaseline = 'middle'
    context.fillStyle = opt.nameColor || POST.nameColor
    context.fillText(name, iconSize + diff + 3 * step + 5,
        margin + radius + ~~(nameFrameHeight / 2))
  }

  function drawMessage(context, message, fontSize, option) {
    var opt = option || {}
      , fontPx = 0
    switch (fontSize) {
      case 'S': fontPx = ~~(lineHeight / 2); break
      case 'M': fontPx = lineHeight; break
      case 'L': fontPx = lineHeight * 4; break
      default: throw new Error('Unknown font size'); break
    }
    context.font = (fontPx - 2) + "px 'rounded-mplus-1m-medium'"
    context.fillStyle = opt.color || POST.color
    context.textBaseline = 'middle'
    var fontCenter = ~~(fontPx / 2)
    message.split("\n").forEach(function(line, idx) {
      context.fillText(
        line, iconSize + diff,
        nameFrameHeight + diff + separaterHeight + fontCenter + fontPx * idx)
    })
  }

  function clearMessage(context, option) {
    var opt = option || {}
      , x = iconSize + diff
      , y = diff + nameFrameHeight + separaterHeight
      , w = contentWidth
      , h = contentHeight - nameFrameHeight - separaterHeight
    context.clearRect(x, y, w, h)
    context.fillStyle = opt.bgColor || POST.bgColor
    context.fillRect(x, y, w, h)
  }

  return {
    restrict: 'A',
    link: function(scope, element) {
      var context = element[0].getContext('2d')
      element
        .attr('width', width)
        .attr('height', height)
      scope.$on('drawAll', function() {
        drawBackground(context)
        drawIcon(context, scope.iconSrc, {borderColor: scope.borderColor})
        drawFrame(context, {borderColor: scope.borderColor})
        drawTitle(context, scope.name, {borderColor: scope.borderColor})
        drawMessage(context, scope.message, scope.fontSize)
      })
      scope.$on('drawPost', function() {
        drawFrame(context, {borderColor: scope.borderColor})
        drawTitle(context, scope.name, {borderColor: scope.borderColor})
        drawMessage(context, scope.message, scope.fontSize)
      })
      scope.$on('drawMessage', function() {
        clearMessage(context)
        drawMessage(context, scope.message, scope.fontSize)
      })
    }
  }
}])

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
