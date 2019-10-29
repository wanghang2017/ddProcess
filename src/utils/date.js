export function formatDate(date) {
    let month = date.getMonth() + 1;
    let day = date.getDate()
    // console.log(month,day);
    // console.log(date.());
    return date.getFullYear() + "-" + (month >= 10 ? month : ("0" + month)) + "-" + (day >= 10 ? day : ("0" + day));
}