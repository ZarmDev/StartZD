// remember to change .ql-editor>* if you change this value
const defaultFontValue = '20px';

// thanks to https://stackoverflow.com/users/5551593/andrew in https://stackoverflow.com/questions/38623716/how-to-add-custom-font-sizes-to-quilljs-editor
const fontSizeArr = ['8px', '9px', '10px', '12px', '14px', '16px', '20px', '24px', '32px', '42px', '54px', '68px', '84px', '98px'];
var Size = Quill.import('attributors/style/size');
Size.whitelist = fontSizeArr;
Quill.register(Size, true);

// thanks to https://stackoverflow.com/questions/43728080/how-to-add-font-types-on-quill-js-with-toolbar-options
const fontFamilyArr = ["Sans Serif", "monospace", "Roboto Condensed", "Times New Roman", "Calibri", "Calibri Light", "Sans-Serif"];
let fonts = Quill.import("attributors/style/font");
fonts.whitelist = fontFamilyArr;
Quill.register(fonts, true);


// thanks to https://stackoverflow.com/questions/42068335/quill-js-color-textbox
const modulesOptions = {
    toolbar: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'font': fontFamilyArr }],
        [{ 'size': fontSizeArr }],
        [{ 'align': [] }],
        ['bold', 'italic', 'underline'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'color': ['#000000', '#e60000', '#ff9900', '#ffff00', '#008a00', '#0066cc', '#9933ff', '#ffffff', '#facccc', '#ffebcc', '#ffffcc', '#cce8cc', '#cce0f5', '#ebd6ff', '#bbbbbb', '#f06666', '#ffc266', '#ffff66', '#66b966', '#66a3e0', '#c285ff', '#888888', '#a10000', '#b26b00', '#b2b200', '#006100', '#0047b2', '#6b24b2', '#444444', '#5c0000', '#663d00', '#666600', '#003700', '#002966', '#3d1466', 'custom-color'] }, { 'background': [] }, 'link'],
    ],
    // pretty cool custom key bindings
    // keyboard: {
    //     bindings: {
    //         tab: false,
    //         custom: {
    //             key: 13,
    //             shiftKey: true,
    //             handler: function () {  }
    //         }
    //     }
    // },
};

const formatsOptions = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'indent', 'align',
    'link', 'image', 'background', 'color'
];

document.addEventListener("DOMContentLoaded", function () {
    var quill = new Quill('#content', {
        formats: formatsOptions,
        modules: modulesOptions,
        theme: 'snow'
    })
});


const content = document.getElementById('content');
if (localStorage.getItem('content') == null) {
    localStorage.setItem('content', '')
    content.innerHTML = 'Get started here!'
} else {
    content.innerHTML = localStorage.getItem('content')
}

setInterval(() => {
    localStorage.setItem('content', content.innerHTML)
}, 1000)