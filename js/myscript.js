var target_drag = document.getElementById("box"); // div drag&drop
var target_brows = document.getElementById("fileb"); // input file browser
var preview = document.querySelector(".preview"); // text name of input
var submit = document.getElementById("go"); // buttom to submit input
var k = document.getElementById("kcent"); // number of centroids (text form)
var back = document.getElementById("toggle-on"); // remove background (round form)
var back_off = document.getElementById("toggle-off"); // don't remove background (round form)
back.checked = true; // default

submit.style.cursor = "default"; // don't change pointer

// 0. HANDY FUNCTIONS

// check type
var fileTypes = [
  'image/jpeg',
  'image/pjpeg',
  'image/png',
  'image/svg'
]

function validFileType(file) {
    for(var i = 0; i < fileTypes.length; i++) {
        if(file.type === fileTypes[i]) {
            return true;
        }
    }
    return false;
}

// check file size
function returnFileSize(number) {
    if(number < 1024) {
        return number + 'bytes';
    } else if(number >= 1024 && number < 1048576) {
        return (number/1024).toFixed(1) + 'KB';
    } else if(number >= 1048576) {
        return (number/1048576).toFixed(1) + 'MB';
    }
}

// object to check if everything's ready to process user input
var sender = {
    _file : "", // input image
    _back : true, // remove background?
    _k : false, // number of centroids (colors in charts)
    _sended : false, // bool, if true, send the input
    get file () {
        return this._file;
    },
    set file (f) {
        this._file = f;
        this.isready();
    },
    get back () {
        return this._back;
    },
    set back (b) {
        if (b == "on"){
            this._back = true;
        } else{
            this._back = false;
        }
        this.isready();
    },
    get k () {
        return this._k;
    },
    set k (centr) {
        this._k = centr;
        this.isready();
    },
    isready : function() {
        // check if file is loaded
        var file = this._file;
        var k = this._k;
        if (k && "undefined" != typeof(file["size"])){
            submit.disabled = false;
        }
    }
}

// 1. DROP SPECIFICATIONS

// hide value (name of file) of uploaded file, to control it via JS.
target_brows.style.opacity = 0;
// cancel default options of dropping on whole page.
document.body.addEventListener("dragover", function(event){
    event.preventDefault();
});
document.body.addEventListener("drop", function(event){
    event.preventDefault();
});
target_drag.addEventListener("dragover", function(event) {
    // prevent default on box and change color
    event.preventDefault();
    target_drag.style.backgroundColor = "white";
}, false);
target_drag.addEventListener("drop", function(event) {

    // cancel default actions
    event.preventDefault();
    // restore default when drop
    target_drag.style.backgroundColor = "rgb(215, 215, 255)";
    var file = event.dataTransfer.files[0];
    if (validFileType(file)){
        var para = document.createElement('p');
        var frm = document.getElementById("userimg")
        para.textContent = file.name + ' (' + returnFileSize(file.size) + ')';
        while(preview.firstChild) {
            preview.removeChild(preview.firstChild);
        }
        while(frm.firstChild){
            frm.removeChild(frm.firstChild)
        }
        preview.appendChild(para);
        var image = document.createElement('img');
        image.src = window.URL.createObjectURL(file);
        frm.appendChild(image);
        sender.file = file
    }

}, false);

// 2. BROWSE SPECIFICATIONS
// Event function
function updateImageDisplay() {
    // clean text
    while(preview.firstChild) {
        preview.removeChild(preview.firstChild);
    }
    var curFiles = target_brows.files;
    if(curFiles.length == 0) {
        var para = document.createElement('p');
        para.textContent = 'No files selected';
        preview.appendChild(para);
    } else {
        var list = document.createElement('ol');
        preview.appendChild(list);
        for(var i = 0; i < curFiles.length; i++) {
          var listItem = document.createElement('li');
          var para = document.createElement('p');
          if(validFileType(curFiles[i])) {
            para.textContent = curFiles[i].name + '(' + returnFileSize(curFiles[i].size) + ')';
            var image = document.createElement('img');
            image.src = window.URL.createObjectURL(curFiles[i]);
            var frm = document.getElementById("userimg")
            // clean previous images
            while(frm.firstChild){
                frm.removeChild(frm.firstChild)
            }
            frm.appendChild(image);
            listItem.appendChild(para);
            var file = curFiles[i];

          } else {
            para.textContent = curFiles[i].name + ': Not a valid file type.';
            listItem.appendChild(para);
          }

          list.appendChild(listItem);
        }
    }
}
target_brows.addEventListener('change', updateImageDisplay);

// 3. MANAGE SEND FORM

function updateKvalue(event) {
    sender.k = event.target.value;
}

k.addEventListener('change', updateKvalue)

function updateIfBackYes(event) {
    sender.back = event.target.value;
}
back.addEventListener('change', updateIfBackYes);

function updateIfBackNo(event) {
    sender.back = "off";
}
back_off.addEventListener('change', updateIfBackNo);

function processInput(event){
    event.preventDefault()
    var file = sender.file;
    fread = new FileReader();
    fread.readAsDataURL(file)
    console.log(fread)
}
submit.addEventListener('click', processInput)
