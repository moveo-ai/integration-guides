import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import Image from 'next/image';
import PropTypes from 'prop-types';
import React from 'react';

const ConfirmationBox = ({
  data,
  open,
  disclaimers,
  handleClose,
  handleSubmitData,
}) => {
  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={open}
      fullScreen
    >
      <DialogTitle id="simple-dialog-title">
        <span className="dialog-title">
          <Image
            width="42"
            height="42"
            alt="person "
            src="/assets/person.svg"
          />
          Your information
        </span>
      </DialogTitle>
      <List>
        {data.map(({ label, value }) => {
          return (
            <ListItem key={label}>
              <div className="list-item">
                <Typography color="textSecondary">{label}</Typography>
                <Typography color="textSecondary">
                  <strong>{value}</strong>
                </Typography>
              </div>
            </ListItem>
          );
        })}
        {disclaimers && (
          <div className="disclaimer-div">
            {disclaimers.map((txt) => {
              return (
                <p key={txt} className="disclaimer-text">
                  {txt}
                </p>
              );
            })}
          </div>
        )}
      </List>
      <div className="buttons-container">
        <Button onClick={handleClose} variant="contained">
          BACK
        </Button>
        <Button onClick={handleSubmitData} variant="contained" color="primary">
          SEND
        </Button>
      </div>
      <style jsx>{`
        .dialog-title {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .dialog-title img {
          margin-right: 20px;
        }
        .list-item {
          display: grid;
          grid-template-columns: 50% 50%;
          width: 100%;
          padding: 0 16px 5px 16px;
          border-bottom: 1px solid gray;
        }
        .list-item p {
          word-break: break-all;
        }
        .buttons-container {
          display: flex;
          justify-content: space-evenly;
          padding: 10px 0 20px 0;
          min-height: 70px;
        }
        .disclaimer-div {
          margin-left: 16px;
          margin-top: 5px;
        }
      `}</style>
    </Dialog>
  );
};

ConfirmationBox.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    })
  ).isRequired,
  disclaimers: PropTypes.array,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleSubmitData: PropTypes.func.isRequired,
};

ConfirmationBox.defaultProps = {
  disclaimers: [],
};

export default ConfirmationBox;
