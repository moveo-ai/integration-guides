type props = { color: string };

const CheckCircle = ({ color }: props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={66}
    height={66}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="feather feather-check-circle"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <path d="M22 4 12 14.01l-3-3" />
  </svg>
);

export default CheckCircle;
