import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
// import {loginUser} from '@store/reducers/auth';
import { setWindowClass } from '@app/utils/helpers';
import { Form, InputGroup } from 'react-bootstrap';
import { PfButton, PfCheckbox } from '@profabric/react-components';
import { useUsuarios } from "../../context/UsuariosContext";
import Usuario from '@app/models/Usuarios';
import { setAuthentication } from '@app/store/reducers/auth';

const Register = () => {
  const [isAuthLoading, setAuthLoading] = useState(false);
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const { usuarios, createUsuario } = useUsuarios();

  const navigate = useNavigate();

  const register = async (email: string, password: string, name: string) => {
    try {
      setAuthLoading(true);
      
      const usuario: Usuario = {
        email: email,
        contrasenia: password,
        _id: '',
        nombre_usuario: name,
        token:''
      };
      const response = await createUsuario(usuario);
      //const response = await authLogin(email, password);
      dispatch(setAuthentication(response as any));
      toast.success('Registration is success');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Failed');
      setAuthLoading(false);
    }
  };


  const { handleChange, values, handleSubmit, touched, errors } = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      passwordRetype: '',
    },
    validationSchema: Yup.object({
      name:Yup.string()
        .min(3, 'Must be 3 characters or more')
        .max(30, 'Must be 30 characters or less')
        .required('Required'),
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string()
        .min(5, 'Must be 5 characters or more')
        .max(30, 'Must be 30 characters or less')
        .required('Required'),
      passwordRetype: Yup.string()
        .min(5, 'Must be 5 characters or more')
        .max(30, 'Must be 30 characters or less')
        .required('Required'),
    }),
    onSubmit: (values) => {
      register(values.email, values.password, values.name);
    },
  });

  setWindowClass('hold-transition register-page');

  return (
    <div className="register-box">
      <div className="card card-outline card-primary">
        <div className="card-header text-center">
          <Link to="/" className="h1">
            <b>Admin</b>
            <span>LTE</span>
          </Link>
        </div>
        <div className="card-body">
          <p className="login-box-msg">{t<string>('register.registerNew')}</p>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <InputGroup className="mb-3">
                <Form.Control
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email"
                  onChange={handleChange}
                  value={values.email}
                  isValid={touched.email && !errors.email}
                  isInvalid={touched.email && !!errors.email}
                />
                {touched.email && errors.email ? (
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                ) : (
                  <InputGroup.Append>
                    <InputGroup.Text>
                      <i className="fas fa-envelope" />
                    </InputGroup.Text>
                  </InputGroup.Append>
                )}
              </InputGroup>
            </div>
            <div className="mb-3">
              <InputGroup className="mb-3">
                <Form.Control
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Password"
                  onChange={handleChange}
                  value={values.password}
                  isValid={touched.password && !errors.password}
                  isInvalid={touched.password && !!errors.password}
                />
                {touched.password && errors.password ? (
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                ) : (
                  <InputGroup.Append>
                    <InputGroup.Text>
                      <i className="fas fa-lock" />
                    </InputGroup.Text>
                  </InputGroup.Append>
                )}
              </InputGroup>
            </div>

            <div className="mb-3">
              <InputGroup className="mb-3">
                <Form.Control
                  id="passwordRetype"
                  name="passwordRetype"
                  type="password"
                  placeholder="Retype password"
                  onChange={handleChange}
                  value={values.passwordRetype}
                  isValid={touched.passwordRetype && !errors.passwordRetype}
                  isInvalid={touched.passwordRetype && !!errors.passwordRetype}
                />

                {touched.passwordRetype && errors.passwordRetype ? (
                  <Form.Control.Feedback type="invalid">
                    {errors.passwordRetype}
                  </Form.Control.Feedback>
                ) : (
                  <InputGroup.Append>
                    <InputGroup.Text>
                      <i className="fas fa-lock" />
                    </InputGroup.Text>
                  </InputGroup.Append>
                )}
              </InputGroup>
            </div>

            <div className="row">
              <div className="col-7">
                <PfCheckbox checked={false}>
                  <span>I agree to the </span>
                  <Link to="/">terms</Link>
                </PfCheckbox>
              </div>
              <div className="col-5">
                <PfButton
                  type="submit"
                  block
                  loading={isAuthLoading}
                  >
                  {t<string>('register.label')}
                </PfButton>
              </div>
            </div>
          </form>

          <Link to="/login" className="text-center">
            {t<string>('register.alreadyHave')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
