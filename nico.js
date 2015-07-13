exports.source = "docs"
exports.output = "_site"
exports.theme = "_themes/spm"
exports.permalink = "{{directory}}/{{filename}}.html"
exports.writers = [
    "nico.PageWriter",
    "nico.FileWriter",
    "nico.StaticWriter"
]
exports.package = require('./package.json')
