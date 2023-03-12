
import './App.css';
import Navbar from './components/Navbar';
// import TextForm from './components/TextForm';
import About from './components/About';


function App() {
  return (
  <>

<Navbar title= "Welcome" aboutText="About"/>
{/* <Navbar/> */}

<div className="container my-3">
{/* < TextForm heading="Enter Your Text Here to Analyze Below" /> */}
{/* {<TextForm/>} */}
<About/>
</div>


  </>
);
} 

export default App;
