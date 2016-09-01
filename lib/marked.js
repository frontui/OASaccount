var through2 = require('through2')
var nunjucks = require('nunjucks')
var markdown = require('marked')
var cheerio        = require('cheerio')

function trim(text) {
  return text.replace(/^\s*/, '').replace(/\s*$/, '');
}

function render(content) {
  var html = [], id = '';
  var $ = cheerio.load(content);
  var h2 = $('h2'), h3 = null;
  h2.map(function(index, el) {
    id = trim($(this).text());
    $(this).attr('id', id).prepend('<a class="anchor" href="#'+ id +'" aria-hidden="true"><span class="octicon octicon-link"></span></a>');
    html.push('<li><a href="#'+ id +'">'+ id +'</a></li>');
  })

  $('h3,h4,h5,h6,h7').attr('id', function(){
    var id = trim($(this).text());
        $(this).prepend('<a class="anchor" href="#'+ id +'" aria-hidden="true"><span class="octicon octicon-link"></span></a>');
    return id;
  })

  return {
    menu: html.join('\n'),
    content: $.html()
  };
}

function getFileName(url) {
  var matchs = url.split(/\\|\//g);
  return matchs[matchs.length - 1];
}


function marked ( path, root, options ) {
  nunjucks.configure(root);
  return function(data) {
    return through2.obj(function(file, enc, next) {
      markdown.setOptions(options);
      // https://github.com/gulpjs/vinyl#path
      var title = getFileName(file.path);
      var content = markdown(file.contents.toString());
      var json = render(content);
      var html = {
        title: title,
        menu: json.menu,
        content: json.content
      };
      for(var i in data) {
        html[i] = data[i];
      }
      var res = nunjucks.render(path, html);
      file.contents = new Buffer(res);
      return next(null, file);
    });
  }
}

module.exports = marked
