import React from 'react';

export default class NoteButton extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className={"ButtonBase Button Button-" + 
                                this.props.style + 
                                (this.props.clickable ? ' clickable' : '')} 
                 onClick={() => {
                     if (this.props.clickable) {
                         this.props.onClick();
                     }
                 }}>
                {this.props.note}
            </div>
        );
    }
}