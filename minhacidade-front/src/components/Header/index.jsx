import styles from './header.module.css'
import logo from "../../img/logo.png"
import { Link } from 'react-router-dom';
function Header() {
    return (
        <header className={styles.header}>
            <Link to="/">
            <img src={logo} alt='Logo' />
            </Link>
            <h1>
            <Link to="/CadastroOcorrencia">
            Minha Cidade
            </Link>
            </h1>
            <a href="/ocorrencias" className={styles.link}>Ocorrências</a>
            <a href="/attocorrencias" className={styles.link}>ADM</a>               
            
        </header>
    )
}

export default Header;