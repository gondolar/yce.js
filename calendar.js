function updateClocks       () {
    NLC_UPTIME          += 1;
    NLC_UNIX_TIME_MS    += 1000;
    NLC_UNIX_TIME       = NLC_UNIX_TIME_MS * .001;

    const   date        = new Date(NLC_UNIX_TIME_MS);
    document.getElementById('nlc_calendar').textContent = `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()}`;

    const   utcStringSec   = date.getUTCSeconds().toString().padStart(2, '0');
    const   utcStringMin   = date.getUTCMinutes().toString().padStart(2, '0');
    document.getElementById('nlc_clock'   ).textContent = `${date.getUTCHours()}:${utcStringMin}:${utcStringSec}`;

    const   seconds     = Math.floor(NLC_UPTIME % 60);
    const   minutes     = Math.floor((NLC_UPTIME % (60 * 60)) / 60);
    const   hours       = Math.floor((NLC_UPTIME % (60 * 60 * 24)) / (60 * 60));
    const   days        = Math.floor(NLC_UPTIME / (60 * 60 * 24));
    const   stringSec   = seconds.toString().padStart(2, '0');
    const   stringMin   = minutes.toString().padStart(2, '0');
    document.getElementById('nlc_uptime').innerHTML
        = "Uptime:<br/>" + (days ? days.toString() + ' day' + ((1 == days) ? '' : 's') : '') +
            ( hours   ? `${hours}:${stringMin}:${stringSec} hour${(1 == hours && 0 == minutes && 0 == seconds) ? '' : 's'}`
            : minutes ? `${minutes}:${stringSec} minute${(1 == minutes && 0 == seconds) ? '' : 's'}`
            : `${seconds} second${(1 == seconds) ? '' : 's'}`
            );
}
