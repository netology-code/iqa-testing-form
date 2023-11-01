import logoImg from './assets/logo.png'
import { Form } from './components/Form'
import './App.css'

function App() {

  return (
    <div className='main'>
        <div className='logo'>
            <img src={logoImg} alt="" />
        </div>
        <div className='form-box'>
            <Form />
        </div>
    </div>
  )
}

export default App
