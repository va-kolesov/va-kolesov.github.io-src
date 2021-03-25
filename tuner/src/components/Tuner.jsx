import React from 'react';
import NoteButtons from './NoteButtons.jsx';
import Scale from './Scale.jsx';

export default class Tuner extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    prepateNotesState({notes, note, difference}) {
        let state = notes.map((item) => {
            let style = item === note ? (difference < 0.2 ? 'right' : 'wrong') : '';
            return {
                note: item,
                style
            }
        });
        return state;
    }
    render() {
        let notesState = this.prepateNotesState(this.props);
        let currentNoteIndex = notesState.findIndex((item) => item.style);
        let scaleStyle = '';
        if (currentNoteIndex !== -1) {
            scaleStyle = notesState[currentNoteIndex].style;
        }

        return (
            <div className='Tuner'>
                <NoteButtons 
                    clickable={this.props.editable}
                    notesState={notesState}
                    onNoteClick={this.props.onNoteClick}/>
                <Scale note={this.props.noteNumber} angle={this.props.difference * 20} style={scaleStyle}></Scale>
                <div className='placehodler'></div>
            </div>
        );
    }
}