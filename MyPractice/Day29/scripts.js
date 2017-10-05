let countdown; //暫存目前的timer id
const timerDisplay = document.querySelector('.display__time-left');
const endTime = document.querySelector('.display__end-time');
const buttons = document.querySelectorAll('[data-time]');


function timer(seconds){
    //8.清除所有已存在的timer,因為畫面的刷新只給一個timer去負責,多個timer輪流刷畫面會很亂
    clearInterval(countdown);

    //1.在iOS手機上使用setInterval方法會有問題.
    //當使用者滾動手機時,所有timer都會暫停,如果使用--則會與真實時間有差距,當然這個現象可能是設計上使其滾動更平順的考量
    /*
    setInterval( function(){
        seconds--;
    }, 1000);
    */

    //2.使用另一個方法來計時,直接在計時器內每次抓取目前時間與一開始就算好的總時間相減即可獲得目前剩餘時間
    const now = Date.now(); //目前的時間
    const then = now + seconds * 1000; //倒數計時完成的時間
    //console.log({now, then});

    //5.一開始就執行方法來刷新最初的剩餘時間
    displayTimeLeft(seconds);
    displayEndTime(then);

    // 3.執行方法必需等到時間到才會執行,所以會少了最初第一次立即執行的動作
    countdown = setInterval(()=>{
        const secondsLeft = Math.round((then - Date.now()) / 1000); // 取得目前剩餘秒數, 當timer被延遲執行還是能準確取得剩餘時間

        // check if we should stop it
        if(secondsLeft < 0){
            clearInterval(countdown);
            return;
        }

        //display it
        displayTimeLeft(secondsLeft);
    }, 1000);
}

//4.所以建立一個方法用來顯示剩餘時間
function displayTimeLeft(seconds){
    //console.log(seconds);
    const minutes = Math.floor(seconds / 60);
    const remainderSeconds = seconds % 60;
    const display = `${minutes}:${remainderSeconds < 10 ? '0': ''}${remainderSeconds}`;
    document.title = display;
    timerDisplay.textContent = display;
}

//6.建立一個方法顯示倒數計時的完成時間
function displayEndTime(timestamp){
    const end = new Date(timestamp);
    const hour = end.getHours();
    const adjustedHour = hour > 12 ? hour - 12: hour;//保持12小時制
    const minutes = end.getMinutes();
    endTime.textContent = `By Back At ${adjustedHour}:${minutes < 10 ? '0': ''}${minutes}`;
}

//7.設定啟動到數的方法給button
function startTimer(){
    const seconds = parseInt(this.dataset.time);
    timer(seconds);
}
buttons.forEach( button => button.addEventListener('click', startTimer));
document.customForm.addEventListener('submit', function(e){
    e.preventDefault();
    const mins = this.minutes.value; //取得name=minutes的元素內的value  : form 可以直接取的其name的元素 
    timer(mins * 60);
    this.reset();// reset所有input
});