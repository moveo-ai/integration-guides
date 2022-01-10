import Image from 'next/image';
import PropTypes from 'prop-types';
import React from 'react';

const Success = ({ label }) => {
  return (
    <div className="success-div p-10">
      <div className="text-center">
        <Image
          width="66"
          height="66"
          alt="Sucess"
          src="/assets/check-circle.svg"
        />
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

Success.propTypes = {
  label: PropTypes.string,
};

Success.defaultProps = {
  label: 'Success',
};

export default Success;
