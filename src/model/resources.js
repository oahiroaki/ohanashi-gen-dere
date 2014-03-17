App.factory('Idols', ['$resource',
function($resource) {
  return $resource('idol_list.json')
}])

App.factory('Icons', ['$resource',
function($resource) {
  return $resource('face_list.json')
}])
