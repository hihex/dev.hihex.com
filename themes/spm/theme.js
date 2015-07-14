exports.filters = {
  find_category: function (pages, cat) {
    var ret = []
    Object.keys(pages).forEach(function(key) {
      var item = pages[key]
      if (item.meta.filename === 'index') { return }
      if (item.meta.category === cat) {
        ret.push(item)
      }
    })
    ret = ret.sort(function (a, b) {
      return parseInt(a.meta.order) - parseInt(b.meta.order)
    })
    return ret
  },
  add_anchor: function(content) {
    for (var i = 1; i <= 6; i++) {
      var reg = new RegExp('(<h' + i + '\\sid="(.*?)">.*?)(<\/h' + i + '>)', 'g')
      content = content.replace(reg, '$1<a href="#$2" class="anchor">¶</a>$3')
    }
    return content
  }
}
