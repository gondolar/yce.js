function    reloadPage      ()      { location.reload(); }
function    htmlSetText     (element_id, text_content)      { document.getElementById(element_id).textContent = text_content; }

//Math.floor(Date.now() / 1000)
//fetch("https://worldtimeapi.org/api/ip")
//  .then(res => res.json())
//  .then(data => {
//    const epochSeconds = Math.floor(new Date(data.utc_datetime).getTime() / 1000);
//    console.log(epochSeconds);
//  });

const       RELOAD_SECONDS      = 60;
let         SYSTEM_EPOCH_MS    = SYSTEM_EPOCH * 1000;
function    updateClocks    () {
    SYSTEM_UPTIME          += 1;
    SYSTEM_EPOCH_MS    += 1000;
    SYSTEM_EPOCH       = SYSTEM_EPOCH_MS * .001;

    const   date        = new Date(SYSTEM_EPOCH_MS);
    document.getElementById('main_frame_calendar').textContent = `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()}`;
    document.getElementById('main_frame_clock'   ).textContent = `${date.getUTCHours()}:${date.getUTCMinutes()}:${date.getUTCSeconds()}`;

    const   seconds     = Math.floor(SYSTEM_UPTIME % 60);
    const   minutes     = Math.floor((SYSTEM_UPTIME % (60 * 60)) / 60);
    const   hours       = Math.floor((SYSTEM_UPTIME % (60 * 60 * 24)) / (60 * 60));
    const   days        = Math.floor(SYSTEM_UPTIME / (60 * 60 * 24));
    const   stringSec   = seconds.toString().padStart(2, '0');
    const   stringMin   = minutes.toString().padStart(2, '0');
    document.getElementById('system_uptime').innerHTML
        = "System Uptime:<br/>" + (days ? days.toString() + ' day' + ((1 == days) ? '' : 's') : '') +
            ( hours   ? `${hours}:${stringMin}:${stringSec} hour${(1 == hours) ? '' : 's'}`
            : minutes ? `${minutes}:${stringSec} minute${(1 == minutes) ? '' : 's'}`
            : `${seconds} second${(1 == seconds) ? '' : 's'}`
            );
}

function clockUpdateTime    (elapsedMsec)                   { SYSTEM_TIME += elapsedMsec; SYSTEM_UPTIME += elapsedMsec; }
function clockUpdateText    ()                              {
    const jsDate = new Date(SYSTEM_TIME);
    htmlSetText('system_date', jsDateToYMD(jsDate));
    htmlSetText('system_time', jsDateToHMS(jsDate));
    htmlSetText('system_uptime', deltaToText(secondsToDHMS(SYSTEM_UPTIME * .001)));
}
function updateClocksTime   () {
    clockUpdateTime();
    clockUpdateText();
}

function initPage           () {
    setInterval(updateClocksTime, 1000);
    setInterval(reloadPage, RELOAD_SECONDS * 1000);
    updateClocksTime();  // Initial call to set the clock
}