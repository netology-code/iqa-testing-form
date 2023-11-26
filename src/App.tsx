import logoImg from './assets/logo.png'
import { Form } from './components/Form'
import './App.css'

function App() {

  return (
    <div className='main'>
        <div className='logo'>
            <img src={logoImg} alt="" />
        </div>
        <div className='info-box'>Это тестовая страница для выполнения домашнего задания на курсе “Ручное тестирование веб-приложений”. Данные, внесенные в форму, не сохраняются.</div>
        <div className='form-box'>
            <Form />
        </div>
    </div>
  )
}

export default App
