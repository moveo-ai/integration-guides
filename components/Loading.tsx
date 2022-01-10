import PropTypes from 'prop-types';
import React from 'react';

interface Props {
  label: string;
}

const Loading = ({ label }: Props) => {
  return (
    <div className="p-10">
      <div className="loader ease-linear mx-auto rounded-full border-4 border-t-4 border-gray-200 h-10 w-10" />
      <p className="text-center p-1">{label}</p>
    </div>
  );
};

Loading.propTypes = {
  label: PropTypes.string,
};

Loading.defaultProps = {
  label: 'Loading...',
};

export default Loading;
