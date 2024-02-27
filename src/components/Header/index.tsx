import styles from './style.module.scss';
import { format as dateFormat } from 'date-fns/format'; // Renomeie o formato de importação para evitar conflito
import {ptBR} from 'date-fns/locale/pt-BR';

export function Header(){
    const currentDate = dateFormat(new Date(), 'EEEEEE, d MMM', {locale: ptBR});

    return(
        <header className={styles.headerContainer}>
            <img src="/logo.svg" alt="Logo Podcast" />

            <p>O melhor para você ouvir, sempre</p>

            <span>{currentDate}</span>
       </header>
    );
}
