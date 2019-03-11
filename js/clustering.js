// This scripts performs a Kmeans with the color of an image and prints to screen
// the result in the image.

// Author: Jorge Carrasco Muriel
// Date of creation: 10/03/2019

// 1. GET RGB VALUES AND POSITION OF PIXELS FROM IMAGE FILE
function processPixels (file) {

    this.file = file;
    this.RGBval = new Array(); // RGB values, array of arrays[3]

    this.extract_data = function (){
        file = this.file
        var img = document.createElement('img');
        img.src = window.URL.createObjectURL(file);
        var canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        var context = canvas.getContext('2d');
        context.drawImage(img, 0, 0 );
        var myData = context.getImageData(0, 0, img.width, img.height);
        this.pos = new Array();
        for (var y = 0; y < img.height; y +=1){
            for (var x = 0; x < img.width; x +=1){
                this.pos.push([x,y])
            }
        }
        this.data =  myData;
        this.extract_RGB();
    };

    this.extract_RGB = function (){
        imgData = this.data;
        for (var i = 0; i < imgData.data.length; i += 4) {
            // imgData is length width * height * 4, containing 4 entries for each
            // pixel (RGBA) and it's iterated from the left to the right, starting from
            // the top.
            this.RGBval.push([imgData.data[i], imgData.data[i+1], imgData.data[i+2]])
            // "A" value is ignored; transparency shouldn't be used with categorical data.
        }
    }
}

// 2. KMEANS
function KMeans (data, k){
    this.data = data;
    this.k = k;

    this.measure_eucl = function (x, y) {
        // Calculates euclidean distance.
        // "x" and "y" are arrays of same length
        if (x.length != y.length){
            console.log("ERROR: "+ x + " and " + y + " must have the same length");
            return 0;
        }
        dist = 0;
        for (var i = 0; i < x.length; i++){
            dist += Math.pow((x[i]-y[i]), 2);
        }
        return Math.sqrt(dist);
    }

    this.get_dimensions = function() {
        // function to get dimension factor of data
        var max = -Infinity;
        var min = Infinity;
        for (var i = 0; i < this.data.length; i+=1){
            if (Math.max(...this.data[i]) > max){
                max = Math.max(...this.data[i])
            }
            if (Math.min(...this.data[i]) < min){
                min = Math.min(...this.data[i])
            }
        }
        return [max, min]
    }

    this.random_centroids = function() {
        // function that initializes centroids
        var centroids = this.data.slice(0); // copy
        centroids.sort(function() {
            return (Math.round(Math.random()) - 0.5);
        });
        return centroids.slice(0, k);
    }

    this.classify = function (point, centroids) {
        // Function that asign a point to a group (centroid, label)
        var min = Infinity,
            index = 0;

        for (var i = 0; i < this.centroids.length; i++) {
            var dist = this.measure_eucl(point, this.centroids[i]);
            if (dist < min) {
                min = dist;
                index = i;
            }
        }

        return index;
    }

    this.abs_compare_arrays = function(x, y){
        if (x.length != y.length){
            console.log("ERROR: "+ x + " and " + y + " must have the same length");
            return false
        }
        for (var i = 0; i < x.length; i += 1){
            if (x[i] != y[i]){
                return false
            }
        }
        return true
    }

    this.run = function (pos) {
        // Main function, compute KMEANS algorithm
        // pos will be used just if lines are to be removed.
        pos = pos || false;
        this.centroids = this.random_centroids();
        var assignment = new Array(this.data.length);
        var clusters = new Array(k);
        var it = 0;

        var movement = true;
        while (movement){
            it += 1;
            // update point-to-centroid assignments
            for (var p = 0; p < this.data.length; p += 1){
                assignment[p] = this.classify(this.data[p])
            }
            // update location of each centroid
            movement = false;
            for (var j = 0; j < k; j++) {
                var assigned = [];
                for (var i = 0; i < assignment.length; i++) {
                    if (assignment[i] == j) {
                    assigned.push(this.data[i]);
                    }
                }
                if (!assigned.length) {
                    continue;
                }
                var centroid = this.centroids[j];
                var newCentroid = new Array(centroid.length);
                for (var g = 0; g < centroid.length; g++) {
                    var sum = 0;
                    for (var i = 0; i < assigned.length; i++) {
                        sum += assigned[i][g];
                    }
                    newCentroid[g] = sum / assigned.length;

                    if (newCentroid[g] != centroid[g]) {
                        movement = true;
                    }
                    this.centroids[j] = newCentroid;
                    clusters[j] = assigned;
                }
            }
        }
        this.clusters = clusters;
        if (pos != false){
            // filter cluster of lines
            this.pos = pos
            for (var c = 0; c < this.clusters.length; c++){
                if (this.clusters[c] / assignment.length < 0.01){
                    // remove lines
                    var ind = -1;
                    while (true){
                        ind = assignment.indexOf(c);
                        if (ind == -1){
                            break
                        }
                        this.data.splice(ind, 1);
                        this.pos.splice(ind, 1);
                        assignment.splice(ind, 1)
                    }
                    return this.run()
                }
            }
        }
        this.assignment = assignment;
        this.iterations = it;
        return assignment;
    }

    this.mapMean = function (attr) {
        // Function to calculate the mean of another attribute of the instances
        // for each k.
        // call this function AFTER calling run
        if (this.centroids == "undefined"){
            console.log("Kmeans hasn't been computed yet.");
            return false;
        }
        var dlen = this.assignment.length;
        var dim = attr[0].length;
        var alen = new Number(this.k);
        var means = new Array();
        for (var i = 0; i < alen; i++){
            means.push([0,0])
        }

        for (var g = 0; g < this.assignment.length; g++){
            for (var d = 0; d < dim; d++){
                means[this.assignment[g]][d] += attr[g][d];
            }
        }

        for (var g = 0; g < means.length; g += 1){ // divide each element between len of data
            for (var d = 0; d < dim; d++){
                means[g][d] /= this.clusters[g].length
            }
        }

        return means
    }
}

// MODE functon, to eliminate background
var mode = function(arr){
    var numMapping = {};
        for(var i = 0; i < arr.length; i++){
            if(numMapping[arr[i]] === undefined){
                numMapping[arr[i]] = 0;
            }
                numMapping[arr[i]] += 1;
        }
        var greatestFreq = 0;
        var mode;
        for(var prop in numMapping){
            if(numMapping[prop] > greatestFreq){
                greatestFreq = numMapping[prop];
                mode = prop;
            }
        }
        return parseInt(mode);
}
