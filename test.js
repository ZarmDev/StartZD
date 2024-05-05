const icons = document.getElementsByClassName('image')
const names = document.getElementsByClassName('control')

var shortcuts = []

for (var i = 0; i < icons.length; i++) {
    var url = names[i].href;
    var icon = icons[i].children[0].src;
    var name = names[i].innerText;
    shortcuts.push(
        {
            icon: `http://www.google.com/s2/favicons?domain=${url}`,
            url: url,
            name: name
        })
}