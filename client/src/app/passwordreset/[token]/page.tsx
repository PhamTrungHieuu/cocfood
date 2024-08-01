'use client'
import { ChangeEvent, useState } from "react";
import { useParams, useRouter } from 'next/navigation';
import Swal from "sweetalert2";
const PasswordReset = () => {
    const router = useRouter()
    const params = useParams();
    const [password, setPassword] = useState('')
    const { token } = params;
    const handleChangePassword = (e:ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setPassword(value)
    }
    const clickSubmitResetPassword = async () => {
        if (!password) {
            Swal.fire('Error', 'Không được để trống mật khẩu', 'error')
        } else if (!validatePassword(password)) {
            Swal.fire('Thất bại', 'Mật khẩu có ít nhất 1 chữ in hoa, 1 chữ thường, 1 chữ số và độ dài tối thiểu 8 kí tự!', 'error')
        }
        else {
            const response = await fetch('http://localhost:5000/api/user/resetpassword', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password, token }),
            });
            const rs = await response.json();
            if (rs.success) {
                await Swal.fire({
                    position: "center",
                    icon: "success",
                    title: `Đặt mật khẩu mới thành công`,
                    showConfirmButton: false,
                    timer: 1500
                });
                router.push('/login')
            }
            else {
                Swal.fire('Error', 'Hết thời gian thay đổi', 'error').then((result) => {
                    if (result.isConfirmed) {
                        router.push('/login');
                    }
                });
            }
        }
    }
    const validatePassword = (password: string) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        return regex.test(password)
    }
    return (
        <div>
            <div className='popup-forgot-passworf' style={{minHeight: '550px'}}>

                <div className="container mt-5">
                    <div className="row">
                        <div className="col-md-6 offset-md-3">
                            <div className="input-group">
                                <input type="email" className="form-control" placeholder="Mật khẩu mới ..." onChange={handleChangePassword} value={password}></input>
                            </div>
                            <div style={{ paddingTop: '5px' }} className='text-danger'>{ } </div>
                            <div className='d-flex justify-content-between mt-3'>
                                <button className="btn btn-primary" type="button" onClick={clickSubmitResetPassword}>Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default PasswordReset;