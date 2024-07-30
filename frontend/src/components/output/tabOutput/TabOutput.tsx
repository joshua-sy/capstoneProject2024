import * as React from 'react';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import DotGraphViewer from '../dotGraphViewer/DotGraphViewer';
import TerminalOutput from '../terminalOutput/TerminalOutput';
import CodeGPT from '../codeGPT/CodeGPT';
import LLVMIR from '../LLVMIR/LLVMIR';

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}



function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

interface TabOutputProps {
  dotGraphString: string;
  lineNumToHighlight: number[];
  setlineNumToHighlight: (newLineNumToHighlight: number[]) => void
}

// export default function TabOutput() 
const TabOutput: React.FC<TabOutputProps> = ({
  dotGraphString,
  lineNumToHighlight,
  setlineNumToHighlight,
}) => {
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index: number) => {
    setValue(index);
  };

  return (
    <Box sx={{ bgcolor: 'background.paper' }}>
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="secondary"
          textColor="inherit"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label="Graph" {...a11yProps(0)} />
          <Tab label="Terminal Output" {...a11yProps(1)} />
          <Tab label="CodeGPT" {...a11yProps(2)} />
          <Tab label="LLVMIR" {...a11yProps(3)} />

        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          <DotGraphViewer dotGraphString={dotGraphString} lineNumToHighlight={lineNumToHighlight} setlineNumToHighlight={setlineNumToHighlight}/>
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <TerminalOutput />
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
          Item Three
        </TabPanel>
        <TabPanel value={value} index={3} dir={theme.direction}>
          Item Four
        </TabPanel>
      </SwipeableViews>
    </Box>
  );
}
export default TabOutput;