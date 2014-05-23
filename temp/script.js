//Global variables

  var imageLoader = document.getElementById('imageLoader'),
      picWidth,
      picHeight,
      picLength,
      frequency = {},
      paletteNum = 5;
  imageLoader.addEventListener('change', handleImage, false);

  function handleImage(e){
    var reader = new FileReader();
    reader.onload = function(event){
      var img = new Image(); // Create a new blank image.
      img.src = event.target.result;
      
      // Load the image and display it.
      img.onload = function(){
        console.log("Image loaded.");

            picWidth = img.width, // width of the canvas
            picHeight = img.height, // height of the canvas
            picLength = picWidth * picHeight; // number of pixels

        // Get the canvas element.
        canvas = document.createElement('canvas');

        // Make sure you got it.
        if (canvas.getContext) {
          ctx = canvas.getContext("2d");

          canvas.width=picWidth;
          canvas.height=picHeight;
          ctx.drawImage(img, 0, 0, picWidth, picHeight);
          document.body.appendChild(canvas);
          getColorData();

        }
      }
    }
    reader.readAsDataURL(e.target.files[0]);     
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

      //avoid black and white
      if(rgb in frequency && rgb != "0,0,0" && rgb != "255,255,255") {
          frequency[rgb]++;
      }
      else {
          frequency[rgb] = 1;
      }
    }

    getPalette();

  }

  function getPalette(){
    var color = getMax();
    appendColor(color);
    getComplement(color, paletteNum - 1);
  }

  function getComplement(baseColor, num){
    console.log(num);
    if(num > 0){
      var hsv = colorToObj(baseColor),
          value = hsv.value;
      hueRatio = 360/paletteNum;
      hueRange = hsv.hue + hueRatio;
      hueShift = hueRatio/2;
      hueMin = hueRange - hueShift;
      hueMax = hueRange + hueShift;

      var initHue = -1,
          initValue = -1;
      while( ((initHue < hueMin) || (initHue > hueMax)) && ((initValue < 20) || (initValue > 90)) ){
        var max = getMax();
        var hsv = colorToObj(max);
            initHue = hsv.hue;
            initValue = hsv.value;
      }
      console.log("Hue: "+initHue+", Value: "+initValue);
      var newRGB = HSV2RGB(hsv);
      appendColor(max);
      getComplement(max, num - 1);
    }
    else{
      console.log("Done!");
      return false;
    }
  }

  function getMax(){
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
    return maxProp;
  }

  function colorToObj(color){
    var newColor = color.split(",");
    var colorObj = {};
    colorObj.r = newColor[0];
    colorObj.g = newColor[1];
    colorObj.b = newColor[2];
    var hsv = RGB2HSV(colorObj);
    return hsv;
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

  function min3(a,b,c) { 
      return (a<b)?((a<c)?a:c):((b<c)?b:c); 
  } 
  function max3(a,b,c) { 
      return (a>b)?((a>c)?a:c):((b>c)?b:c); 
  }
