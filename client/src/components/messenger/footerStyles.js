import { makeStyles } from '@material-ui/core/styles';

const drawerWidth = 270;

export const useStyles = makeStyles((theme) => ({
  footer: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
    bottom: '0',
    left: '0',
    right: '0',
    position: 'fixed',
    backgroundColor: '#bbbfc2',
    minHeight: '80px',
    display: 'flex',
    alignItems: 'center',
    // justifyContent: 'space-around',
  },
  button: {
    margin: theme.spacing(1),
  },
  inputRoot: {
    width: '75%',
    margin: '0 0.5rem',
  },
}));
