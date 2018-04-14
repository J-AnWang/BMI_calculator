const height = document.querySelector('.height');
const weight = document.querySelector('.weight');
const submit = document.querySelector('.submit button');
const btnGroup = document.querySelector('.btn-group');
const reset = document.querySelector('.btn-group .reset');
const remove = document.querySelector('.btn-group .remove');
const result = document.querySelector('.result');
const reports = document.querySelector('.reports');


//Calculate the BMI value
function calBMI(e) {
    e.preventDefault();
    let storage = {};
    let heightValue = parseInt(height.value);
    let weightValue = parseInt(weight.value);
    if (isNaN(heightValue) || isNaN(weightValue)) {
        alert('Please enter the number.')
        return;
    }
    let bmiValue = parseFloat(weightValue / Math.pow((heightValue / 100), 2)).toFixed(2);
    let date = new Date();
    let today = `${date.getMonth()}-${date.getDate()}-${date.getFullYear()}`
    storage.BMI = bmiValue;
    storage.height = heightValue;
    storage.weight = weightValue;
    storage.date = today;
    changeBtnToResult(storage);
    saveDataToStorage(storage);
    showBtnGroup();
    renderData();
    height.value = '';
    weight.value = '';
}
// save the BMI data to loaclstorage
function saveDataToStorage(storage) {
    let storages = JSON.parse(localStorage.getItem('bmi'));
    if (storages === null) {
        storages = [];
    }
    storages.push(storage);
    storages = JSON.stringify(storages);
    localStorage.setItem('bmi', storages);
}
// remove the date storage in the localstorage
function deleteAllData() {
    if (confirm('Are you sure to delete all of the data?')) {
        localStorage.removeItem('bmi');
        resetInput();
        renderData();
        alert('The data were deleted successfully!');
    } else {
        return;
    }
}
// Show the reset and remove button
function showBtnGroup() {
    btnGroup.classList.add('show');
}
// Reset the input form, button group and result graphic
function resetInput() {
    btnGroup.classList.remove('show');
    submit.parentNode.classList.remove('hide');
    result.parentNode.classList.remove('show');
}
// Render the result graphic on submit place and remove the submit button
function changeBtnToResult(storage) {
    let [color, text] = determineColor(storage.BMI);
    submit.parentNode.classList.add('hide');
    result.parentNode.classList.add('show');
    if (result.classList.item(1) !== null) {
        result.classList.remove(`${result.classList.item(1)}`);
    }
    result.classList.add(color);
    let resultData = `
    <p class="num">${storage.BMI}</p>
    <p class="bmi">BMI</p>
    <p class="text">${text}</p>
    <img src="imgs/icons_loop.png" alt="loop">
    `
    result.innerHTML = resultData;
}
// To determine color and text
function determineColor(bmi) {
    let bmi2Float = parseFloat(bmi);
    if (bmi2Float < 18.5) {
        return ['under', '過輕'];
    } else if (bmi2Float >= 18.5 && bmi2Float < 24) {
        return ['ideal', '理想'];
    } else if (bmi2Float >= 24 && bmi2Float < 27) {
        return ['over', '過重'];
    } else if (bmi2Float >= 27 && bmi2Float < 30) {
        return ['moderate', '輕度肥胖'];
    } else if (bmi2Float >= 30 && bmi2Float < 35) {
        return ['moderate', '中度肥胖'];
    } else if (bmi2Float >= 35) {
        return ['severe', '重度肥胖'];
    }
}

// Render data on content place
function renderData() {
    let data = '';
    let storages = JSON.parse(localStorage.getItem('bmi'));
    if (storages === null) {
        reports.innerHTML = '';
        return;
    }
    for (let i = 0; i < storages.length; i++) {
        let [color, text] = determineColor(storages[i].BMI);
        let report = `
        <div class="report ${color}">
            <span>${text}</span>
            <span>BMI
                <span>${storages[i].BMI}</span>
            </span>
            <span>weight
                <span>${storages[i].weight}kg</span>
            </span>
            <span>height
                <span>${storages[i].height}cm</span>
            </span>
            <span>
                ${storages[i].date}
            </span>
        </div>
        `;
        data += report;
    }
    reports.innerHTML = data;
}

// Event Listener
window.addEventListener('load', renderData);
height.addEventListener('keyup', function (e) {
    if (e.keyCode === 13) {
        calBMI(e);
    }
});
weight.addEventListener('keyup', function (e) {
    if (e.keyCode === 13) {
        calBMI(e);
    }
});
submit.addEventListener('click', calBMI);
remove.addEventListener('click', deleteAllData);
reset.addEventListener('click', resetInput);