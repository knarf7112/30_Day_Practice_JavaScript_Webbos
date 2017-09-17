const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');
const width = video.videoWidth;
const height = video.videoHeight;
//canvas.width = width;
//canvas.height = height;

function getVideo(){
    navigator.mediaDevices.getUserMedia({ video: true, audio: false})
        .then(localMediaStream => {
            console.log(localMediaStream);
            video.src = window.URL.createObjectURL(localMediaStream);
            video.play();
        })
        .catch( err => {
            console.error('OH NO !!!',err);
            //暫時的備用方案
            console.log('直接使用某個來源影音當作來源video');
            video.crossOrigin = 'anonymous'; //因為影音來源非同源,所以video 加上crossorigin="anonymous"才能讓影音被截圖且必須在影音被載入前設定crossOrigin屬性
            video.src = 'https://player.vimeo.com/external/194837908.sd.mp4?s=c350076905b78c67f74d7ee39fdb4fef01d12420&profile_id=164';
            video.volume = 0; //先關閉音量
            video.play();
        })
}

function paintToCanvas(){
    const width = video.videoWidth;//有video時才有的屬性值
    const height = video.videoHeight;
    console.log(width, height);
    canvas.width = width;
    canvas.height = height;

    //return timer id to stop it
    return setInterval( () => {
        // 1. 將影音畫上去
        ctx.drawImage(video, 0, 0, width, height);

        // 2. take the pixels out
        let pixels = ctx.getImageData(0, 0, width, height);
        //console.log(pixels);
        //debugger;

        // 3. mess with them(產生紅色的特效)
        //pixels = redEffect(pixels);
        //pixels = rgbSplit(pixels);
        pixels = greenScreen(pixels);


        // 4. put them back
        ctx.putImageData(pixels, 0, 0);
    }, 16);
}

function takePhoto() {
    // 1.產生類似相機的"喀嚓"的音效
    snap.currentTime = 0;
    snap.play();

    // 2.將當前的畫面產生截圖 (take the dat out of the canvas)
    const data = canvas.toDataURL('image/jpeg');
    //console.log(data); //base64 string
    
    // 3.建立一個超連結來下載截圖
    const link = document.createElement('a');
    link.href = data; 
    link.setAttribute('download', 'handsome'); //下載檔的檔名
    link.textContent = 'Download Image';
    link.innerHTML = `<img src="${data}" alt="picture" />`
    strip.insertBefore(link, strip.firstChild); //插入到第一個children之前(最後點擊的截圖放第一個)
}

//變更RGBA色調
function redEffect(pixels){
    //每次+4 因為RGBA每4個一組,
    for(let i = 0; i < pixels.data.length; i+=4 ){
        pixels.data[i + 0] = pixels.data[i + 0] + 100 ;  // RED
        pixels.data[i + 1] = pixels.data[i + 1] - 50;    // GREEN
        pixels.data[i + 2] = pixels.data[i + 2] * 0.5;   // BLUE
    }
    return pixels;
}

//鬼影效果 : 圖學的知識 (不懂),感覺是將RGB色調做錯位
function rgbSplit(pixels){
    for(let i = 0; i < pixels.data.length; i+=4){
        pixels.data[i - 150] = pixels.data[i + 0];  // RED
        pixels.data[i + 300] = pixels.data[i + 1];  // GREEN
        pixels.data[i - 350] = pixels.data[i + 2];  // BLUE
    }
    ctx.globalAlpha = 0.8;
    return pixels;
}

function greenScreen(pixels){
    const levels = {};

    //將畫面上的input元素value值都設定到levels物件上
    document.querySelectorAll('.rgb input').forEach( (input) => {
        levels[input.name] = input.value;
    });
    //console.log(levels);
    for(let i = 0; i < pixels.data.length; i += 4){
        let red = pixels.data[i + 0];
        let green = pixels.data[i + 1];
        let blue = pixels.data[i + 2];
        let alpha = pixels.data[i + 3];

        if(red >= levels.rmin
           && green >= levels.gmin
           && blue >= levels.bmin
           && red <= levels.rmax
           && green <= levels.gmax
           && blue <= levels.bmax){
               //take it out
               pixels.data[i + 3] = 0; //超過範圍就把透明度設為透明
        }
    }

    return pixels;
}

getVideo();


video.addEventListener('canplay', paintToCanvas); //event occurs when the browser can start playing the specified audio/video(when it has buffered enough to begin)
/*
其它的載入事件與順序
1.loadstart      : when browser starts looking for the specified audio/video.(this is when the loading process starts)
2.progress       : when browser is downloading the specified audio/video
3.durationchange : when the duration data of the specified audio/video is changed.(當影音被載入duration屬性值會從'NaN'變成真實影音的duration值)
4.loadedmetadata : when meta data for the specified audio/video has been loaded.(audio/video 的 meta data組成: duration, dimesions(video only), text tracks(就是字幕檔))
5.loadeddata     : when data for the current frame is loaded, but not enough data to play next frame of the specified audio/video(當目前frame已載入資料,但下一回frame的資料量不足時)
6.canplay        : when browser can start playing the specified audio/video(當buffer足夠且可以開始播放)
7.canplaythrough : when browser estimates it can play through the specified audio/video without having to stop for buffering.(當遊覽器預估能夠在不停下來進行緩衝的情況下,持續播放影音時,會發生canplaythrough事件)
*/