export default function getLocalStorageData(key) {
    return JSON.parse(localStorage.getItem(key));
}