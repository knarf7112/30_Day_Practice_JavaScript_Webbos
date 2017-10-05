
//1.頁面有四個按鈕倒數時間分別是20秒,5分,15分,20分,按鈕按下開始倒數計時並顯示於頁面
//2.頁面有兩個區塊,上方是倒數計時,下方是倒數計時完成的現在時間,title也是倒數計時
//3.右方input區塊可輸入數字或浮點數,按下enter後開始倒數計時
//四個按鈕內皆有放入記時須要的參數數字
const timerBtns = document.querySelectorAll('div.timer button');
const showCountdownTime = document.querySelector('.display__time-left');
const endTime = document.querySelector('.display__end-time');

const form = document.querySelector('#custom');
const input = document.querySelector('input[name="minutes"]');

let timer; //暫存目前timerID

//處理button的倒數計時
function handleBtnCountdown(e) {
    // 1.取得元素內的倒數時間
    const countdownTime = parseFloat(this.dataset.time);
    console.log(`點擊的倒數時間: ${countdownTime} second`);
    
    // 2.顯示倒數完成時間
    showFinishTime(countdownTime);

    // 3.開始倒數計時動作
    showTime(countdownTime);//立即顯示當下點的時間
    timer = startCountdown(timer, countdownTime - 1);// - 1 : 因為timer是一秒後才跑function,第一秒已在上面顯示了
}

//處理form的倒數計時
function handleFrmCountdown(e) {
    e.preventDefault(); // cancel form submit
    // 1.取得元素內的倒數時間
    const countdownTime = Math.floor(parseFloat(input.value, 10) * 60);
    console.log(`點擊的倒數時間: ${countdownTime} second`);
    
    // 2.顯示倒數完成時間
    showFinishTime(countdownTime);

    // 3.開始倒數計時動作
    showTime(countdownTime);//立即顯示當下點的時間
    timer = startCountdown(timer, countdownTime - 1);// - 1 : 因為timer是一秒後才跑function,第一秒已在上面顯示了
}

//開始倒數計時
function startCountdown(lastTimer, second){
    let leftSecond = second || 0; //取得剩餘秒數
    clearInterval(lastTimer);//清除上一次的倒數
    const timer = setInterval(()=>{
        if(leftSecond === 0){
            clearInterval(timer);
        }
        showTime(leftSecond);
        leftSecond--;
    },1000);
    return timer;
}

//顯示每次的到數時間(分:秒)
function showTime(leftSecond){
    const leftMinutes = Math.floor(leftSecond / 60); 
    const leftSeconds = leftSecond % 60;
    document.title = showCountdownTime.textContent = `${leftMinutes}:${leftSeconds.toString(10).padStart(2,'0')}`;
}

//顯示倒數完成時間(時:分)
function showFinishTime(countdownTime){
    const finishTime = new Date(Date.now() + (countdownTime * 1000));
    endTime.textContent = `Be Back At ${finishTime.getHours()}:${finishTime.getMinutes().toString().padStart(2, '0')}`;

}

timerBtns.forEach( timerBtn => timerBtn.addEventListener('click', handleBtnCountdown));

form.addEventListener('submit', handleFrmCountdown);
