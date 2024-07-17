'use client'
import { useEffect, useState } from "react";
import React from 'react';
import '@/styles/product.css';
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import axiosInstance from "@/axiosConfig";
import { toast, ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { fetchUserData } from "@/store/authSilce";
interface Product {
    _id: string;
    title: string;
    price: number;
    slug: string;
    images: string[];
    totalRatings: number;
    brand: string;
    thumb: string;
}
const Product = () => {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter()
    const localData = useSelector((state: RootState) => state.auth);
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    useEffect(() => {
        setIsLoggedIn(localData.isLoggedIn)
    }, [localData])
    const param = useParams();
    const { pid } = param
    const [quantity, setQuantity] = useState(1);
    const [product, setProduct] = useState<Product | null>(null);
    useEffect(() => {
        axios.get(`http://localhost:5000/api/product/?_id=${pid}`)  // Thay thế bằng API thực tế của bạn
            .then(response => {
                setProduct(response.data.products[0]);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, [pid]);

    const handleChangeQuantity = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        setQuantity(value);
        if (quantity == null) {
            setQuantity(1)
        }
    }
    const handleBlur = (e) => {
        if (e.target.value === '' || parseInt(e.target.value, 10) < 1) {
            setQuantity(1);
        }
    };
    const handleQuantityTru = (e) => {
        if (quantity > 1) {
            const value = quantity
            setQuantity(value - 1);

        }
    }
    const handleQuantityCong = (e) => {
        const value = quantity
        setQuantity(value + 1);
    }
    const formatPrice = (price: Number) => {
        return price.toLocaleString('vi-VN');
    };
    const handleAddCart = async () => {
        if (isLoggedIn) {
            await updateCart(pid.toString(), quantity, false);
            dispatch(fetchUserData());
        } else {
            Swal.fire({
                title: "Chưa đăng nhập",
                text: "Đăng nhập để thêm sản phẩm vào giỏ hàng!",
                icon: "warning",
                showCancelButton: true,
                cancelButtonColor: "#d33",
                confirmButtonColor: "#f93",
                confirmButtonText: "Đăng nhập ngay!",
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    router.push('/login')
                }
            });
        }
    }
    const updateCart = async (pid: string, quantity: number, isInput: boolean) => {
        try {
            const response = await axiosInstance.put('user/cart', { pid: pid, quantity: quantity, isInput: isInput });
            if (response.data.success)
                toast.success('Thêm giỏ hàng thành công!', { autoClose: 1000 });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    return (
        <div>

            <div className="detail-box">
                <div className="detail-product">
                    <div className="detail-img">
                        <img className="detail-product-img" src={product?.thumb} ></img>
                    </div>
                    <div className="detail-info">
                        <div className="detail-product-name"> {product?.title} </div>
                        <div className="detail-product-trademark">
                            <div className="detail-product-trademark-lable">Thuơng hiệu: </div>
                            <div className="detail-product-trademark-text"> {product?.brand} </div>
                        </div>
                        <div className="detail-product-price">
                            <div className="detail-product-price-number">{product ? formatPrice(product.price) : ''}</div>
                            <div className="detail-product-price-icon">₫</div>
                        </div>
                        <div className="detail-product-describe"> Mô tả sản phẩm </div>
                        <div className="detail-product-describe-text"> {product?.slug} </div>
                        <div className="detail-option">
                            <div className="detail-option-quantity">
                                <div className="detail-option-quantity-change">
                                    <button className="detail-option-tru"
                                        onClick={handleQuantityTru}
                                    >-</button>
                                    <input className="detail-option-ip"
                                        value={quantity}
                                        onChange={handleChangeQuantity}
                                        onBlur={handleBlur}
                                    ></input>
                                    <button className="detail-option-cong"
                                        onClick={handleQuantityCong}
                                    >+</button>

                                </div>
                            </div>
                            <div className="detail-option-cart">
                                <button className="detail-option-btn-cart bi bi-cart-plus" onClick={(e) => handleAddCart()}> Thêm vào giỏ hàng</button>
                            </div>
                            <div className="detail-option-pay">
                                <button className="detail-option-btn-pay bi bi-plus-circle-fill"> Mua ngay</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}
export default Product;