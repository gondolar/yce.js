function plural             (count)                             { return (1 == count) ? '' : 's'; }
function any2str            (value)                             { return ('string' == typeof(value)) ? value : value.toString(); }
function padInt             (valueToPad, desiredWidth, padChar) { return any2str(valueToPad).padStart(desiredWidth, padChar); }
function secondsToDHMS      (elapsedSeconds)                    {
    const   SECS_PER_MINUTE = 60;
    const   SECS_PER_HOUR   = 60 * SECS_PER_MINUTE;
    const   SECS_PER_DAY    = 24 * SECS_PER_HOUR  ;
    const   result          = 
        { days     : Math.floor(elapsedSeconds / SECS_PER_DAY)
        , hours    : Math.floor((elapsedSeconds % SECS_PER_DAY ) / SECS_PER_HOUR)
        , minutes  : Math.floor((elapsedSeconds % SECS_PER_HOUR) / SECS_PER_MINUTE)
        , seconds  : Math.floor(elapsedSeconds % SECS_PER_MINUTE)
        };
    return result;
}
function millisToDHMSS      (elapsedMillisecs)      { return {...secondsToDHMS(elapsedMillisecs / 1000), milliseconds: Math.floor(elapsedMillisecs % 1000)}; }
function jsDateToYMD        (jsDate)                { return `${jsDate.getUTCFullYear()}-${jsDate.getUTCMonth() + 1}-${jsDate.getUTCDate()}`; }
function jsDateToHMS        (jsDate)                { return `${jsDate.getUTCHours()}:${jsDate.getUTCMinutes()}:${jsDate.getUTCSeconds()}`; }
function hmsToText          (h, m, s, ms, postfix)  {
    const sminutes = padInt(m, 2, '0') + ':';
    const sseconds = padInt(s, 2, '0');
    const smilisec = ms ? '.' + padInt(ms, 2, '0') : '';
    return h ? `${h}:${sminutes}${sseconds}` + smilisec + (postfix ? ` hour${  plural(h)}` : '')
        :  m ? `${sminutes}${sseconds}`      + smilisec + (postfix ? ` minute${plural(m)}` : '')
        : `${sseconds}`                      + smilisec + (postfix ? ` second${plural(s)}` : '')
        ;
}
function dhmsToText         (days, hours, minutes, seconds) { return days ? days + ' day' + plural(days) : '' + hmsToText(hours, minutes, seconds, true); }
function deltaToText        (t)                             { return dhmsToText(t.days, t.hours, t.minutes, t.seconds); }
