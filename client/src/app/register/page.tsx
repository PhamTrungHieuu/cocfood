'use client'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Container } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form'
import Swal from 'sweetalert2';
const Register = () => {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [firstname, setFirstname] = useState('')
    const [lastname, setLastname] = useState('')
    const [mobile, setMobile] = useState('')
    const [address, setAddress] = useState('')
    const handleUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
        var value = e.target.value;
        setEmail(value);
    }
    const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        var value = e.target.value;
        setPassword(value);
    }
    const handleFirstname = (e: React.ChangeEvent<HTMLInputElement>) => {
        var value = e.target.value;
        setFirstname(value);
    }
    const handleLastname = (e: React.ChangeEvent<HTMLInputElement>) => {
        var value = e.target.value;
        setLastname(value);
    }
    const handlePhonenumber = (e: React.ChangeEvent<HTMLInputElement>) => {
        var value = e.target.value;
        const numericValue = value.replace(/[^0-9]/g, '');
        setMobile(numericValue);
    }
    const handleAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
        var value = e.target.value;
        setAddress(value);
    }
    const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (email === '') {
            Swal.fire('Thất bại', 'Không được bỏ trống email!', 'error')
        }
        else if (!validateEmail(email)) {
            Swal.fire('Thất bại', 'Email không đúng định dạng!', 'error')
        }
        else if (password === '') {
            Swal.fire('Thất bại', 'Không được bỏ trống mật khẩu!', 'error')
        }
        else if (!validatePassword(password)) {
            Swal.fire('Thất bại', 'Mật khẩu có ít nhất 1 chữ in hoa, 1 chữ thường, 1 chữ số và độ dài tối thiểu 8 kí tự!', 'error')
        }
        else if (!firstname) {
            Swal.fire('Thất bại', 'Không được bỏ trống firstname!', 'error')
        }
        else if (!lastname) {
            Swal.fire('Thất bại', 'Không được bỏ trống lastname!', 'error')
        }
        else if (!mobile) {
            Swal.fire('Thất bại', 'Không được bỏ trống số điện thoại!', 'error')
        }
        else if (!address) {
            Swal.fire('Thất bại', 'Không được bỏ trống số địa chỉ!', 'error')
        }
        else {
            const userData = {
                email,
                password,
                firstname,
                lastname,
                mobile,
                address,
            }
            try {
                // Thay URL bằng API thực tế của bạn
                const response = await fetch('http://localhost:5000/api/user/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(userData),
                    credentials: 'include'
                });

                const rs = await response.json();
                if (rs.success) {
                    Swal.fire('Check', rs.mes, 'success').then((result) => {
                        if (result.isConfirmed) {
                            router.push('/login')
                        }
                    })
                } else {
                    Swal.fire('Thất bại', 'Email đã tồn tại!', 'error')
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Có lỗi xảy ra!');
            }
        }
    }
    const validateEmail = (email: string) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email)
    }
    const validatePassword = (password: string) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        return regex.test(password)
    }
    return (
        <div>
            <div style={{ color: '#f93', border: '1px solid #f93', width: '40%', margin: '30px auto', padding: '20px 20px', borderRadius: '10px', boxShadow: '0 10px 16px rgba(0, 0, 0, 0.1)' }}  >
                <div style={{ height: '100px', fontSize: '30px', fontWeight: '700' }} className='d-flex justify-content-center align-items-center' >Đăng ký</div>
                <div className="d-flex justify-content-center">
                    <Form style={{ width: '400px' }} onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="username">
                            <Form.Label>Tài khoản </Form.Label>
                            <Form.Control type="text" placeholder="Nhập email" onChange={handleUsername} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label>Mật khẩu </Form.Label>
                            <Form.Control type="text" placeholder="Mật khẩu" onChange={handlePassword} />
                        </Form.Group>
                        <div className='d-flex justify-content-between'>
                            <Form.Group className="mb-3 me-3" controlId="">
                                <Form.Label>First name </Form.Label>
                                <Form.Control type="text" placeholder="" onChange={handleFirstname} />
                            </Form.Group>
                            <Form.Group className="mb-3 ms-3" controlId="">
                                <Form.Label>Last name </Form.Label>
                                <Form.Control type="text" onChange={handleLastname} />
                            </Form.Group>
                        </div>

                        <Form.Group className="mb-3" controlId="">
                            <Form.Label>Số điện thoại  </Form.Label>
                            <Form.Control type="text" value={mobile} onChange={handlePhonenumber} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="">
                            <Form.Label>Địa chỉ  </Form.Label>
                            <Form.Control type="text" value={address} onChange={handleAddress} />
                        </Form.Group>
                        <div className='d-flex justify-content-between'>
                            <div className="d-flex justify-content-center align-items-center">

                                <Button variant="primary" type="submit">
                                    Đăng ký
                                </Button>
                            </div>
                            <Link className="link-secondary link-offset-2 link-underline link-underline-opacity-0 d-flex justify-content-center" href={'/login'}>Đã có tài khoản!</Link>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    )
}
export default Register;