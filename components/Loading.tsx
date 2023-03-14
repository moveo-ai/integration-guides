import CircularProgress from '@mui/material/CircularProgress';
import cn from 'classnames';

import styles from './Loading.module.scss';

interface Props {
  label: string | null | undefined;
  className: string;
}

const Loading = ({ label, className }: Props) => {
  return (
    <div className={cn(styles.wrapper, className)}>
      <CircularProgress />
      <p className={styles.label}>{label}</p>
    </div>
  );
};

Loading.defaultProps = {
  label: 'Loading...',
  className: '',
};

export default Loading;
