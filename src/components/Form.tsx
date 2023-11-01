import { useState } from "react";

const arrCodeSymbol = [32, 40, 41, 43, 45, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57];

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

export const Form = () => {
    const [inputsValue, setInputsValue] = useState(initialState);
    const [isValidInp, setisValidInp] = useState(isValidInputs);

    const nameHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        let isValid = true;
        const {name, value} = e.target;

        if(name === 'telephone' && isValidInp.telephone) {
            isValid = arrCodeSymbol.includes(value.charCodeAt(value.length - 1)) ? true : false;            
        }
        if(name === 'birthdate') {
            isValid = value === '' ? false : true;
        }

        if(name === 'name' || name === 'surname' || name === 'patronymic') {
            if(value.length > 0){
                if (
                    value.charCodeAt(value.length - 1) < 65 
                    || (value.charCodeAt(value.length - 1) > 90 && value.charCodeAt(value.length - 1) < 97)
                    || (value.charCodeAt(value.length - 1) > 122 && value.charCodeAt(value.length - 1) < 192)
                ) {
                    isValid = false;
                } else {
                    isValid = true;
                }
            }
        }

        setisValidInp(item => ({ ...item, [name]: isValid }));
        setInputsValue(item => ({ ...item, [name]: value }));
    }

    const focusHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.target.type='date';
    }

    const submitHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!inputsValue.birthdate) {
            setisValidInp(item => ({ ...item, birthdate: false }));
            return;
        }

        if (inputsValue.passport.trim() === '') {
            setisValidInp(item => ({ ...item, passport: false }));
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
        if (result.ok) {
            const data = await result.json();
            console.log(data);
        }
        
    }

    return (
        <form>
            <h2>Заявка на дебетовую карту</h2>
            <input 
                type="text" 
                name="name" 
                placeholder="ИМЯ" 
                style={isValidInp.name ? {borderColor: '#ddd'} : {borderColor: 'red'}} 
                value={inputsValue.name} 
                onChange={nameHandler}
            />
            <input 
                type="text" 
                name="surname" 
                placeholder="ФАМИЛИЯ" 
                style={isValidInp.surname ? {borderColor: '#ddd'} : {borderColor: 'red'}} 
                value={inputsValue.surname} 
                onChange={nameHandler}
            />
            <input 
                type="text" 
                name="patronymic" 
                placeholder="ОТЧЕСТВО" 
                style={isValidInp.patronymic ? {borderColor: '#ddd'} : {borderColor: 'red'}} 
                value={inputsValue.patronymic} onChange={nameHandler}
            />
            <input 
                type="text" 
                name="telephone" 
                placeholder="ТЕЛЕФОН" 
                style={isValidInp.telephone ? {borderColor: '#ddd'} : {borderColor: 'red'}} 
                value={inputsValue.telephone} 
                onChange={nameHandler}
            />
            <input 
                type="text" 
                name="birthdate" 
                placeholder="ДАТА РОЖДЕНИЯ" 
                style={isValidInp.birthdate ? {borderColor: '#ddd'} : {borderColor: 'red'}} 
                value={inputsValue.birthdate} 
                onChange={nameHandler} 
                onFocus={focusHandler}
            />
            <input 
                type="text" 
                name="passport" 
                placeholder="ПАСПОРТ" 
                style={isValidInp.passport ? {borderColor: '#ddd'} : {borderColor: 'red'}} 
                value={inputsValue.passport} 
                onChange={nameHandler}
            />
            <button onClick={submitHandler}>Отправить</button>
        </form>
    )
}
