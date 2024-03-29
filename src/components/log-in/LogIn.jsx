import './LogIn.css'
import { useState, useRef } from 'react';
import LabelInput from '../label-input/LabelInput';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useNavigate } from 'react-router-dom';
import UserService from '../../shared/services/user-service';
import { useEffect } from 'react';

const LogIn = () => {
    const [ loading, setLoading ] = useState(false);
    const [ textLoading, setTextLoading ] = useState('Iniciar Sesión');
    const navigate = useNavigate();
    const toast = useRef(null);

    useEffect(() => {
        setTextLoading(loading ? 'Cargando...' : 'Iniciar Sesión');
    }, [loading]);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const updateData = (key, value) => {
        if (key === 'email'){
            setEmail(value);
        }
        else {
            setPassword(value);
        }
    }

    let information = [
        ['email', 'Correo electrónico', email, updateData],
        ['password', 'Contraseña', password, updateData]
    ]

    const toastError = 'Ocurrio un error al iniciar sesión. Verifique que el email y contraseña sean correctos.'

    const sendData = async () => {
        if (email === '' || password === '') {
            alert('Por favor, complete todos los campos.');
            return;
        }

        const data = {
            "email": email,
            "password": password
        }
        setLoading(true);
        try {
            const response = await UserService.verifyUser(data);
            localStorage.setItem('userId', response.data.id);
            navigate('/home/' + response.data.username);
            setLoading(false);
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error de usuario y contraseña', detail: toastError });
            setLoading(false);
        }
    }

    const handleEnterPress = () => {
        sendData();
    }

    return (
        <div>
            <Toast ref={toast} />
            <div className='log-in'>
                <div className='log-in-content'>
                    <h1>¡Bienvenido de vuelta!</h1>
                    <p>Con nuestro simulador, puedes obtener una estimación del cronograma de pagos para tu crédito del programa Nuevo Crédito del fondo Mi Vivienda en Perú.</p>
                </div>
                
                <div className='log-in-content'>
                    <h1>Iniciar Sesión</h1>
                    {information.map((info, index) => 
                        <LabelInput
                        key={info[0]}
                        id={info[0]}
                        text={info[1]}
                        state={info[2]}
                        setState={info[3]} 
                        onEnter={handleEnterPress}
                        {...(index >= 1 ? {isPassword: true} : {})} />
                    )}
                    <Button label={textLoading} onClick={sendData}/>
                </div>
            </div>
        </div>
    )
}

export default LogIn
