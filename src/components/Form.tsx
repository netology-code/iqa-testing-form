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

    const checkCorrectSymbol = (str: string): boolean => {
        let isValidStr = true;
        for (let i = 0; i < str.length; i += 1) {
            if (
                str.charCodeAt(i) < 65 
                || (str.charCodeAt(i) > 90 && str.charCodeAt(i) < 97)
                || (str.charCodeAt(i) > 122 && str.charCodeAt(i) < 192)
            ) {
                isValidStr = false;
                break;
            }
        }
        return isValidStr;
    }

    const nameHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        let isValid = true;
        const {name, value} = e.target;

        if(name === 'telephone' && value.length > 0) {
            for (let i = 0; i < value.length; i += 1) {
                if(!arrCodeSymbol.includes(value.charCodeAt(i))) {
                    isValid = false;
                    break;
                }
            }
            isValid
                ? setTextErr(item => ({ ...item, [name]: '' }))
                : setTextErr(item => ({ ...item, [name]: 'Не корректное значение' }))          
        }
        if(name === 'birthdate') {
            isValid = value === '' ? false : true;
        }

        if(name === 'name' || name === 'surname' || name === 'patronymic') {
            if(value.length > 0) {
                isValid = checkCorrectSymbol(value);
                isValid
                    ? setTextErr(item => ({ ...item, [name]: '' }))
                    : setTextErr(item => ({ ...item, [name]: 'Строка содержит не корректный символ' }))
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
        if (result.ok && !result.redirected) {
            const data = await result.json();
            console.log(data);
        }
        
    }

    const clearHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setisValidInp(isValidInputs);
        setInputsValue(initialState);
    }

    return (
        <form>
            <h2>Заявка на дебетовую карту</h2>
            <div className="input-box">
                <input 
                    type="text" 
                    name="name" 
                    placeholder="ИМЯ" 
                    style={isValidInp.name ? {borderColor: '#ddd'} : {borderColor: 'red'}} 
                    value={inputsValue.name} 
                    onChange={nameHandler}
                />
                <div className="text-error">{textErr.name}</div>
            </div>
            <div className="input-box">
                <input 
                    type="text" 
                    name="surname" 
                    placeholder="ФАМИЛИЯ" 
                    style={isValidInp.surname ? {borderColor: '#ddd'} : {borderColor: 'red'}} 
                    value={inputsValue.surname} 
                    onChange={nameHandler}
                />
                <div className="text-error">{textErr.surname}</div>
            </div>
            <div className="input-box">
                <input 
                    type="text" 
                    name="patronymic" 
                    placeholder="ОТЧЕСТВО" 
                    style={isValidInp.patronymic ? {borderColor: '#ddd'} : {borderColor: 'red'}} 
                    value={inputsValue.patronymic} onChange={nameHandler}
                />
                <div className="text-error">{textErr.patronymic}</div>
            </div>
            <div className="input-box">
                <input 
                    type="text" 
                    name="telephone" 
                    placeholder="ТЕЛЕФОН" 
                    style={isValidInp.telephone ? {borderColor: '#ddd'} : {borderColor: 'red'}} 
                    value={inputsValue.telephone} 
                    onChange={nameHandler}
                />
                <div className="text-error">{textErr.telephone}</div>
            </div>
            <div className="input-box">
                <input 
                    type="text" 
                    name="birthdate" 
                    placeholder="ДАТА РОЖДЕНИЯ" 
                    style={isValidInp.birthdate ? {borderColor: '#ddd'} : {borderColor: 'red'}} 
                    value={inputsValue.birthdate} 
                    onChange={nameHandler} 
                    onFocus={focusHandler}
                />
                <div className="text-error">{textErr.birthdate}</div>
            </div>
            <div className="input-box">
                <input 
                    type="text" 
                    name="passport" 
                    placeholder="ПАСПОРТ" 
                    style={isValidInp.passport ? {borderColor: '#ddd'} : {borderColor: 'red'}} 
                    value={inputsValue.passport} 
                    onChange={nameHandler}
                />
                <div className="text-error">{textErr.passport}</div>
            </div>            
            <button onClick={submitHandler}>Отправить</button>
            <button onClick={clearHandler}>Очистить</button>
        </form>
    )
}
