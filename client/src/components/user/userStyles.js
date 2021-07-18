import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(() => ({
  avatar: {
    display: 'flex',
    alignItems: 'center',
    margin: '1rem 0.5rem',
    cursor: 'pointer',
  },
  userData: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: '0.5rem',
  },
}));
