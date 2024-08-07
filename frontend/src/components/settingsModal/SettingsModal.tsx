import * as React from 'react';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Grid from '@mui/material/Grid';
import Slider from '@mui/material/Slider';
import MuiInput from '@mui/material/Input';
import FormatSizeIcon from '@mui/icons-material/FormatSize';


const Input = styled(MuiInput)`
  width: 42px;
`;

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function SettingsModal({open, handleClose, codeFontSize, setCodeFontSize}: {open: boolean, handleClose: () => void, codeFontSize: number, setCodeFontSize: (codeFontSize: number) => void}) {

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setCodeFontSize(newValue as number);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCodeFontSize(event.target.value === '' ? 0 : Number(event.target.value));
  };

  const handleBlur = () => {
    if (codeFontSize < 0) {
      setCodeFontSize(10);
    } else if (codeFontSize > 48) {
      setCodeFontSize(48);
    }
  };
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Settings
          </Typography>
          <Typography id="input-slider" gutterBottom>
        Code Editor Font Size
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <FormatSizeIcon />
        </Grid>
        <Grid item xs>
          <Slider
            value={typeof codeFontSize === 'number' ? codeFontSize : 10}
            onChange={handleSliderChange}
            aria-labelledby="input-slider"
          />
        </Grid>
        <Grid item>
          <Input
            value={codeFontSize}
            size="small"
            onChange={handleInputChange}
            onBlur={handleBlur}
            inputProps={{
              step: 1,
              min: 10,
              max: 48,
              type: 'number',
              'aria-labelledby': 'input-slider',
            }}
          />
        </Grid>
      </Grid>
          <Button onClick={handleClose}>Close</Button>
        </Box>
      </Modal>
    </div>
  );
}