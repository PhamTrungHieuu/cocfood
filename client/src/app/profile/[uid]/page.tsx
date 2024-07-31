'use client'
import { Container } from "react-bootstrap";
import '@/styles/profileuserid.css'
import { ChangeEvent, useEffect, useState } from "react";
import axiosInstance from "@/axiosConfig";
import { useParams } from "next/navigation";
import Swal from "sweetalert2";

interface User {
    _id: string;
    firstname: string;
    lastname: string;
    email: string;
    mobile: string;
    address: string;
    avatar: string;
}

const ProfileUserId = () => {
    const [userData, setUserData] = useState<User | null>(null);
    const [isShowEdit, setIsShowEdit] = useState(false);
    const [isShowEditAvatar, setIsShowEditAvatar] = useState(false);
    const [valueEdit, setValueEdit] = useState('');
    const [idEdit, setIdEdit] = useState('');
    const [labelEdit, setLabelEdit] = useState('');
    const [keyEdit, setKeyEdit] = useState('');
    const [valueAvatar, setValueAvatar] = useState<File | null>(null);
    const param = useParams();
    const { uid } = param

    const getUsers = async () => {
        try {
            const response = await axiosInstance.get(`user/current`);
            setUserData(response.data.rs);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        getUsers()
    }, [])

    const changeUser = (uid: string, key: string, value: string, label: string) => {
        setIdEdit(uid);
        setKeyEdit(key)
        setValueEdit(value)
        setLabelEdit(label)
        setIsShowEdit(true)
    }

    const changeUserAvatar = (uid: string, key: string, value: string, label: string) => {
        setIdEdit(uid);
        setKeyEdit(key)
        setLabelEdit(label)
        setIsShowEditAvatar(true)
    }

    const btnCancel = () => {
        setIdEdit('');
        setKeyEdit('')
        setLabelEdit('')
        setValueEdit('')
        setIsShowEdit(false)
        setIsShowEditAvatar(false)
        setValueAvatar(null)
    }

    const handleEdit = (e:ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value
        if (keyEdit === 'mobile') {
            value = value.replace(/[^0-9]/g, '');
            value = value.substring(0, 12);
        }
        setValueEdit(value)
    }

    const handleEditAvatar = (e:ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files;
        if(file)
        setValueAvatar(file[0])
    }

    const btnSubmitEidt = async () => {
        if (valueEdit) {
            try {
                const payload = {
                    [keyEdit]: valueEdit
                };
                const response = await axiosInstance.put(`user/${uid}`, payload);
                if (response.data.success) {
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: `Thay đổi ${labelEdit} thành công`,
                        showConfirmButton: false,
                        timer: 1500
                    });
                    btnCancel()
                } else {
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: `Thay đổi ${labelEdit} không thành công`,
                        showConfirmButton: false,
                        timer: 1500
                    });
                    btnCancel()
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
            getUsers();
        } else {
            Swal.fire({
                title: "Không được để trống",
                icon: "question"
            });
        }
    }

    const btnSubmitEidtAvatar = async () => {
        if (valueAvatar) {
            let timerInterval: NodeJS.Timeout;

            Swal.fire({
                title: "Auto close alert!",
                html: "I will close in <b></b> milliseconds.",
                timer: 2000,
                timerProgressBar: true,
                didOpen: () => {
                    Swal.showLoading();
                    const popup = Swal.getPopup();
                    if (popup) {
                        const timer = popup.querySelector("b") as HTMLElement;
                        timerInterval = setInterval(() => {
                            timer.textContent = `${Swal.getTimerLeft()}`;
                        }, 100);
                    }
                },
                willClose: () => {
                    clearInterval(timerInterval);
                }
            }).then((result) => {
                if (result.dismiss === Swal.DismissReason.timer) {
                    console.log("I was closed by the timer");
                }
            });


            try {
                if (!(valueAvatar instanceof File)) {
                    throw new Error('valueAvatar is not a file object');
                }
                const formData = new FormData();
                formData.append('avatar', valueAvatar);

                const response = await axiosInstance.put(`user/uploadavatar/${uid}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                if (response.data.success) {
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: `Thay đổi ${labelEdit} thành công`,
                        showConfirmButton: false,
                        timer: 1500
                    });
                    btnCancel()
                } else {
                    Swal.fire({
                        position: "center",
                        icon: "error",
                        title: `Thay đổi ${labelEdit} không thành công`,
                        showConfirmButton: false,
                        timer: 1500
                    });
                    btnCancel()
                }
            } catch (error) {
                console.error('Error uploading file:', error);
            }
            getUsers();
        } else {
            Swal.fire({
                title: "Không được để trống",
                icon: "question"
            });
        }
    }

    return (
        <div>
            <Container>
                <div>
                    <div className="header">Hồ sơ của {userData?.firstname}</div>
                    {userData && <div className="profile-box">
                        {isShowEdit && <div className="profile-edit-user">
                            <div className="profile-edit-user-form">
                                <div className="profile-edit-user-label"> {labelEdit} </div>
                                <div className="profile-edit-user-ip">
                                    <input className="profile-edit-user-ip-text" style={{ width: '100%' }} onChange={handleEdit} value={valueEdit}></input>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <button className="profile-edit-user-btn-cancel" onClick={btnCancel}>Quay lại</button>
                                    <button className="profile-edit-user-btn" onClick={btnSubmitEidt}>Submit</button>
                                </div>
                            </div>
                        </div>}
                        {isShowEditAvatar && <div className="profile-edit-user">
                            <div className="profile-edit-user-form">
                                <div className="profile-edit-user-label"> {labelEdit} </div>
                                <div style={{ marginTop: '30px' , background : '#f93' , color : '#ffffff', textAlign: 'center' }}>
                                    Tải ảnh lên
                                    <input type="file" className="profile-edit-user-avatar" style={{ width: '100%' }} onChange={handleEditAvatar} ></input>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <button className="profile-edit-user-btn-cancel" onClick={btnCancel}>Quay lại</button>
                                    <button className="profile-edit-user-btn" onClick={btnSubmitEidtAvatar}>Submit</button>
                                </div>
                            </div>
                        </div>}
                        <div className="profile">
                            <div className="profile-row">
                                <div className="profile-row-lable"> Email: </div>
                                <div className="profile-row-ip">{userData.email}</div>
                            </div>
                            <div className="profile-row">
                                <div className="profile-row-lable"> Mật khẩu: </div>
                                <div className="profile-row-ip">*************</div>
                                <button className="profile-row-edit"> Thay đổi</button>
                            </div>
                            <div className="profile-row">
                                <div className="profile-row-lable"> Tên: </div>
                                <div className="profile-row-ip">{userData.firstname}</div>
                                <button className="profile-row-edit" onClick={() => changeUser(userData._id, 'firstname', userData.firstname, 'Tên')}> Thay đổi</button>
                            </div>
                            <div className="profile-row">
                                <div className="profile-row-lable"> Họ: </div>
                                <div className="profile-row-ip">{userData.lastname}</div>
                                <button className="profile-row-edit" onClick={() => changeUser(userData._id, 'lastname', userData.lastname, 'Họ')}> Thay đổi</button>
                            </div>
                            <div className="profile-row">
                                <div className="profile-row-lable"> Số điện thoại: </div>
                                <div className="profile-row-ip">{userData.mobile}</div>
                                <button className="profile-row-edit" onClick={() => changeUser(userData._id, 'mobile', userData.mobile, 'Số điện thoại')}> Thay đổi</button>
                            </div>
                            <div className="profile-row">
                                <div className="profile-row-lable"> Địa chỉ: </div>
                                {userData.address ? <div className="profile-row-ip profile-row-ip-address">{userData.address}</div>
                                    : <div className="profile-row-ip">Chưa có địa chỉ</div>
                                }
                                <button className="profile-row-edit" onClick={() => changeUser(userData._id, 'address', userData.address || '', 'Địa chỉ')}> Thay đổi</button>
                            </div>
                        </div>
                        <div className="profile-img">
                            <div className="profile-avata">
                                <img className="profile-avata-img" src={userData.avatar}></img>
                            </div>
                            <button style={{ marginLeft: '45%' }} className="profile-row-edit" onClick={() => changeUserAvatar(userData._id, 'avatar', userData.avatar, 'Ảnh đại diện')}> Thay đổi</button>
                        </div>
                    </div>}
                </div>
            </Container>
        </div>
    )
}

export default ProfileUserId;
