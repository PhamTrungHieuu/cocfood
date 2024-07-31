'use client'

import { Button } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { ChangeEvent, useEffect, useState } from "react";
import axiosInstance from "@/axiosConfig";
import Swal from "sweetalert2";
import Link from "next/link";

interface User {
    _id: string;
    firstname: string;
    lastname: string;
    email: string;
    mobile: string;
}

const Users = () => {
    // Khai báo kiểu dữ liệu cho useState
    const [userData, setUserData] = useState<User[]>([]);
    const [firstNameUser, setFirstNameUser] = useState('');

    const getUsers = async () => {
        const params: { [key: string]: string } = {}
        if (firstNameUser)
            params.firstname = firstNameUser
        const response = await axiosInstance.get('user', { params });
        if (response.data.success)
            setUserData(response.data.users);
    };

    useEffect(() => {
        getUsers();
    }, []);
    const deleteUserbtn = async (uid: string) => {
        Swal.fire({
            title: "Xóa tài khoản?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Xóa"
        }).then((result) => {
            if (result.isConfirmed) {
                deleteUser(uid);
                Swal.fire({
                    title: "Xóa thành công!",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        });
    }
    const deleteUser = async (uid: string) => {
        try {
            const response = await axiosInstance.delete(`user/${uid}`);
            setUserData(response.data.users);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        getUsers();
    }
    const clickSearchUser = (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()
        getUsers();
    }
    return (
        <div style={{ minHeight: '500px' }}>
            <nav className="navbar justify-content-between">
                <form className="form-inline d-flex" onSubmit={clickSearchUser}>
                    <input className="form-control mr-sm-2" type="search" placeholder="Nhập tên người dùng..." aria-label="Search" onChange={(e) => setFirstNameUser(e.target.value)} />
                    <button style={{ marginLeft: '20px', width: '200px' }} className="btn btn-outline-success my-2 my-sm-0" type="submit">Tìm kiếm </button>
                </form>
            </nav>
            {userData?.length > 0 ? <table className="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Tên </th>
                        <th scope="col">Họ </th>
                        <th scope="col">số điện thoại </th>
                        <th scope="col">Tên tài khoản</th>
                        <th scope="col" className="text-center">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {userData?.length > 0 ? userData.map((user, index) => (
                        <tr key={user?._id}>
                            <th scope="row">{index + 1}</th>
                            <td>{user.firstname}</td>
                            <td>{user.lastname}</td>
                            <td>{user.mobile}</td>
                            <td>{user.email}</td>
                            <td className="text-center">
                                <Link href={`/admin/users/${user?._id}`} ><Button variant="primary" size="sm" className="me-2">Edit</Button>
                                </Link>
                                <Button variant="danger" size="sm" onClick={() => deleteUserbtn(user._id)}>Delete</Button>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td className="text-center">No users found</td>
                        </tr>
                    )}
                </tbody>
            </table>
                :
                <div style={{ height: '100%', textAlign: 'center', color: '#f93', fontSize: '25px', paddingTop: '100px' }}> Không có User nào!</div>
            }
        </div>
    );
};

export default Users;
