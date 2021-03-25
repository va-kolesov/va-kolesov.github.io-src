import React from "react";
const noteName = ["C","C#","D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];


export default class NoteChooser extends React.Component {
    noteList = [];
    constructor(props) {
        super(props);
        for (var i = 2; i <= 5; i++) {
            for (var j=0; j < noteName.length; j++){
                this.noteList.push(noteName[j]+i);
            }
        }
    }
    render() {
        return (
            <div className='Button-default NoteChooser'>
                {
                   this.noteList.map(
                       (item, i) => (
                            <div className={'MenuItem clickable ' + (i ? ' border' : '')}
                                key={i}
                                onClick={()=>{ 
                                    this.props.onItemClick(item) 
                                }}>
                                {item}
                            </div>
                       )
                   )
                }
            </div>
        );
    }
}