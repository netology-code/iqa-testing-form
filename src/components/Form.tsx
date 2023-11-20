import { useState } from "react";
import InputMask from 'react-input-mask';
import { TempIsValid, TempTextErr } from "./types";

const initialState = {
    name: '',
    surname: '',
    patronymic: '',
    telephone: '',
    birthdate: '',
    passport: ''
}

const isValidInputs = {
    name: true,
    surname: true,
    patronymic: true,
    telephone: true,
    birthdate: true,
    passport: true
}
const textError = {
    name: '',
    surname: '',
    patronymic: '',
    telephone: '',
    birthdate: '',
    passport: ''
}



export const Form = () => {
    const [inputsValue, setInputsValue] = useState(initialState);
    const [isValidInp, setisValidInp] = useState(isValidInputs);
    const [textErr, setTextErr] = useState(textError);
    const [resp, setResp] = useState({statusCode: '', statusText: ''});

    const checkFIO = (name: string, value: string): boolean => {
        if (value.length === 0) {
            setTextErr(item => ({ ...item, [name]: 'Поле не может быть пустым' }));
            return false;
        }
        if (value.length === 1) {
            setTextErr(item => ({ ...item, [name]: 'Значение должно быть более 1 буквы' }));
            return false;
        }
        if((name === 'name' || name === 'patronymic') && value.length > 64) {
            setTextErr(item => ({ ...item, [name]: 'Значение не может быть более 64 символов' }));
            return false;
        }
        if (value.charCodeAt(value.length - 1) === 45) {
            setTextErr(item => ({ ...item, [name]: 'Значение не может заканчиваться на дефис' }));
             return false;
        }

        const isValid = value.search(/^[А-Яа-я-]+$/i) === 0 ? true : false;
        isValid
            ? setTextErr(item => ({ ...item, [name]: '' }))
            : setTextErr(item => ({ ...item, [name]: 'Значение может состоять из кириллических букв и дефиса' }));
            
        return isValid;        
    }

    const nameHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        let isValid = true;
        const {name, value} = e.target;

        if(name === 'name' || name === 'surname' || name === 'patronymic') {
            isValid = checkFIO(name, value);
        }        

        if(name === 'telephone' && value.length > 0) {
            isValid = !value.includes('_');
            isValid
                ? setTextErr(item => ({ ...item, [name]: '' }))
                : setTextErr(item => ({ ...item, [name]: 'Поле заполненно не полностью' }))          
        }
        if(name === 'birthdate') {
            isValid = value === '' ? false : true;
            isValid
            ? setTextErr(item => ({ ...item, [name]: '' }))
            : setTextErr(item => ({ ...item, [name]: 'Поле заполненно не полностью' }));
        }
        if(name === 'passport') {
            if(value.length < 13) {
                isValid = false;
                setTextErr(item => ({ ...item, [name]: 'Поле заполненно не полностью' }))
                if (value.search(/^[0-9a-z\s]+$/i) === -1) {
                    setisValidInp(item => ({ ...item, [name]: isValid }));
                    setInputsValue(item => ({ ...item, [name]: value.slice(0, value.length - 1)}));
                    return;
                }
            } 
            if(value.length >= 13) {
                isValid = true;
                setTextErr(item => ({ ...item, [name]: '' }))
            }
            if(value.length >= 14) {                
                setInputsValue(item => ({ ...item, [name]: value.slice(0, value.length - 1)}));
                return;
            }
            if(value.length === 4) {
                setisValidInp(item => ({ ...item, [name]: isValid }));
                setInputsValue(item => ({ ...item, [name]: value + ' ' }));
                return;
            }
        }        

        setisValidInp(item => ({ ...item, [name]: isValid }));
        setInputsValue(item => ({ ...item, [name]: value }));
    }

    const clearHandler = (e: React.SyntheticEvent<HTMLElement>) => {
        const clickInput= e.currentTarget.dataset.clear;
        if (clickInput) {
            setTextErr(item => ({ ...item, [clickInput]: '' }));
            setisValidInp(item => ({ ...item, [clickInput]: true }));
            setInputsValue(item => ({ ...item, [clickInput]: '' }));
        }        
    }

    const submitHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        let isEmpty = false;
        const tempIsValidObj: TempIsValid = {};
        const tempTextErr: TempTextErr = {};

        let propValue: keyof typeof inputsValue;
        for(propValue in inputsValue) {
            if (inputsValue[propValue] === '') {
                isEmpty = true;
                tempIsValidObj[propValue] = false;
                tempTextErr[propValue] = 'Поле должно быть заполнено';                
            } 
        }
        
        if (isEmpty) {
            setisValidInp(item => ({ ...item, ...tempIsValidObj }));
            setTextErr(item => ({ ...item, ...tempTextErr }));
            return;
        }

        let prop: keyof typeof isValidInp;
        for (prop in isValidInp) {
            if (!isValidInp[prop]) {
                return;
            }           
        }

        const result = await fetch(import.meta.env.VITE_URL, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({...inputsValue, patronymic: 'Отсутствует'})
        });
        // console.log(result)
        if (result.redirected) {
            setResp({statusCode: '301', statusText: 'Moved Permanently'})
        } else {
            setResp({statusCode: String(result.status), statusText: result.statusText})
        }
        
        // if (result.ok && !result.redirected) {
        //     const data = await result.json();
        //     console.log(data);
        // }

        setisValidInp(isValidInputs);
        setInputsValue(initialState);
    }    
    
    
    return (
        <form>
            <h2>Заявка на дебетовую карту</h2>
            <div className="input-box">
                <div className="clear" data-clear="name" onClick={clearHandler}>+</div>
                <div className="input-label">имя</div>
                <input 
                    type="text" 
                    name="name" 
                    placeholder="ВАШЕ ИМЯ" 
                    style={isValidInp.name ? {borderColor: '#ddd'} : {borderColor: 'red'}} 
                    value={inputsValue.name} 
                    onChange={nameHandler}
                />
                <div className="text-error">{textErr.name}</div>
            </div>
            <div className="input-box">
                <div className="clear" data-clear="surname" onClick={clearHandler}>+</div>
                <div className="input-label">фамилия</div>
                <input 
                    type="text" 
                    name="surname" 
                    placeholder="ВАША ФАМИЛИЯ" 
                    style={isValidInp.surname ? {borderColor: '#ddd'} : {borderColor: 'red'}} 
                    value={inputsValue.surname} 
                    onChange={nameHandler}
                />
                <div className="text-error">{textErr.surname}</div>
            </div>
            <div className="input-box">
                <div className="clear" data-clear="patronymic" onClick={clearHandler}>+</div>
                <div className="input-label">отчество</div>
                <input 
                    type="text" 
                    name="patronymic" 
                    placeholder="ВАШЕ ОТЧЕСТВО" 
                    style={isValidInp.patronymic ? {borderColor: '#ddd'} : {borderColor: 'red'}} 
                    value={inputsValue.patronymic} onChange={nameHandler}
                />
                <div className="text-error">{textErr.patronymic}</div>
            </div>
            <div className="input-box">
                <div className="clear" data-clear="telephone" onClick={clearHandler}>+</div>
                <div className="input-label">телефон</div>
                <InputMask 
                    type="tel" 
                    name="telephone" 
                    placeholder="+7(111)111-11-11"
                    mask="+7(999)999-99-99"
                    maskChar="_"
                    style={isValidInp.telephone ? {borderColor: '#ddd'} : {borderColor: 'red'}} 
                    value={inputsValue.telephone} 
                    onChange={nameHandler}
                />
                <div className="text-error">{textErr.telephone}</div>
            </div>
            <div className="input-box">
            <div className="input-label">дата рождения</div>
                <input 
                    type="date" 
                    name="birthdate" 
                    placeholder="" 
                    style={isValidInp.birthdate ? {borderColor: '#ddd'} : {borderColor: 'red'}} 
                    value={inputsValue.birthdate} 
                    onChange={nameHandler} 
                    // onFocus={focusHandler}
                />
                <div className="text-error">{textErr.birthdate}</div>
            </div>
            <div className="input-box">
                <div className="clear" data-clear="passport" onClick={clearHandler}>+</div>
                <div className="input-label">паспорт</div>
                <input 
                    type="text" 
                    name="passport" 
                    placeholder="0000 000000" 
                    style={isValidInp.passport ? {borderColor: '#ddd'} : {borderColor: 'red'}} 
                    value={inputsValue.passport} 
                    onChange={nameHandler}
                />
                <div className="text-error">{textErr.passport}</div>
            </div>
            <div className="btn-box">
                <button onClick={submitHandler}>Отправить</button>
                {resp.statusCode && <div className="answer-box">
                    <div>Ответ сервера:</div>
                    <div className="answer-code">Код ответа: {resp.statusCode}</div>
                    <div className="answer-text">Текст ответа: {resp.statusText}</div>
                </div>}
            </div>         
        </form>
    )
}
