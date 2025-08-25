import { NavLink, Outlet } from 'react-router-dom';
import styles from './Layout.module.scss';
import { cocktailCodes } from '@/entities/cocktail/model/consts';

export const Layout = () => {
  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <nav>
          <ul className={styles.menuList}>
            {cocktailCodes.map((code) => (
              <li key={code}>
                <NavLink
                  to={`/${code}`}
                  className={({ isActive }) => (isActive ? styles.active : undefined)}
                >
                  {code}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
};



