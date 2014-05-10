//Global variables
  var picWidth = 500, // width of the canvas
      picHeight = 695, // height of the canvas
      picLength = picWidth * picHeight, // number of pixels
      myImage = new Image(), // Create a new blank image.
      frequency = {},
      paletteNum = 25;

  
  // Load the image and display it.
  function displayImage() {

    // Get the canvas element.
    canvas = document.getElementById("myCanvas");

    // Make sure you got it.
    if (canvas.getContext) {

      // Specify 2d canvas type.
      ctx = canvas.getContext("2d");

      // When the image is loaded, draw it.
      myImage.onload = function() {
        // Load the image into the context.
        ctx.drawImage(myImage, 0, 0);

        // Get and modify the image data.
        getColorData();

      }

      // Define the source of the image.
      // This file must be on your machine in the same folder as this web page.
      myImage.src = "images/starwars.jpg";
    }
  }

  function getColorData() {

    myImage = ctx.getImageData(0, 0, picWidth, picHeight);

    // Loop through data.
      // Second bytes are green bytes.
      // Third bytes are blue bytes.
      // Fourth bytes are alpha bytes
    for (var i = 0; i < picLength * 4; i += 4) {

      var r = myImage.data[i],
          g = myImage.data[i+1],
          b = myImage.data[i+2],
          rgb = r+","+g+","+b;

      if(rgb in frequency) {
          frequency[rgb]++;
      }
      else {
          frequency[rgb] = 1;
      }
    }

    getColorPalette(paletteNum);

  }

  function getColorPalette(num){
    // find highest number
    for (var i = 0; i < num; i++) {
      var maxProp = null,
        maxValue = -1;
      for (var prop in frequency) {
        if (frequency.hasOwnProperty(prop)) {
          var value = frequency[prop]
          if (value > maxValue) {
            maxProp = prop
            maxValue = value
          }
        }
      }

      $(".palette").append("<span class='palette-item'></span>");
      $(".palette-item:last").css("background-color","rgb("+maxProp+")");
      console.log(maxProp);
      delete frequency[maxProp];
    }
    
  }