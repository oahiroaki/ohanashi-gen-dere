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
