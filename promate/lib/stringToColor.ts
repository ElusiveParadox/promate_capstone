

// function stringToColor(str: string) {
//     let hash = 0;
//     for (let i = 0; i<str.length; i++){
//         hash = str.charCodeAt(i)+((hash<<5)-hash)
//     }
//     const c = (hash & 0x00ffffff).toString(16).toUpperCase();
//   return "#" + "00000".substring(0, 6 - c.length) + c;
// }

// export default stringToColor

// -----------------------------------------------------------------------------------

function stringToColor(str: string | undefined | null) {
    if (!str) str = 'default';  // fallback to avoid undefined/null

    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00ffffff).toString(16).toUpperCase();
    return "#" + "000000".substring(0, 6 - c.length) + c;  // fixed padding length
}

export default stringToColor;


