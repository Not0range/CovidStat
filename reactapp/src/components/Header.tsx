import { useEffect, useState } from 'react';
import $ from 'jquery';
import { setLoginDialog } from '../store/displaySlice';
import { useAppDispatch, useAppSelector } from '../store/store';
import '../styles/Header.css';
import { setUsername } from '../store/mainSlice';
import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
    const navigate = useNavigate();

    const username = useAppSelector(state => state.main.username);
    const dialog = useAppSelector(state => state.display.loginDialog);
    const dispatcher = useAppDispatch();

    useEffect(() => {
        if (dialog) $('body').addClass('no-scroll');
        else $('body').removeClass('no-scroll');
    }, [dialog]);

    const logout = () => {
        $.ajax('api/account/logout', {
            success: () => {
                dispatcher(setUsername(undefined));
            }
        })
    }

    return (
        <div className='main-header'>
            <Link to={'/'}>
                <img src="/logo.png" alt='' />
            </Link>
            <div style={{ flexGrow: 1 }} />
            <a href='/' target='_blank'><i className='bx bxl-facebook bx-sm' /></a>
            <a href='/' target='_blank'><i className='bx bxl-instagram bx-sm' /></a>
            <a href='/' target='_blank'><i className='bx bxl-telegram bx-sm' /></a>
            <a href='/' target='_blank'><i className='bx bxl-whatsapp bx-sm' /></a>
            {
                username === undefined ?
                    <input
                        type='button'
                        className='account-button'
                        value={'Вход'}
                        onClick={() => dispatcher(setLoginDialog(true))}
                    /> :
                    <div className='header-button-group'>
                        <input
                            type='button'
                            className='account-button'
                            value={'Панель управления'}
                            onClick={() => navigate('admin')}
                        />
                        <div style={{ width: '5px' }} />
                        <input
                            type='button'
                            className='account-button'
                            value={'Выход'}
                            onClick={logout}
                        />
                    </div>
            }
            <div
                className='login-dialog'
                style={{ display: dialog ? '' : 'none' }}
                onClick={e => { if (e.target == e.currentTarget) dispatcher(setLoginDialog(false)); }}
            >
                <div className='login-dialog-container'>
                    <LoginDialog />
                </div>
            </div>
        </div >
    )
}

function LoginDialog() {
    const navigate = useNavigate();
    const dispatcher = useAppDispatch();

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');

    const submit = () => {
        if (login.trim().length == 0 || password.trim().length == 0) {
            return;
        }

        const data = new FormData();
        data.append('username', login);
        data.append('password', password);

        $.ajax('api/account/login', {
            method: 'POST',
            data,
            processData: false,
            contentType: false,
            success: result => {
                dispatcher(setUsername(result));
                dispatcher(setLoginDialog(false));
                navigate('admin');
            }
        })
    }

    return (
        <div className='login-dialog-main'>
            <h2>Авторизация</h2>
            <div className='login-dialog-input-container'>
                <i className='bx bx-user' onClick={e => $(e.currentTarget).next().trigger('focus')} />
                <input type='text' placeholder='Имя пользователя' value={login} onChange={e => setLogin(e.target.value)} />
            </div>
            <div className='login-dialog-input-container'>
                <i className='bx bx-lock-alt' onClick={e => $(e.currentTarget).next().trigger('focus')} />
                <input type='password' placeholder='Пароль' value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <input type='button' className='account-button' value='Вход' onClick={submit} />
        </div>
    )
}