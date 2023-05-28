export function stripSafe(value) {
    return value.replaceAll('<', '').replaceAll('>', '').replaceAll("'", '&#39;').replaceAll('"', '&#34;');
}
