// Main script of the webpage Pynum

// Author: Jorge Carrasco Muriel
// Date of creation: 08/03/2019

var target_drag = document.getElementById("box"); // div drag&drop
var target_brows = document.getElementById("fileb"); // input file browser
var preview = document.querySelector(".preview"); // text name of input
var submit = document.getElementById("go"); // buttom to submit input
var k = document.getElementById("kcent"); // number of centroids (text form)
var back = document.getElementById("toggle-on"); // remove background (round form)
var back_off = document.getElementById("toggle-off"); // don't remove background (round form)
back.checked = true; // default
k.value = "0";

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
// check mobile browser
window.mobilecheck = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

// Vertical scroll if mobile
if (window.mobilecheck()){
    window.addEventListener('load', function(e) {
        setTimeout(function() { window.scrollTo(0, 1); }, 1);
    }, false);
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
            submit.style.cursor = "pointer";
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
            sender.file = file;

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
    event.preventDefault();
    var file = sender.file;
    var data = new processPixels(file);
    data.extract_data();
    var pos = data.pos.slice();
    var k = sender.back ? sender.k*1 + 1 : sender.k;
    console.log(sender.k);
    kobj = new KMeans(data.RGBval, k);
    kobj.run(pos);
    pos = kobj.pos;
    var num_pos = kobj.mapMean(pos);
    totpix = pos.length;
    clust = kobj.clusters;
    centroids = kobj.centroids;
    lab_backg = mode(kobj.assignment.slice(0,1)); // from the top of the img
    // free memory
    kobj = null;
    data = null;
    pos = null;
    for (var i = 0; i < clust.length; i++){
        clust[i] = clust[i].length * 100 / totpix
    }
    if (sender.back){
        var ind = lab_backg;
        var backg = clust[lab_backg];
        clust.splice(ind, 1);
        num_pos.splice(ind, 1);
        centroids.splice(ind,1)
        backg = 100 - backg
        for (var i = 0; i < clust.length; i++){
            clust[i] = clust[i] * 100 / backg;
            // clust[i] = Number(Math.round(clust[i]+'e2')+'e-2'); // round
        }
    }
    // Print data to img
    var img = document.createElement('img');
    img.src = window.URL.createObjectURL(file);
    var canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    var context = canvas.getContext('2d');
    context.font = "10pt Verdana";
    context.clearRect(0,0,canvas.width,canvas.height);
    context.drawImage(img, 0, 0 );
    context.fillStyle = "black";
    for (var i = 0; i < clust.length; i++){
        var p = document.createElement('p');
        var a = Number(Math.round(clust[i]*100)/100)
        p.value = a;
        context.fillText(p.value,num_pos[i][0],num_pos[i][1]);
    }
    // Add a legend
    var listElement = document.createElement('ul');
    for (var i = 0; i < centroids.length; i++){
        var listItem = document.createElement('li');
        listItem.innerHTML = clust[i]; // testing
        listItem.style.color = 'rgb('+ centroids[i].join(',') +')';
        listItem.style.fontSize = "12";
        listElement.appendChild(listItem);
    }
    // Draw it to page
    var new_image_url = canvas.toDataURL();
    var img2 = document.createElement('img');
    img2.src = new_image_url;
    console.log(img2);
    // window.open(img2.src, img2)
    var fff = document.getElementById("final");
    fff.style.zIndex = "3";
    fff.appendChild(img2);
    fff.appendChild(listElement);
}
submit.addEventListener('click', processInput);
