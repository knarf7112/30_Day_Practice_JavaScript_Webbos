/* Get our element */
const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');
const fullScreenBtn = player.querySelector('#fullScreen');

/* Build out functions */
function togglePlay(){
    video[video.paused ? 'play': 'pause']();
}

function updateButton(e){
    const icon = this.paused ? '►': '❚ ❚';
    toggle.textContent = icon;
    console.log(icon);
}

function skip(){
    console.log('skip !!', this.dataset); // get data-skip attribute
    video.currentTime += parseFloat(this.dataset.skip);
}

function handleRangeUpdate(){
    console.log('range update', this.name, this.value);
    video[this.name] = this.value;
}

function handleProgress(){ 
    const percent = Math.floor((video.currentTime / video.duration) * 100);
    progressBar.style.flexBasis = `${percent}%`;
    console.log('current percent', percent);
}

function scrub(e){
    console.log(`mouse event:${e.type}`, e.offsetX, progress.offsetWidth);
    const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
    video.currentTime = scrubTime;
}

function toggleFullScreen(){
    console.log('have any fullscreen element ?',document.webkitFullscreenElement);
    if(document.webkitFullscreenElement){
        video.webkitExitFullscreen();
    }
    else{
        //video.controls
        video.webkitRequestFullscreen();
    }
}

/* Hook up the event listener */
video.addEventListener('click',togglePlay); //點擊畫面上的video時,也可以觸發
video.addEventListener('click', updateButton);
//video.addEventListener('pause',updateButton);

toggle.addEventListener('click', togglePlay);//點擊下列的play/pause鍵進行播放/暫停
skipButtons.forEach(skipButton=>skipButton.addEventListener('click', skip));

ranges.forEach(range=>range.addEventListener('change', handleRangeUpdate));
ranges.forEach(range=>range.addEventListener('mousemove', handleRangeUpdate));

video.addEventListener('timeupdate', handleProgress);
progress.addEventListener('click', scrub);

let mousedown = false;
progress.addEventListener('mousedown', ()=>mousedown = true);
progress.addEventListener('mouseup', ()=>mousedown = false);
progress.addEventListener('mousemove', e=>mousedown && scrub(e));

fullScreenBtn.addEventListener('click', toggleFullScreen);
