//Global variables
  var picWidth = 500, // width of the canvas
      picHeight = 695, // height of the canvas
      picLength = picWidth * picHeight, // number of pixels
      myImage = new Image(), // Create a new blank image.
      frequency = {},
      paletteNum = 3;

  
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

    getMaxColor(paletteNum);

  }

  function getMaxColor(num){
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
      delete frequency[maxProp];
      if(i == 0){
        var primeColor = maxProp
        appendColor(maxProp);
      }
      else{
        getcomplement(primeColor);
      }
    }
  }

  function getcomplement(color){
    var newColor = color.split(",");
    //var newColor = RGB2HSV(color);
    var newColorObj = {};
    newColorObj.r = newColor[0];
    newColorObj.g = newColor[1];
    newColorObj.b = newColor[2];
    var HSV = RGB2HSV(newColorObj);
    HSV.hue = HSV.hue + 120;
    var newRGB = HSV2RGB(HSV);
    console.log(newRGB);
  }

  function appendColor(color){
    $(".palette").append("<span class='palette-item'></span>");
    $(".palette-item:last").css("background-color","rgb("+color+")");
  }

  function RGB2HSV(rgb) {
    var hsv = new Object();
    var max=max3(rgb.r,rgb.g,rgb.b);
    var dif=max-min3(rgb.r,rgb.g,rgb.b);
    hsv.saturation=(max===0.0)?0:(100*dif/max);
    if (hsv.saturation===0) hsv.hue=0;
    else if (rgb.r==max) hsv.hue=60.0*(rgb.g-rgb.b)/dif;
    else if (rgb.g==max) hsv.hue=120.0+60.0*(rgb.b-rgb.r)/dif;
    else if (rgb.b==max) hsv.hue=240.0+60.0*(rgb.r-rgb.g)/dif;
    if (hsv.hue<0.0) hsv.hue+=360.0;
    hsv.value=Math.round(max*100/255);
    hsv.hue=Math.round(hsv.hue);
    hsv.saturation=Math.round(hsv.saturation);
    return hsv;
  }

  function HSV2RGB(hsv) {
    var rgb=new Object();
    if (hsv.saturation===0) {
        rgb.r=rgb.g=rgb.b=Math.round(hsv.value*2.55);
    } else {
        hsv.hue/=60;
        hsv.saturation/=100;
        hsv.value/=100;
        i=Math.floor(hsv.hue);
        f=hsv.hue-i;
        p=hsv.value*(1-hsv.saturation);
        q=hsv.value*(1-hsv.saturation*f);
        t=hsv.value*(1-hsv.saturation*(1-f));
        switch(i) {
            case 0: rgb.r=hsv.value; rgb.g=t; rgb.b=p; break;
            case 1: rgb.r=q; rgb.g=hsv.value; rgb.b=p; break;
            case 2: rgb.r=p; rgb.g=hsv.value; rgb.b=t; break;
            case 3: rgb.r=p; rgb.g=q; rgb.b=hsv.value; break;
            case 4: rgb.r=t; rgb.g=p; rgb.b=hsv.value; break;
            default: rgb.r=hsv.value; rgb.g=p; rgb.b=q;
        }
        rgb.r=Math.round(rgb.r*255);
        rgb.g=Math.round(rgb.g*255);
        rgb.b=Math.round(rgb.b*255);
    }
    return rgb;
  }

  //Might not need min3
  function min3(a,b,c) { 
      return (a<b)?((a<c)?a:c):((b<c)?b:c); 
  } 
  function max3(a,b,c) { 
      return (a>b)?((a>c)?a:c):((b>c)?b:c); 
  }
