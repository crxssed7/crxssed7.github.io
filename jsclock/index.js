let interval = window.setInterval(function(){
    // Change the time
    let d = new Date()
    
    let hour = d.getHours()
    document.getElementById("hour").innerHTML = (hour < 10) ? "0" + hour : hour

    let minute = d.getMinutes()
    document.getElementById("minute").innerHTML = (minute < 10) ? "0" + minute : minute

    let seconds = d.getSeconds()
    document.getElementById("second").innerHTML = (seconds < 10) ? "0" + seconds : seconds

}, 1000)