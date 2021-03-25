import React from 'react';
import { getNotesRangeByNote, getNoteString } from '../utils/getNoteByFrequency';

export default class Scale extends React.Component {

    constructor(props) {
        super(props);
    }
    render() {
        let range = getNotesRangeByNote(this.props.note);
        let note = getNoteString(this.props.note);
        if (this.props.note > 71 || this.props.note < 24) {
            note = null;
        }
        let hint = '';
        if (this.props.style) {
            if (this.props.angle > 2) {
                hint = 'tune down';
            } else if (this.props.angle < -2) {
                hint = 'tune up';
            } else {
                hint = 'tuned';
            }
        }
        return (
            <div className={'Scale Button-' + (this.props.style || 'default')}>
                <div className='Scale_tick'>
                    <svg viewBox='-10 0 20 30'>
                        <path d='M-7,0 Q-2,0 0,25 Q2,0 7,0' />
                    </svg>
                </div>
                <div className='Scale_content' style={ { transform: `rotate(${this.props.angle || 0}deg)`} }>
                    {
                        note ? (<>
                            <div className='Scale_elem Scale_elem-small r-3'>{range[0]? range[0] : ''}</div>
                            <div className='Scale_elem Scale_elem-small r-2'>{range[1]? range[1] : ''}</div>
                            <div className='Scale_elem Scale_elem-small r-1'>{range[2]? range[2] : ''}</div>
                            <div className='Scale_elem Scale_elem-big r0'>{range[3]? range[3] : ''}</div>
                            <div className='Scale_elem Scale_elem-small r1'>{range[4]? range[4] : ''}</div>
                            <div className='Scale_elem Scale_elem-small r2'>{range[5]? range[5] : ''}</div>
                            <div className='Scale_elem Scale_elem-small r3'>{range[6]? range[6] : ''}</div>
                        </>) : 
                        (<></>)
                    }
                </div>
                <div className='Scale_hint'>
                    <div className='Scale_hint_note'>
                        {note && note}
                    </div>
                    <div className='Scale_hint_text'>
                        {hint}
                    </div>
                </div>
            </div>
        );
    }
}