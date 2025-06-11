function ssidComboBoxUpdate(key, key_text) {
    let comboBox    = document.getElementById(key);
    let inputField  = document.getElementById(key_text);
    if (comboBox.selectedIndex) {
        inputField.style.display = 'none';
        comboBox.style.display = 'block';
        return comboBox.selectedIndex;
    } 
    inputField.style.display = 'block';
    comboBox.style.display = 'none';
    inputField.focus();
    return comboBox.selectedIndex;
}
function ssidOptionUpdate       (key_text, custom_key) {
    let     optionSelected      = document.getElementById(custom_key);
    let     inputField          = document.getElementById(key_text);
    optionSelected.value        = inputField.value;
    optionSelected.textContent  = inputField.value;
}
function ipToArray(value)  {
    if (Array.isArray(value) && value.length == 4)
        return value.map(v => (typeof v == "number") ? v : parseInt(v));
    if (typeof value != 'string') 
        return [NaN,NaN,NaN,NaN];
    value   = value.split('.');
    for (let i = 0; i < Math.min(value.length, 4); ++i)
        value[i]   = parseInt(value[i]);
    for(let i = 0; i < (4 - value.length); ++i)
        value.push(NaN);
    return value;
}
function htmlInputForBool      (key, value, attrs) { return `<input name="${key}" ${attrs}type="checkbox" ${value ? "checked " : ""}/>`; }
function htmlInputForNumber    (key, value, attrs) { return `<input name="${key}" ${attrs}type="number"    value="${value}" />`; }
function htmlInputForString    (key, value, attrs) { return `<input name="${key}" ${attrs}type="input"     value="${value}" />`; }
function htmlInputForPassword  (key, value, attrs) { return `<input name="${key}" ${attrs}type="password"  value="${value}" />`; }
function htmlInputForIP        (key, value, attrs) {
    let ip      = ipToArray(value);
    let fields  = "";
    for (let i = 0; i < 4; i++)
        fields += htmlInputForNumber(`${key}_${i}`, ip[i], attrs + `style="width:50px;" min="0" max="255" maxlength="3" `);
    return fields;
}
function fetchJson              (address, onThen, onCatch = null) {
    return fetch(address)
        .then(function(response) {
            if (false == response.ok) 
                throw new Error('Network response:' + response.status + response.statusText);
            return response.json(); // or response.text() for plain text
        })  
        .then   (onThen ? onThen : function(data) { console.log(data); return data; })
        .catch  (onCatch ? onCatch : function(error) { console.error('There was a problem with the fetch operation:', error); });
}
function htmlOptions        (values, attrs)     { let options = ''; values.array.forEach(value => options += `<option ${attrs}value="${value}" >${value}</option>`); return options; }
function htmlInputForSSID   (key, value, attrs) {
    let fields = ``;
    fields += `<select id="${key}" ${attrs}name="${key}" onchange="ssidComboBoxUpdate('${key}', '${key}_text')" onblur="ssidOptionUpdate('${key}_text', 'custom_${key}');let comboBox=document.getElementById('${key}');if(comboBox.selectedIndex){let inputField=document.getElementById('${key}_text');inputField.style.display='none';comboBox.style.display='block';}" onchange="updateCustomSSID('${key}_text', 'custom_${key}'); ">`;
    fields += `<option id="custom_${key}" value="${value}" >Custom SSID...</option>`;
    fields += `<option selected value="${value}" >${value}</option>`;
    fields += `</select>`;
    fields += `<input type="text" id="${key}_text" value="${value}" style="display: none;" placeholder="Enter a custom SSID" >`;
    function fetchAndGenerateOptions(address) {
        fetchJson("/api/" + address, response => document.getElementById(key).innerHTML += htmlOptions(response, `style="width:50px;" `));
    }
    fetchAndGenerateOptions("ssid_seen");
    return fields;
}
function isIPAddress(key, ip_key_names) {
    for (const ipKey of ip_key_names)
        if (key === ipKey) 
            return true;
    return false;
}
function htmlInputForField(key, value, attrs, ip_key_names) {
    return  isIPAddress(key, ip_key_names)  ? htmlInputForIP        (key, value, attrs)
        :   ("sta_ssid" == key)             ? htmlInputForSSID      (key, value, attrs)
        :   (typeof value === 'boolean')    ? htmlInputForBool      (key, value, attrs)
        :   (typeof value === 'number')     ? htmlInputForNumber    (key, value, attrs + `style="width:100%;" `)
        :   key.includes("password")        ? htmlInputForPassword  (key, value, attrs + `style="width:100%;" `)
                                            : htmlInputForString    (key, value, attrs + `style="width:100%;" `)
        ;
}
function filterWord(keyName, token, labelText) {
    if(keyName == token) 
        return keyName.replace(token, labelText);
    let result        = keyName.replace('_' + token + '_', '_' + labelText + '_');
    let checktoken    = token + '_';
    let checklabel    = labelText + '_';
    while(result.startsWith(checktoken)) 
        result = result.replace(checktoken, checklabel);
    checktoken    = '_' + token;
    checklabel    = '_' + labelText;
    while(result.endsWith(checktoken)) 
        result = result.replace(checktoken, checklabel);
    return result;
}
function keyToName(keyName, wordsToFilter) {
    for(let token in wordsToFilter) {
       if (wordsToFilter.hasOwnProperty(token))
            keyName = filterWord(keyName, token, wordsToFilter[token])
    }
    while(keyName.includes('_'))
        keyName = keyName.replace('_', ' ');
    return keyName.charAt(0).toUpperCase() + keyName.slice(1);
}
function htmlFormFromJson(doc, disabled, nameMap, ip_key_names) {
    console.log(doc); 
    let right = false;
    finalString = "";
    const documentRoot = doc;
    for (const key in documentRoot) {
        if (false == documentRoot.hasOwnProperty(key)) 
            continue;
        const value = documentRoot[key];
        fieldName = keyToName(key, nameMap);
        if (!right)
            finalString += `<tr style="height:24px;">`;
        finalString += `<td>${fieldName}</td>`;
        finalString += "<td>";
        finalString += htmlInputForField(key, value, disabled ? "disabled " : "", ip_key_names);
        finalString += "</td>";
        finalString += right ? "</tr>": '<td style="width:10px;"></td>';
        right = !right;
    }
    if (right)
        finalString += "<td></td></tr>";
    if (disabled)
        finalString += `<tr style="height:24px;"><td colspan=\"5\"><input type=submit value=\"Save changes\"></input></td></tr>`;
    finalString += "<tr><td colspan=\"5\"></td></tr>";
    return finalString
}
const KEY_NAME_MAP = 
    { i2c_address   : 'I2C address of'
    , sd_card       : 'SD Card Reader'
    , mainboard     : 'Mainboard'
    , battery       : 'Battery'
    , gateway       : 'Gateway'
    , iridium       : 'Iridium'
    , lorawan       : 'LoRaWAN'
    , netmask       : 'Netmask'
    , pca           : 'PCA --'
    , tca           : 'TCA --'
    , swarm         : 'Swarm'
    , dhcp          : 'DHCP'
    , http          : 'HTTP'
    , lora          : 'LoRa'
    , ssid          : 'SSID'
    , vbat          : 'vBat'
    , wifi          : 'WiFi'
    , adc           : 'ADC'
    , ads           : 'ADS'
    , ble           : 'BLE'
    , cpu           : 'CPU'
    , dns           : 'DNS'
    , gps           : 'GPS'
    , i2c           : 'I2C'
    , imu           : 'IMU'
    , iot           : 'IoT'
    , isr           : 'ISR'
    , ntp           : 'NTP'
    , sta           : 'STA'
    , udp           : 'UDP'
    , ap            : 'AP'
    , id            : 'ID'
    , ip            : 'IP'
    , rx            : 'RX'
    , tx            : 'TX'
    };
function fetchAndGenerate(address, disabled, ip_key_names) {
    fetch("/json/" + address)
        .then(function (response) {
            if (response.ok) 
                return response.json(); // or response.text() for plain text
            throw new Error('Network response was not ok:' + response.status + response.statusText);
        })
        .then(function (data) { document.getElementById("form_container").innerHTML = htmlFormFromJson(data, disabled, KEY_NAME_MAP, ip_key_names); })
        .catch(function (error) { console.error('There was a problem with the fetch operation:', error); });
}

function initPage(address, disabled, ip_key_names) { fetchAndGenerate(address, disabled, ip_key_names); }
