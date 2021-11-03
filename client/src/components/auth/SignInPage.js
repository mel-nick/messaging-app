import React, { useState, useContext, useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { useStyles } from './singnInStyles';
import Container from '@material-ui/core/Container';
import { Link, Redirect } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { login } from '../../actions/auth';
import { SocketContext } from '../../context';
import AlertToastr from './AlertToastr';
import { HIDE_ERROR_TOASTER } from '../../actions/types';
import { v4 as uuidv4 } from 'uuid';

const SignInPage = () => {
  const isAuthenticated = useSelector(({ auth }) => auth?.isAuthenticated);
  const user = useSelector(({ auth }) => auth?.user);
  const errorMessage = useSelector(({ auth }) => auth?.errorMessage);
  const showErrorToastr = useSelector(({ auth }) => auth?.showErrorToastr);

  const dispatch = useDispatch();

  const { socket } = useContext(SocketContext);
  useEffect(() => socket && socket.close());
  const classes = useStyles();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    dispatch(login(email, password));
  };

  if (user && isAuthenticated) {
    return <Redirect to='/' />;
  }
  return (
    <Container component='main' maxWidth='xs'>
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Sign in
        </Typography>
        <form className={classes.form} noValidate onSubmit={(e) => onSubmit(e)}>
          <TextField
            onChange={(e) => onChange(e)}
            variant='outlined'
            margin='normal'
            required
            fullWidth
            id='email'
            label='Email Address'
            name='email'
            value={email}
            autoComplete='email'
            autoFocus
          />
          <TextField
            onChange={(e) => onChange(e)}
            variant='outlined'
            margin='normal'
            required
            fullWidth
            name='password'
            label='Password'
            type='password'
            value={password}
            id='password'
            autoComplete='current-password'
          />
          <Button
            type='submit'
            fullWidth
            variant='contained'
            color='primary'
            className={classes.submit}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item>
              <Link to='/sign-up' className={classes.signUpLink}>
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      {errorMessage?.map(({ msg }) => (
        <AlertToastr
          key={uuidv4()}
          open={showErrorToastr}
          message={msg}
          type={HIDE_ERROR_TOASTER}
        />
      ))}
    </Container>
  );
};

export default SignInPage;
