var currentTime = new Date();
var currentYear = currentTime.getFullYear();
var currentMonthZeroIndex = currentTime.getMonth();
var currentMonthOneIndex = currentMonthZeroIndex += 1;
var currentDate = currentTime.getDate();
const monthName = ["Januar", "Februar", "Mars", "April", "Mail", "Juni", "Juli", "August", "September", "Oktober", "November", "Desember"];

//liste med land for nedtrekkslista
const country_list = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua and Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Cape Verde","Cayman Islands","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Cote D Ivoire","Croatia","Cruise Ship","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyz Republic","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania","Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre and Miquelon","Samoa","San Marino","Satellite","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","St Kitts and Nevis","St Lucia","St Vincent","St. Lucia","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Turks and Caicos","Uganda","Ukraine","United Arab Emirates","United Kingdom","Uruguay","Uzbekistan","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];
//Løkke for å legge til land
for(var i= 0; i < country_list.length;i++) {
    var homeCountyOption = document.createElement('option');
    var workCountyOption = document.createElement('option');
    homeCountyOption.text = country_list[i]
    workCountyOption.text = country_list[i]
    homeCountyOption.value = country_list[i]
    workCountyOption.value = country_list[i]
    document.getElementById("homeCountySelect").appendChild(homeCountyOption);
    document.getElementById("workCountySelect").appendChild(workCountyOption);
}

//løkke for å legge til dag/måned/år i nedtrekksmlista
for (var i = 0; i <= 100; i++) {
    const aarOption = document.createElement('option');
    aarOption.text = currentYear - i;
    aarOption.value = currentYear - i;
    document.getElementById("fodselsAar").appendChild(aarOption);
    //Sjekker hvor mange dager det er i måneden
    if (i > 0 && i <= daysInMonth(currentMonthOneIndex, currentYear)) {
        const dagOption = document.createElement('option');
        dagOption.text = i;
        dagOption.value = i;
        document.getElementById("fodselsDag").appendChild(dagOption);
    }
    if (i < 12) {
        const maanedrOption = document.createElement('option');
        maanedrOption.text = monthName[i];
        maanedrOption.value = i;
        document.getElementById("fodselsMaaned").appendChild(maanedrOption);
    }
}

function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}
