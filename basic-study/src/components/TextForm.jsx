import React, {useState} from "react";
export default function TextForm(props) {

  const handleOnClick=()=>{
    // console.log('Uppercase was clicked' + text);
    let newText =text.toUpperCase();
    setText(newText)

  }
  const handleLoCase=()=>{
    // console.log('Uppercase was clicked' + text);
    let newText =text.toLowerCase();
    setText(newText)

  }

  const handleOnChange=(e)=>{
    console.log('on Change');
    setText(e.target.value)
    
  }
  const handleCapitalize = () => {
  let newText = text.split(" ").map(el => el.charAt(0).toUpperCase() + el.slice(1)).join (" ");
  setText(newText); }


  const [text, setText]= useState('');


  return (
    <>
    <div>
      <h1> {props.heading} </h1>
      <div className="mb-3">
        {/* <label for="myBox" className="form-label">{}</label> */}
        <textarea className="form-control" value= {text} onChange={handleOnChange} id="myBox" rows="8"></textarea>
      </div>
      <button className="btn btn-primary mx-2 " onClick={handleOnClick}>Convert to Uppercase </button>
      <button className="btn btn-primary mx-2 " onClick={handleLoCase}>Convert to Lowercase </button>
      <button className="btn btn-primary mx-2 " onClick={handleCapitalize}>Capitalize </button>
    </div>
    
    <div className="container my-3 ">
      <h2>Your Text summary</h2>
      <p> Your text Contain {text.split(" ").length-1} Words and {text.length} Characters.</p>
      <p>it will take {0.008*text.split("").length }Minutes to read it. </p>
      <h2>Preview</h2>
      <p>{text} </p>

    </div>
    </>
  );
}
