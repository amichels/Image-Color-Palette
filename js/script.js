var palColor = {
  imageLoader:document.getElementById('imageLoader'),
  picWidth:null,
  picHeight:null,
  picLength:null,
  frequency: {},
  paletteNum: 5,
  init:function(){
    palColor.imageLoader.addEventListener('change', palColor.handleImage, false)
  },
  handleImage:function(e){
    var reader = new FileReader();
    reader.onload = function(event){
      var img = new Image(); // Create a new blank image.
      img.src = event.target.result;
      
      // Load the image and display it.
      img.onload = function(){
        console.debug("Image loaded.");

            palColor.picWidth = img.width, // width of the canvas
            palColor.picHeight = img.height, // height of the canvas
            palColor.picLength = palColor.picWidth * palColor.picHeight; // number of pixels

        // Get the canvas element.
        canvas = document.createElement('canvas');

        // Make sure you got it.
        if (canvas.getContext) {
          ctx = canvas.getContext("2d");

          canvas.width=palColor.picWidth;
          canvas.height=palColor.picHeight;
          ctx.drawImage(img, 0, 0, palColor.picWidth, palColor.picHeight);
          document.body.appendChild(canvas);
          palColor.getColorData();

        }
      }
    }
    reader.readAsDataURL(e.target.files[0]);
  },
  getColorData:function(){
    myImage = ctx.getImageData(0, 0, palColor.picWidth, palColor.picHeight);

    // Loop through data.
      // Second bytes are green bytes.
      // Third bytes are blue bytes.
      // Fourth bytes are alpha bytes
    for (var i = 0; i < palColor.picLength * 4; i += 4) {

      var r = myImage.data[i],
          g = myImage.data[i+1],
          b = myImage.data[i+2],
          rgb = r+","+g+","+b;

      //avoid black and white
      if(rgb in palColor.frequency && rgb != "0,0,0" && rgb != "255,255,255") {
          palColor.frequency[rgb]++;
      }
      else {
          palColor.frequency[rgb] = 1;
      }
    }
    palColor.getPalette();
  },
  getPalette:function(){
    var color = palColor.getMax();
    palColor.appendColor(color);
    palColor.getComplement(color, palColor.paletteNum - 1);
  },
  getComplement:function(baseColor, num){
    console.debug(num);
    if(num > 0){
      var hsv = palColor.colorToObj(baseColor);
          hueRatio = 360/palColor.paletteNum,
          hueRange = hsv.hue + hueRatio,
          hueShift = hueRatio/2,
          hueMin = hueRange - hueShift,
          hueMax = hueRange + hueShift;

      var initColor = -1;
      while((initColor < hueMin) || (initColor > hueMax)){
        var rgb = palColor.getMax(),
            hsv = palColor.colorToObj(rgb);
        initColor = hsv.hue;
        console.log(hsv);
      }

      //Lighten up dark colors
      /*if(hsv.value < valMin){
        hsv.value = valMin;
      }
      else if(hsv.value > valMax){
        hsv.value = valMax;
      }
      /*var newRGB = HSV2RGB(hsv);
      var r = newRGB["r"],
          g = newRGB["g"],
          b = newRGB["b"];
      newRGB = r+","+g+","+b;*/
      palColor.appendColor(rgb);
      palColor.getComplement(rgb, num - 1);
    }
    else{
      console.debug("Done!");
      return false;
    }
  },
  getMax:function(){
    var maxProp = null,
        maxValue = -1;
    for (var prop in palColor.frequency) {
      if (palColor.frequency.hasOwnProperty(prop)) {
        var value = palColor.frequency[prop]
        if (value > maxValue) {
          maxProp = prop
          maxValue = value
        }
      }
    }
    delete palColor.frequency[maxProp];
    return maxProp;
  },
  colorToObj:function(color){
    var newColor = color.split(",");
    var colorObj = {};
    colorObj.r = newColor[0];
    colorObj.g = newColor[1];
    colorObj.b = newColor[2];
    var hsv = palColor.RGB2HSV(colorObj);
    return hsv;
  },
  appendColor:function(color){
    $(".palette").append("<span class='palette-item'></span>");
    $(".palette-item:last").css("background-color","rgb("+color+")");
  },
  RGB2HSV:function(rgb){
    var hsv = new Object();
    var max=palColor.max3(rgb.r,rgb.g,rgb.b);
    var dif=max-palColor.min3(rgb.r,rgb.g,rgb.b);
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
  },
  HSV2RGB:function(hsv){
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
  },
  min3:function(a,b,c){
    return (a<b)?((a<c)?a:c):((b<c)?b:c);
  },
  max3:function(a,b,c){
    return (a>b)?((a>c)?a:c):((b>c)?b:c); 
  }
}

palColor.init();