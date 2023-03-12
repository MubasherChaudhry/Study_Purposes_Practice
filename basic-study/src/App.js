
import './App.css';
import Navbar from './components/Navbar';
import TextForm from './components/TextForm';


function App() {
  return (
  <>

<Navbar title= "Welcome" aboutText="About"/>
{/* <Navbar/> */}

<div className="container my-3">
< TextForm heading="Enter Your Text Here" />
{/* {<TextForm/>} */}
</div>


  </>
);
} 

export default App;
