import '../styles/Header.css';

export default function Header() {
    return (
        <div className='main-header'>
            <img src="/logo.png" alt='' />
            <div style={{ flexGrow: 1 }} />
            <a href='/' target='_blank'><i className='bx bxl-facebook bx-sm' /></a>
            <a href='/' target='_blank'><i className='bx bxl-instagram bx-sm' /></a>
            <a href='/' target='_blank'><i className='bx bxl-telegram bx-sm' /></a>
            <a href='/' target='_blank'><i className='bx bxl-whatsapp bx-sm' /></a>
            <input
                type='button'
                className='account-button'
                value={'Вход'}
            />
        </div>
    )
}