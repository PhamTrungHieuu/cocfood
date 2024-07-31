'use client'

import { Button } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { ChangeEvent, useEffect, useState } from "react";
import axiosInstance from "@/axiosConfig";
import Swal from "sweetalert2";
import axios from "axios";
import '@/styles/productpid.css'
interface Category {
    _id: string,
    title: string;
}

const Categorys = () => {
    // Khai báo kiểu dữ liệu cho useState
    const [categoryData, setCategoryData] = useState<Category[]>([])
    const [title, setTitle] = useState('')
    const [isShowCreated, setIsShowCreated] = useState(false)
    const getCategorys = async () => {
        axios.get('http://localhost:5000/api/prodcategory')  // Thay thế bằng API thực tế của bạn
            .then(response => {
                setCategoryData(response.data.prodCategories);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    };

    useEffect(() => {
        getCategorys();
    }, []);
    const deleteCategorybtn = async (cid: string) => {
        Swal.fire({
            title: "Xóa danh mục?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Xóa"
        }).then((result) => {
            if (result.isConfirmed) {
                deleteCategory(cid);
                Swal.fire({
                    title: "Xóa thành công!",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        });
    }
    const deleteCategory = async (cid: string) => {
        try {
            const response = await axiosInstance.delete(`prodcategory/${cid}`);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        getCategorys();
    }
    const clickSearchProduct = (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()
        getCategorys()
    }
    const handleEdit = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setTitle(value)
    }

    const btnCancel = () => {
        setTitle('')
        setIsShowCreated(false)
    }
    const btnSubmitCreatedCategory = async () => {
        if (title) {
            const response = await axiosInstance.post('prodcategory', { title: title })
            if (response.data?.success) {
                await Swal.fire({
                    position: "center",
                    icon: "success",
                    title: `Thêm danh mục mới thành công`,
                    showConfirmButton: false,
                    timer: 1500
                });
                btnCancel()
                getCategorys()
            }else{
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: `Danh mục đã tồn tại`,
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        }
    }
    return (
        <div style={{ minHeight: '500px', position: 'relative' }}>
            {isShowCreated &&
                <div style={{ position: 'absolute', zIndex: '10', width: '100%', height: '100%', background: '#ffffff', textAlign: 'center', paddingTop: '30px', color: '#f93', fontSize: '18px', fontWeight: '500' }}>
                    <div className="profile-product-edit-product">
                        <div className="profile-product-edit-product-form">
                            <div className="profile-product-edit-product-label">Tên danh mục mới </div>

                            <div className="profile-product-edit-product-ip">
                                <input className="profile-product-edit-product-ip-text" style={{ width: '100%' }} onChange={handleEdit} value={title}></input>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <button className="profile-product-edit-product-btn-cancel" onClick={btnCancel} >Quay lại</button>
                                <button className="profile-product-edit-product-btn" onClick={btnSubmitCreatedCategory}>Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
            }
            <nav className="navbar justify-content-between">
                <form className="form-inline d-flex" onSubmit={clickSearchProduct}>
                    {/* <input className="form-control mr-sm-2" type="search" placeholder="Tìm kiếm sản phẩm..." aria-label="Search" onChange={(e) => setTitleProduct(e.target.value)} /> */}
                    <button style={{ marginLeft: '20px', width: '200px' }} className="btn btn-outline-success my-2 my-sm-0" type="submit">Tìm kiếm </button>
                </form>
                <Button variant="success" size="lg" className="me-2 mt-2" onClick={() => (setIsShowCreated(true))}>Thêm danh mục sản phẩm mới </Button>
            </nav>
            {categoryData?.length > 0 ? <table className="table table-striped">
                <thead>
                    <tr className="text-center align-middle">
                        <th scope="col">#</th>
                        <th scope="col">Tên</th>
                        <th scope="col" className="text-center">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {categoryData?.length > 0 && categoryData.map((category, index) => (
                        <tr key={category?._id} className="text-center align-middle">
                            <th scope="row">{index + 1}</th>
                            <td>{category.title}</td>
                            <td className="text-center align-middle">
                                {/* <Link href={`/admin/products/${category?._id}`}>
                                    <Button variant="primary" size="sm" className="me-2">Edit</Button>
                                </Link> */}
                                <Button variant="danger" size="sm" onClick={() => deleteCategorybtn(category._id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}

                </tbody>
            </table>
                :
                <div style={{ height: '100%', textAlign: 'center', color: '#f93', fontSize: '25px', paddingTop: '100px' }}> Không có sản phẩm nào!</div>
            }
        </div>

    );
};

export default Categorys;
