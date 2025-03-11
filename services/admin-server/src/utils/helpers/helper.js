
const generateUniqueId = async (n) => {
    const length = Math.max(n, 8);
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 10);
    let uniqueId = timestamp + randomPart;
    return await uniqueId.substring(0, length);
};


const toCapital = (str) => {
    return str.toUpperCase();
};

const toTitleCase = (str) => {
    return str
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
};

export {
    generateUniqueId,
    toCapital,
    toTitleCase,
}