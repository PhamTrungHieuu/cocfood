'use client'
import Link from 'next/link';
import { FormEvent, MouseEventHandler, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2';
import { AppDispatch } from '@/store/store';
import { login } from '@/store/authSilce';
import { useDispatch } from 'react-redux';
const Login: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const router = useRouter()
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isForgotPassword, setIsForgotPassword] = useState(false);

    const handleChangeUser = (e: React.ChangeEvent<HTMLInputElement>) => {
        const userEmail = e.target.value;
        setEmail(userEmail);
    }
    const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPassword(value);
    }
    const handleSubmitLogin: React.FormEventHandler<HTMLFormElement> = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (email === '') {
            Swal.fire('Thất bại', 'Không được bỏ trống email!', 'error')
        } else if (!validateEmail(email)) {
            Swal.fire('Thất bại', 'Email không đúng định dạng!', 'error')
        } else if (password === '') {
            Swal.fire('Thất bại', 'Không được bỏ trống mật khẩu!', 'error')
        } else if (!validatePassword(password)) {
            Swal.fire('Thất bại', 'Mật khẩu có ít nhất 1 chữ in hoa, 1 chữ thường, 1 chữ số và độ dài tối thiểu 8 kí tự!', 'error')
        } else if (email != "" && password != "") {
            const response = await fetch('http://localhost:5000/api/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            const rs = await response.json();
            if (rs.success) {
                dispatch(login(rs.accsessToken));
                router.push('/')
            } else {
                Swal.fire('Thất bại', 'Tài khoản hoặc mật khẩu không chính xác!', 'error')
            }
        }
    }
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword); // Thay đổi trạng thái của showPassword
    }
    const validateEmail = (email: string) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email)
    }
    const validatePassword = (password: string) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        return regex.test(password)
    }
    const clickForgotPassword: MouseEventHandler<HTMLDivElement> = (event) => {
        setIsForgotPassword(!isForgotPassword);
        setEmail('')
    }
    const clickSubmitResetPassword = async () => {
        if (email === '') {
            Swal.fire('Thất bại', 'Không được bỏ trống email!', 'error')
        } else if (!validateEmail(email)) {
            Swal.fire('Thất bại', 'Email không đúng định dạng!', 'error')
        }
        else {
            const response = await fetch('http://localhost:5000/api/user/forgotpassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            const rs = await response.json();
            if (rs.success) {
                Swal.fire('Thành công', ' Vui lòng check email để đổi mật khẩu', 'success').then((result) => {
                    if (result.isConfirmed) {
                        setIsForgotPassword(false)
                    }
                });
            }
            else {
                Swal.fire('Error', 'Email không đúng', 'error')
            }
        }
    }

    return (
        <div style={{ position: 'relative' }} >
            {isForgotPassword && <div className='popup-forgot-passworf' style={{ position: 'absolute', width: ' 90%', height: '500px', background: 'white', top: '0' }}>
                <div className="container mt-5">
                    <div className="row" >
                        <div className="col-md-6 offset-md-3 justify-content-center d-flex align-items-center" style={{ color: '#f93', borderRadius: '10px', boxShadow: '0 5px 5px 5px #ddd', border: '1px solid #f93', height: '200px' }}>
                            <div style={{ width: '80%' }}>
                                <h3 className='d-flex justify-content-center mb-3'> Quên mật khẩu </h3>
                                <div className="input-group">
                                    <input type="email" className="form-control" placeholder="Email" onChange={handleChangeUser} value={email}></input>
                                </div>
                                {/* <div style={{ paddingTop: '5px' }} className='text-danger'>{mesErrUser} </div> */}
                                <div className='d-flex justify-content-between mt-3'>
                                    <div style={{ cursor: 'pointer' }} className="link-secondary link-offset-2 link-underline link-underline-opacity-0 d-flex justify-content-center" onClick={clickForgotPassword} >Quay lại </div>

                                    <button className="btn btn-primary" type="button" onClick={() => clickSubmitResetPassword()}>Submit</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            }
            <div style={{ border: '1px solid #f93', color: '#f93', width: '40%', margin: '30px auto', padding: '20px 20px', borderRadius: '10px', boxShadow: '0 10px 16px rgba(0, 0, 0, 0.1)' }}  >

                <div style={{ height: '100px', fontSize: '30px', fontWeight: '700' }} className='d-flex justify-content-center align-items-center' >Đăng nhập</div>
                <div className="d-flex justify-content-center">
                    <Form style={{ width: '400px' }} onSubmit={handleSubmitLogin}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Tài khoản </Form.Label>
                            <Form.Control onChange={handleChangeUser} type="text" placeholder="Enter email" />
                            {/* <Form.Label style={{ paddingTop: '5px' }} className='text-danger'>{mesErrUser} </Form.Label> */}
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Mật khẩu </Form.Label>
                            <Form.Control type={showPassword ? "text" : "password"} placeholder="Password" onChange={handleChangePassword} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicCheckbox">
                            <Form.Check type="checkbox" label="Hiển thị mật khẩu" onChange={togglePasswordVisibility} />
                        </Form.Group>
                        <div style={{ height: '100px' }} className="d-flex justify-content-center align-items-center">

                            <Button variant="primary" type="submit">
                                Đăng nhập
                            </Button>
                        </div>
                        <div className='d-flex justify-content-between'>

                            <div style={{ cursor: 'pointer' }} className="link-secondary link-offset-2 link-underline link-underline-opacity-0 d-flex justify-content-center" onClick={clickForgotPassword} >Quên mật khẩu!</div>
                            <Link className="link-secondary link-offset-2 link-underline link-underline-opacity-0 d-flex justify-content-center" href={'/register'}>Đăng ký tài khoản!</Link>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    )
}
export default Login;