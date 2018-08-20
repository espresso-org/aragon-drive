import React from 'react'
import { observer } from 'mobx-react'
import '../css/styles.css'

const ConfigurationRadioBtn = observer(({ isChecked, value, index, handler}) =>
    <span onClick={() => handler(index)}>
        <span className={isChecked ? value + "checked radiobtn" : value + "unchecked radiobtn"} data-value={value}></span>
    </span>
)

function allOptions(options, store)  
{    
    return options.map((option, i) => {
        return <ConfigurationRadioBtn key={i} isChecked={(store.radioGrpSelectedIndex == i)} index={i} value={option} handler={() => { store.radioGrpSelectedIndex = i; store.radioGrpSelectedValue = options[i];}} />
    });
}

export const ConfigurationRadioGrp = observer(({ options, store }) => 
    <div>{allOptions(options, store)}</div>
)
