(function() {
  var video = document.querySelector('#video');
  var canvas = document.querySelector('canvas');
  var ctx = canvas.getContext('2d');
  var localMediaStream = null;
  var socket = io();
  var snapshot = function() {
    if (localMediaStream) {
      ctx.drawImage(video, 0, 0,100,100);
      var img = canvas.toDataURL('image/webp');
      var blob = BinaryUtil.base64ToBinary(img);
      socket.emit("image", blob);
    }
  };
  socket.on("image", function(data){
    var buf = BinaryUtil.binaryToBase64(data.blob);
    if ($('#'+data.id).size() == 0) {
      $("#body").append('<img id="'+ data.id +'" />');
    }
    $('#'+data.id).attr("src", 'data:image/webp;' + buf);
  });
  socket.on("leave", function(data){
    $('#'+data.id).remove();
  });
  video.addEventListener('timeupdate', function(e){
    snapshot();
  });
  UserMedia.check();
  UserMedia.onSuccess = function(stream) {
    video.src = window.URL.createObjectURL(stream);
    localMediaStream = stream;
    snapshot();
  };
  UserMedia.onError = function(e) {
    console.log("Error ", e);
  };
  UserMedia.play();
}());
