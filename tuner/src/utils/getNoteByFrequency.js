const noteName = ['C','C#','D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

function getNoteByFrequency(frequency) {
    return Math.round(12 * Math.log(frequency / 440) / Math.LN2) + 57;
} 

function getNoteString(noteNum) {
    return noteName[noteNum % 12] + Math.floor(noteNum / 12);
}

function getFrequencyByNote(noteNum) {
    return 440 * Math.pow(2, (noteNum - 57) / 12);
}

function getNotesRangeByNote(noteNum) {
    const RANGE_LEN = 3;
    let range = [];
    for (let i = -RANGE_LEN; i <= RANGE_LEN; i++) {
        range.push(getNoteString(noteNum + i));
    }
    return range;
}

export {
    getNoteByFrequency,
    getNoteString,
    getFrequencyByNote,
    getNotesRangeByNote
}
