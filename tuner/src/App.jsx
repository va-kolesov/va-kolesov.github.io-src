import React from 'react';
import Tuner from './components/Tuner.jsx';
import './styles.scss';
import './variables.scss';
import { getNoteByFrequency,
    getNoteString,
    getFrequencyByNote } from './utils/getNoteByFrequency.js';

import TunerButton from './components/TunerButton.jsx';
import EditButton from './components/EditButton.jsx';
import NoteChooser from './components/NoteChooser.jsx';

const menuItems = [
    {title: 'Standart'},
    {title: 'Drop C'},
    {title: 'Drop D'},
    {title: 'Open C'},
    {title: 'DADGAD'},
    {title: 'Double Drop D'},
    {title: 'Open G'},
    {title: 'Custom'}
]
const tunings = {
    'Standart': ['E4', 'B3', 'G3', 'D3', 'A2', 'E2'],
    'Drop C' : ['D4', 'A3', 'F3', 'C3', 'G2', 'C2'],
    'Drop D' : ['E4', 'B3', 'G3', 'D3', 'A2', 'D2'],
    'Open C' : ['E4', 'C4', 'G3', 'C3', 'G2', 'C2'],
    'DADGAD' : ['D4', 'A3', 'G3', 'D3', 'A2', 'D2'],
    'Double Drop D' : ['D4', 'B3', 'G3', 'D3', 'A2', 'D2'],
    'Open G' : ['D4', 'B3', 'G3', 'D3', 'G2', 'D2'],
    'Custom' : ['E4', 'B3', 'G3', 'D3', 'A2', 'E2']
}
const AUDIO_SETTINGS = {
    noiseSuppression: true,
    echoCancellation: false
}
const THRESHOLD = .09;
const FFT_SIZE = 4096;

function error() {
    alert('Stream generation failed.');
}

function getFrequency(buf, buflen, sampleRate) {
    let minN = 1;
    let minS = 1000;
    for (let n = 2; n < buflen / 2; n++) {
        let s = 0;
        for (let x = 0; x < buflen / 2; x++) {
            s += Math.abs(buf[x] - buf[x + n]);
        }
        if (s < minS) {
            minN = n;
            minS = s;
        }
    }
    return Math.round(sampleRate / minN);
}

function difference(frequency, noteNum) {
    return 12 * Math.log(frequency / getFrequencyByNote(noteNum)) / Math.LN2;
}

function getMaxValue(inp) {
    let maxValue = 0;
    for (let i = 0; i < inp.length; i++) {
        maxValue = maxValue < Math.abs(inp[i]) ? Math.abs(inp[i]) : maxValue;
    }
    return maxValue;
}

function isNoteInBounds(note) {
    return note < 71 && note > 24;
}
export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            note: null, 
            noteNum: null, 
            frequency: null, 
            difference: null,
            selectedTuning: 'Standart',
            customTuning: ['E4', 'B3', 'G3', 'D3', 'A2', 'E2']
        };
        this.initialize();
    }
    
    update() {
        let buflen = this.analyser.frequencyBinCount;
        let buf = new Float32Array(buflen);
        this.analyser.getFloatTimeDomainData(buf);
        let maxValue =  getMaxValue(buf);
        if (maxValue > THRESHOLD) {
            if (this._resetTimeout) {
                clearTimeout(this._resetTimeout);
                this._resetTimeout = null;
            }
            let frequency = getFrequency(buf, buflen, this._sampleRate);
            if (!frequency) {
                if (!this._resetTimeout) {
                    this._resetTimeout = setTimeout(() => {
                        this.setState({
                            note: null, 
                            noteNum: null, 
                            frequency: null, 
                            difference: null
                        });
                    }, 1500);
                }
            } else {
                let noteNum = getNoteByFrequency(frequency);
                let note = getNoteString(noteNum);
                let diff = difference(frequency, noteNum);
                if(isNoteInBounds(noteNum)) {
                    this.setState({
                        note: note, 
                        noteNum: noteNum, 
                        frequency: frequency, 
                        difference: diff
                    });
                } else {
                    if (!this._resetTimeout) {
                        this._resetTimeout = setTimeout(() => {
                            this.setState({
                                note: null, 
                                noteNum: null, 
                                frequency: null, 
                                difference: null
                            });
                        }, 1500);
                    }
                }
            }
        } else {
            if (!this._resetTimeout) {
                this._resetTimeout = setTimeout(() => {
                    this.setState({
                        note: null, 
                        noteNum: null, 
                        frequency: null, 
                        difference: null
                    });
                }, 1500);
            }
        }
        setTimeout(this.update.bind(this), 50);
    }

    getUserMedia(dictionary, callback) {
        try {
            navigator.getUserMedia = 
                navigator.getUserMedia ||
                navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia;
            navigator.getUserMedia(dictionary, callback, error);
        } catch (e) {
            alert('Не удалось получить доступ к микрофону');
        }
    }

    gotStream(stream) {
        let audioContext = new AudioContext();
        this._sampleRate = audioContext.sampleRate;
        let mediaStreamSource = audioContext.createMediaStreamSource(stream);
    
        this.analyser = audioContext.createAnalyser();
        this.analyser.fftSize = FFT_SIZE;
        mediaStreamSource.connect( this.analyser );
        this.update();
    }

    initialize() {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        this.getUserMedia({ audio: AUDIO_SETTINGS }, this.gotStream.bind(this));
    }

    render() {
        return (
            <div className='Container'>
                <div className='Header'>
                    {
                        this.props.debug ? (
                        <div>
                            <div>
                                {this.state.note}
                            </div> 
                            <div>
                                {this.state.noteNum}
                            </div> 
                            <div>
                                {this.state.frequency}
                            </div> 
                        </div>) : (
                    <div className='Logo'>
                        Guitar Tuner
                    </div>
                    )
                    }
                </div>
                <div className='TopContent'>
                    <EditButton
                        onClick={() => {
                            this.setState({ selectedTuning: 'Custom'})
                        }}>
                    </EditButton>
                    <TunerButton
                        items={menuItems}
                        selectedItem={this.state.selectedTuning}
                        onItemClick={(item) => {
                            this.setState({ selectedTuning: item.title });
                        }}>
                    </TunerButton>
                    <div className='placehodler'></div>
                    {
                        this.state.editingNote !== undefined ? 
                            <NoteChooser
                                onItemClick={(item) => {
                                    var newTuning = [...this.state.customTuning];
                                    newTuning[this.state.editingNote] = item;

                                    this.setState({ editingNote: undefined,
                                                    customTuning: newTuning});
                                }}
                            >

                            </NoteChooser> : <></>
                    }
                </div>
                <Tuner 
                    notes={this.state.selectedTuning === 'Custom'?
                        this.state.customTuning : 
                        tunings[this.state.selectedTuning]
                    }
                    note={this.state.note} 
                    noteNumber={this.state.noteNum} 
                    frequency={this.state.frequency} 
                    editable={this.state.selectedTuning === 'Custom'}
                    onNoteClick={(item)=>{
                        this.setState({ editingNote : item})
                    }}
                    difference={this.state.difference}>
                </Tuner>
            </div>
        );
    }
}
