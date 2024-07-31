'use client'

import { Button } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { ChangeEvent, useEffect, useState } from "react";
import axiosInstance from "@/axiosConfig";
import Swal from "sweetalert2";
import Link from "next/link";
import axios from "axios";

interface Product {
    _id: string,
    title: string;
    price: number;
    images: string[];
    totalRatings: number;
    thumb: string;
    sale: number;
}

const Products = () => {
    // Khai báo kiểu dữ liệu cho useState
    const [productData, setProductData] = useState<Product[]>([])
    const [titleProduct, setTitleProduct] = useState('')
    const getProducts = async () => {
        const params :{[key:string] : string} = {}
        if(titleProduct)
            params.title = titleProduct
        axios.get('http://localhost:5000/api/product', {params})  // Thay thế bằng API thực tế của bạn
            .then(response => {
                setProductData(response.data.products);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    };

    useEffect(() => {
        getProducts();
    }, []);
    const deleteProductbtn = async (uid: string) => {
        Swal.fire({
            title: "Xóa sản phẩm?",
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
            const response = await axiosInstance.delete(`product/${uid}`);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        getProducts();
    }
    const clickSearchProduct = (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()
        getProducts()
    }
    return (
        <div style={{ minHeight: '500px' }}>
            <nav className="navbar justify-content-between">
                <form className="form-inline d-flex" onSubmit={clickSearchProduct}>
                    <input className="form-control mr-sm-2" type="search" placeholder="Tìm kiếm sản phẩm..." aria-label="Search" onChange={(e) => setTitleProduct(e.target.value)}/>
                    <button style={{marginLeft: '20px', width: '200px'}} className="btn btn-outline-success my-2 my-sm-0" type="submit">Tìm kiếm </button>
                </form>
                <Link href={`/admin/products/created`}>
                    <Button variant="success" size="lg" className="me-2 mt-2">Tạo sản phẩm mới </Button>
                </Link>
            </nav>
            {productData?.length > 0 ? <table className="table table-striped">
                <thead>
                    <tr className="text-center align-middle">
                        <th scope="col">#</th>
                        <th scope="col"> Ảnh </th>
                        <th scope="col">Tên sản phẩm </th>
                        <th scope="col"> Giá </th>
                        <th scope="col">Khuyến mãi</th>
                        <th scope="col" className="text-center">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {productData?.length > 0 && productData.map((product, index) => (
                        <tr key={product?._id} className="text-center align-middle">
                            <th scope="row">{index + 1}</th>
                            <td>
                                <img style={{ height: '100px' }} src={product.thumb} alt={product.title} />
                            </td>
                            <td>{product.title}</td>
                            <td>{product.price}</td>
                            <td>{product.sale}%</td>
                            <td className="text-center align-middle">
                                <Link href={`/admin/products/${product?._id}`}>
                                    <Button variant="primary" size="sm" className="me-2">Edit</Button>
                                </Link>
                                <Button variant="danger" size="sm" onClick={() => deleteProductbtn(product._id)}>Delete</Button>
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

export default Products;
