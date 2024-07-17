'use client'

import { Button } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from "react";
import axiosInstance from "@/axiosConfig";
import Swal from "sweetalert2";
import Link from "next/link";

interface User {
    _id: string;
    firstname: string;
    lastname: string;
    email: string;
}

const Users = () => {
    // Khai báo kiểu dữ liệu cho useState
    const [userData, setUserData] = useState<User[]>([]);

    const getUsers = async () => {
        try {
            const response = await axiosInstance.get('user');
            setUserData(response.data.users);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        getUsers();
    }, []);
    console.log(userData)
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
    const deleteUser = async(uid :string) => {
        try {
            const response = await axiosInstance.delete(`user/?_id=${uid}`);
            setUserData(response.data.users);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        getUsers();
    }
    return (
        <table className="table table-striped">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">First</th>
                    <th scope="col">Last</th>
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
                        <td>{user.email}</td>
                        <td className="text-center">
                            <Link href = {`/admin/users/${user?._id}`} ><Button variant="primary" size="sm" className="me-2">Edit</Button>
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
    );
};

export default Users;
