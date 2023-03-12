import React, {useState} from "react";
 


export default function TextForm(props) {

  const handleOnClick=()=>{
    console.log('Uppercase was clicked' + text);
    let newText =text.toUpperCase();
    setText(newText)

  }

  const handleOnChange=(e)=>{
    console.log('on Change');
    setText(e.target.value)
    
  }

  const [text, setText]= useState('Write down your thoughts');


  return (
    <div>
      <h1> {props.heading} </h1>
      <div className="mb-3">
        {/* <label for="myBox" className="form-label">{}</label> */}
        <textarea className="form-control" value= {text} onChange={handleOnChange} id="myBox" rows="8"></textarea>
      </div>
      <button className="btn btn-primary" onClick={handleOnClick}>Convert to Uppercase </button>
    </div>
  );
}
