export function generateDate(year, month, day) {
    var date = new Date(year, month - 1, day);
    return date.toLocaleDateString();
}
