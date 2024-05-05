const params = {
	"latitude": 52.52,
	"longitude": 13.41,
	"hourly": "temperature_2m",
	"timezone": "America/New_York"
};
//https://api.open-meteo.com/v1/gfs?latitude=52.52&longitude=13.41&hourly=temperature_2m&timezone=America%2FNew_York
//https://api.open-meteo.com/v1/gfslatitude=52.52&lo…hourly=temperature_2m&timezone=America%2FNew_York
var url = "https://api.open-meteo.com/v1/gfs?";

let keys = Object.keys(params)
let vals = Object.values(params)
for (var i = 0; i < keys.length; i++) {
    if (typeof vals[i] == 'string') {
        vals[i] = vals[i].replace('/', '%2F')
    }
    if (i != keys.length -1) {
        url += `${keys[i]}=${vals[i]}&`
    } else {
        url += `${keys[i]}=${vals[i]}`
    }
}

async function getWeatherData() {
    const res = await fetch(url, {...params});
    const data = await JSON.parse((await res.text()))

    var date = new Date()
    
    var target = date.toISOString()
    var times = data["hourly"]["time"]
    var temps = data["hourly"]["temperature_2m"]

    for (var i = 0; i < times.length; i++) {
        if (target.slice(0, 12) == times[i].slice(0, 12)) {
            let farenheit = Math.round(temps[i] * (9/5)) + 32
            document.getElementById('weatherContent').innerText = `Weather: ${temps[i]}C ${farenheit}F`;
        }
    }
}

getWeatherData();

var shortcuts = localStorage.getItem('shortcuts');

if (shortcuts == null) {
    shortcuts = []
} else {
    shortcuts = JSON.parse(shortcuts);
}

const shortcutsDiv = document.getElementById('shortcuts')
const addShortcut = document.getElementById('addShortcut')
const editShortcut = document.getElementById('editButton');
const editShortcutPopup = document.getElementById('editShortcutPopup');
const editShortcutPopupX = document.getElementById('editShortcutPopupX')
const editShortcutPopupDelete = document.getElementById('editShortcutPopupDelete');
const background = document.getElementById('background');
const backgroundFile = document.getElementById('backgroundFile');
const backgroundFileLabel = document.getElementById('backgroundFileLabel');
const toggleWeather = document.getElementById('toggleWeather');
const weatherContentDiv = document.getElementById('weatherContentDiv')

// global variables
const global = {
    "currentIconEditing": null
}

// ## ALL SETUP RELATED STUFF ##

function addTestShortcuts() {
    localStorage.setItem('shortcuts', null)
    shortcuts = []
    for (var i = 0; i < 20; i++) {
        var url = "https://google.com"
        var name = `google${i}`
        shortcuts.push(
            {
                icon: `http://www.google.com/s2/favicons?domain=${url}`,
                url: url,
                name: name
            })
    }
}

// addTestShortcuts()
document.getElementsByTagName('body')[0].style.backgroundImage = `url(${localStorage.getItem('backgroundImg')})`;

console.log(shortcuts);

function updateShortcutList() {
    // set localstorage shortcuts to current shortcuts
    localStorage.setItem('shortcuts', JSON.stringify(shortcuts));
    shortcutsDiv.innerHTML = '';
    shortcutsDiv.appendChild(addShortcut)
    for (var i = 0; i < shortcuts.length; i++) {
        const url = shortcuts[i]["url"];

        var shortcutElem = document.createElement('div');
        shortcutElem.className = 'icon'
        var shortcutIcon = document.createElement('img');
        shortcutIcon.src = shortcuts[i]["icon"];
        var shortcutName = document.createElement('a');
        shortcutName.href = url;
        shortcutName.innerText = shortcuts[i]["name"]
        var editShortcut = document.createElement('button');
        editShortcut.innerText = '...';
        editShortcut.className = 'editShortcut';

        shortcutElem.addEventListener('click', (function(url) {
            return function() {
                window.location.href = url;
            }
        })(url))
        editShortcut.addEventListener('click', (function (i) {
            return function (event) {
                event.stopPropagation()
                editShortcutPopup.style.display = 'flex';
                global["currentIconEditing"] = i;
            }
        })(i));

        shortcutElem.appendChild(editShortcut)
        shortcutElem.appendChild(shortcutIcon)
        shortcutElem.appendChild(shortcutName)
        shortcutsDiv.appendChild(shortcutElem)
    }
}

updateShortcutList()

addShortcut.addEventListener('click', function () {
    let name = prompt("Name?")
    let url = prompt("Url?")
    if (name == '' || url == '') {
        return
    }
    // if no https:// found, add it
    if (url.indexOf('https://') == -1) {
        url = `https://${url}`
    }
    // TODO: check if https is in the url and if not add it in
    shortcuts.push(
        {
            icon: `http://www.google.com/s2/favicons?domain=${url}`,
            url: url,
            name: name
        })
    updateShortcutList()
})

editShortcutPopupX.addEventListener('click', function () {
    editShortcutPopup.style.display = 'none'
})

editShortcutPopupDelete.addEventListener('click', function () {
    editShortcutPopup.style.display = 'none';
    shortcuts.splice(Number(global["currentIconEditing"]), 1)
    // console.log(shortcuts);
    updateShortcutList()
})

// Credits to https://stackoverflow.com/questions/67754721/can-i-store-image-as-blob-to-localstorage-or-somewhere-so-it-can-used-in-another
// And https://stackoverflow.com/questions/24786848/error-not-allowed-to-load-local-resource

function getBase64Image(img) {
    var canvas = document.getElementById('canvas');
    console.log(img, img.width, img.height);
    canvas.width = img.width;
    canvas.height = img.height;
    canvas.style.visibility = 'hidden';
    
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    console.log(canvas);
    var dataURL = canvas.toDataURL("image/png");
    console.log(dataURL);
    // return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    return dataURL;
}

function uploadBackgroundFile() {
    let fileUpload = document.getElementById('backgroundFile');

    let objectBlob = URL.createObjectURL(fileUpload.files[0])
    console.log(objectBlob, fileUpload.files[0]);
    var background = document.getElementById('background');
    background.style.visibility = 'hidden';
    background.src = objectBlob;

    setTimeout(function () {
        console.log(getBase64Image(background));
        try {
            localStorage.setItem("backgroundImg", getBase64Image(background));
        } catch {
            alert('Your image size is too big. Please upload a smaller file.')
        }

        window.location.reload(true)
    }, 1000)
}

backgroundFile.addEventListener('change', uploadBackgroundFile)
backgroundFileLabel.addEventListener('click', () => {
    backgroundFile.click()
})

function toggleWeatherFunc(condition, shouldEditLocalStorage) {
    if (shouldEditLocalStorage) {
        localStorage.setItem('toggleWeather', condition)
    }
    // Thanks AI!!! (i didnt know about getAttribute)
    if (condition) {
        toggleWeather.src = './assets/off-button.png'
        weatherContentDiv.style.display = 'none'
    } else {
        toggleWeather.src = './assets/toggle-button.png'
        weatherContentDiv.style.display = 'flex'
    }
}

if (localStorage.getItem('toggleWeather') == null) {
    localStorage.setItem('toggleWeather', 'false')
}

// using === to convert it to boolean
console.log(localStorage.getItem('toggleWeather') === 'true')
toggleWeatherFunc(localStorage.getItem('toggleWeather') === 'true', false)
toggleWeather.addEventListener('click', () => {toggleWeatherFunc(toggleWeather.getAttribute('src') == './assets/toggle-button.png', true)})