import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { useStyles } from './singnInStyles';
import Container from '@material-ui/core/Container';
import { useSelector, useDispatch } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { register } from '../../actions/auth';
import AlertToastr from './AlertToastr';
import { HIDE_ERROR_TOASTER, SHOW_ERROR_TOASTER } from '../../actions/types';
import { PASSWORDS_DONT_MATCH } from '../../utils/errorMessages';
import { v4 as uuidv4 } from 'uuid';

const SignUpPage = () => {
  const isAuthenticated = useSelector(({ auth }) => auth?.isAuthenticated);
  const errorMessage = useSelector(({ auth }) => auth?.errorMessage);
  const showErrorToastr = useSelector(({ auth }) => auth?.showErrorToastr);

  const dispatch = useDispatch();

  const classes = useStyles();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    password2: '',
  });
  const { firstName, lastName, email, password, password2 } = formData;
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const onSubmit = (e) => {
    e.preventDefault();
    if (password !== password2) {
      dispatch({
        type: SHOW_ERROR_TOASTER,
        payload: [{ msg: PASSWORDS_DONT_MATCH }],
      });
    } else {
      dispatch(register({ firstName, lastName, email, password }));
    }
  };
  //redirect if logged in
  if (isAuthenticated) {
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
          Sign up
        </Typography>
        <form className={classes.form} noValidate onSubmit={(e) => onSubmit(e)}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete='fname'
                name='firstName'
                value={firstName}
                onChange={(e) => onChange(e)}
                variant='outlined'
                required
                fullWidth
                id='firstName'
                label='First Name'
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant='outlined'
                required
                fullWidth
                id='lastName'
                label='Last Name'
                name='lastName'
                value={lastName}
                onChange={(e) => onChange(e)}
                autoComplete='lname'
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant='outlined'
                required
                fullWidth
                id='email'
                label='Email Address'
                name='email'
                value={email}
                onChange={(e) => onChange(e)}
                autoComplete='email'
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant='outlined'
                required
                fullWidth
                name='password'
                minLength='6'
                value={password}
                onChange={(e) => onChange(e)}
                label='Password'
                type='password'
                id='password'
                autoComplete='current-password'
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant='outlined'
                required
                fullWidth
                name='password2'
                minLength='6'
                value={password2}
                onChange={(e) => onChange(e)}
                label='Confirm your password'
                type='password'
                id='password'
                autoComplete='current-password'
              />
            </Grid>
          </Grid>
          <Button
            type='submit'
            fullWidth
            variant='contained'
            color='primary'
            className={classes.submit}
          >
            Sign Up
          </Button>
          <Grid container justifyContent='flex-end'>
            <Grid item>
              <Link
                to='/sign-in'
                variant='body2'
                className={classes.signUpLink}
              >
                Already have an account? Sign in
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

export default SignUpPage;
