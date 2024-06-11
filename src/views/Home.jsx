import React, {useContext} from 'react'
import { Context } from '../js/store/appContext'  
import Navbar from '../components/Navbar'
import { useNavigate } from 'react-router-dom'


const Home = () => {
    const {store, actions} = useContext(Context);

  const navigate = useNavigate();
  const handlerClic = () =>{
    console.log("Este botón va a contact")
    navigate("/contact")
  }

  return (
    <div>Home
      <Navbar />
      <button onClick={handlerClic}>Navegar a contact</button>
      <h4>Va a mostrar los nombres guardados en contexto global: {store.personas}</h4>
    </div>
  )
}

export default Home