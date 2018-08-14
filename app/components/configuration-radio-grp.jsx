import React, { Component } from 'react'
import '../css/styles.css'

class ConfigurationRadioBtn extends Component {
    constructor(props) {
        super(props)
    }

    handleClick(){
        this.props.handler(this.props.index);
    }

    render() {
        return (
            <div className="radio-btn-group" onClick={this.handleClick.bind(this)}>
                <div className={this.props.isChecked ? this.props.value + "checked radiobtn" : this.props.value + "unchecked radiobtn"} data-value={this.props.value}></div>
            </div>
        );
    }
}

export class ConfigurationRadioGrp extends Component{
    constructor() {
        super();
        this.state = {
          selectedIndex: null,
          selectedValue: null,
          options: ["ipfs","filecoin","swarm"]
        };
    }

    toggleConfigurationRadioBtn(index){
        this.setState({
          selectedIndex: index,
          selectedValue: this.state.options[index],
          options: this.state.options
        });
    }

    render() {
        const { options } = this.state;

        const allOptions = options.map((option, i) => {
            return <ConfigurationRadioBtn key={i} isChecked={(this.state.selectedIndex == i)} text={option} value={option} index={i} handler={this.toggleConfigurationRadioBtn.bind(this)} />
        });

        return (
            <div>{allOptions}</div>
        );
    }
}
