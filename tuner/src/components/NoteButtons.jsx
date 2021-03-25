import React from 'react';
import NoteButton from  './NoteButton.jsx';

export default class NoteButtons extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className='NoteButtons'>
                {
                    this.props.notesState.map(
                        (item , i) => (
                            <NoteButton 
                                key={i} 
                                note={item.note} 
                                style={item.style || 'default'}
                                clickable={this.props.clickable}
                                onClick={
                                    () => { this.props.onNoteClick(i);}
                                    }
                                />
                        )
                    )
                }
            </div>
        );
    }
}