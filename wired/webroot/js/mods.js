window.onload = async function() {
    document.getElementById('restartNeeded').style.display = 'none';
    document.getElementById('showDuringVicRestart').style.display = 'none';

    var data = await GetCurrent('FreqChange');
    var radioButtons = document.getElementsByName("frequency");
    for(var i = 0; i < radioButtons.length; i++){
        if(radioButtons[i].value == data.freq){
            radioButtons[i].checked = true;
            break;
        }
    }

    data = await GetCurrent('RainbowLights');
    console.log(data.enabled)
    radioButtons = document.getElementsByName("rainbowlights");
    for(var i = 0; i < radioButtons.length; i++){
        if(radioButtons[i].value == JSON.stringify(data.enabled)){
            radioButtons[i].checked = true;
            break;
        }
    }
}

async function GetCurrent(mod) {
    let response = await fetch('/api/mods/current/' + mod);
    let data = await response.json();
    return data;
}

async function SendJSON(mod, json) {
    let response = await fetch('/api/mods/modify/' + mod, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: json,
    });
    let data = await response.json();
    return data;
}

async function FreqChange_Submit() {
    let freq = document.querySelector('input[name="frequency"]:checked').value;
    let data = await SendJSON('FreqChange', `{"freq":` + freq + `}`);
    console.log('Success:', data);
    CheckIfRestartNeeded("FreqChange");
}

async function RainbowLights_Submit() {
    let enabled = document.querySelector('input[name="rainbowlights"]:checked').value;
    let data = await SendJSON('RainbowLights', `{"enabled":` + enabled + `}`);
    console.log('Success:', data);
    CheckIfRestartNeeded("RainbowLights");
}

async function CheckIfRestartNeeded(mod) {
    let response = await fetch('/api/mods/needsrestart/' + mod, {
        method: 'POST',
    });
    let data = await response.text()
    if (data.includes("true")) {
        document.getElementById('restartNeeded').style.display = 'block';
    }
}

async function RestartVic() {
    document.getElementById("restartButton").disabled = true
    document.getElementById('showDuringVicRestart').style.display = 'block';
    document.getElementById('mods').style.display = 'none';
    fetch('/api/restartvic', {
        method: 'POST',
    }).then(response => {console.log(response); document.getElementById("restartButton").disabled = false; document.getElementById('restartNeeded').style.display = 'none'; document.getElementById('showDuringVicRestart').style.display = 'none'; document.getElementById('mods').style.display = 'block';})
}