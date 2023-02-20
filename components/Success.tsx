import cn from 'classnames';
import CheckCircle from './Images/CheckCircle';

type Props = {
  label: string | undefined | null;
  color: string;
  className: string;
};

const Success = ({ label, color, className }: Props) => {
  return (
    <div className={cn('success-div p-10', className)}>
      <div className="text-center">
        <CheckCircle color={color} />
      </div>
      <p className="text-center p-1">{label}</p>
      <style jsx>{`
        .success-div {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </div>
  );
};

Success.defaultProps = {
  label: 'Success',
  color: '#1B66D6',
  className: '',
};

export default Success;
