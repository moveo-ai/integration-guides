import CircularProgress from '@mui/material/CircularProgress';
import cn from 'classnames';

import styles from './Loading.module.scss';

interface Props {
  label?: string;
  className?: string;
}

const Loading = ({ label = 'Loading...', className }: Props) => {
  return (
    <div className={cn(styles.wrapper, className)}>
      <CircularProgress />
      <p className={styles.label}>{label}</p>
    </div>
  );
};

export default Loading;
