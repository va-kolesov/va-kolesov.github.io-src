import React from "react";

export default class TunerButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = { opened: false };
    }
    render() {
        return (
            <div className='MenuContainer'>
                {this.state.opened ? (
                    <div className="Menu Button-default">
                        {
                            this.props.items.map(
                                (item , i) => (
                                    <div className={'MenuItem clickable ' + (i ? ' border' : '')}
                                        onClick={() => {
                                            this.setState({ opened: false });
                                            this.props.onItemClick(item);
                                        }}
                                        key={i}>
                                        {item.title}
                                    </div>
                                )
                            )                        
                        }   
                    </div>
                ) : (
                    <div className="ButtonBase MenuButton Button-default clickable"
                        onClick={() => {
                            this.setState({ opened: true });
                        }}>
                        {this.props.selectedItem}
                    </div>        
                )}
            </div>
        );
    }
}