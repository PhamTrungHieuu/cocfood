'use client'
import { ChangeEvent, useEffect, useRef, useState } from "react";
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
import Link from "next/link";
interface Product {
    _id: string;
    title: string;
    price: number;
    description: string;
    images: string[];
    totalRatings: number;
    brand: string;
    thumb: string;
    category: string;
    ratings: [{
        star: number,
        comment: string
    }];
    sale: number;
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
    const [similarProduct, setSimilarProduct] = useState<Product[]>([]);
    const [countStar, setCountStar] = useState<number>(5)
    const [comment, setComment] = useState('')
    const [isUserBuyProduct, setIsUserBuyProduct] = useState(false)
    const productListRef = useRef<HTMLDivElement>(null);

    const getProduct = () => {
        axios.get(`http://localhost:5000/api/product/?_id=${pid}`)
            .then(response => {
                setProduct(response.data.products[0]);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }
    const getSimilarProduct = () => {
        axios.get(`http://localhost:5000/api/product`, {
            params: { category: product?.category }
        })
            .then(response => {
                setSimilarProduct(response.data.products);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }
    const checkUserBuyProduct = async () => {
        if (isLoggedIn) {
            const response = await axiosInstance.get('order/check', { params: { pid: pid } })
            setIsUserBuyProduct(response.data.success)
        }
    }
    useEffect(() => {
        getProduct()
        checkUserBuyProduct()
    }, [pid]);
    useEffect(() => {
        getSimilarProduct()
    }, [product])

    const handleChangeQuantity = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '');
        setQuantity(parseInt(value, 10) || 0);
        if (quantity == null) {
            setQuantity(1)
        }
    }
    const handleBlur = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.value === '' || parseInt(e.target.value, 10) < 1) {
            setQuantity(1);
        }
    };
    const handleQuantityTru = () => {
        if (quantity > 1) {
            const value = quantity
            setQuantity(value - 1);
        }
    }
    const handleQuantityCong = () => {
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
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: `Thêm sản phẩm thành công`,
                    showConfirmButton: false,
                    timer: 1000
                });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    const handleClickStar = (index: number) => {
        setCountStar(index);
    };
    const handleComment = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value
        setComment(value);
    };
    const clickHanleRatings = async (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        const payload = {
            star: countStar,
            comment: comment,
            pid: pid
        }
        const reponse = await axiosInstance.put('http://localhost:5000/api/product/ratings', payload)
        if (reponse.data?.success) {
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Đánh giá thành công",
                showConfirmButton: false,
                timer: 1000
            });
            setComment('')
            getProduct()
        }
    }
    const clickOrderNow = async () => {
        if (isLoggedIn) {
            const payload = {
                quantity: quantity,
                pid: pid,
            }
            const response = await axiosInstance.post('order/now', payload)
            if (response.data?.success) {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Đặt hàng thành công",
                    showConfirmButton: false,
                    timer: 1000
                });
            }
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
    const scrollLeft = () => {
        if (productListRef.current) {
            productListRef.current.scrollBy({ left: -248, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (productListRef.current) {
            productListRef.current.scrollBy({ left: 248, behavior: 'smooth' });
        }
    };
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
                            {product?.sale == 0 ?
                                <div style={{ display: 'flex' }} >
                                    <div className="detail-product-price-number">{product ? formatPrice(product.price) : ''}</div>
                                    <div className="detail-product-price-icon">₫</div>
                                </div>
                                :
                                <div style={{ display: 'flex' }}>
                                    <div className="detail-product-price-number">{product ? formatPrice(product.price * (1 - product.sale / 100)) : ''}</div>
                                    <div className="detail-product-price-icon">₫</div>
                                    <div className="detail-product-price-sale">{product ? formatPrice(product.price) : ''}</div>
                                    <div className="detail-product-price-sale">₫</div>
                                </div>
                            }
                        </div>
                        <div className="detail-product-describe"> Mô tả sản phẩm </div>
                        <div className="detail-product-describe-text"> {product?.description} </div>
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
                                <button className="detail-option-btn-pay bi bi-plus-circle-fill" onClick={clickOrderNow}> Mua ngay</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="product-ratings-box">
                    <div className="product-ratings">
                        <div className="product-start-all">
                            Tổng đánh giá:
                            <div className="product-evluate">
                                <div className="star-rating">
                                    <div className="stars" style={{ width: `${((product?.totalRatings ? product?.totalRatings : 0) / 5) * 100}%` }}>
                                        ★★★★★
                                    </div>
                                    <div className="star-overlay">★★★★★</div>
                                </div>
                            </div>
                        </div>
                        <form className="product-form-ratings" onSubmit={clickHanleRatings}>
                            <div className="product-form-ratings-star">
                                <div className="product-form-ratings-star-label">
                                    Chất lượng sản phẩm:
                                </div>
                                <div className=''>
                                    {Array.from({ length: 5 }, (_, index) => (
                                        <span
                                            key={index}
                                            className={index < countStar ? 'starFilled' : 'star'}
                                            onClick={() => handleClickStar(index + 1)}
                                        >
                                            ★
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="product-form-ratings-input">
                                <textarea
                                    className='product-form-ratings-input-text'
                                    rows={5} // Bạn có thể điều chỉnh số lượng hàng mặc định theo nhu cầu của mình
                                    onChange={(e) => handleComment(e)}
                                    value={comment}
                                    placeholder="Nhập comment..."
                                ></textarea>
                            </div>
                            <button type="submit" className="product-form-ratings-btn" disabled={!isUserBuyProduct} >Đánh giá</button>
                        </form>

                    </div>
                    <div className="product-ratings-list-box">
                        <div className="product-ratings-list-label">
                            Danh sách đánh giá
                        </div>
                        <div className="product-ratings-list">
                            {product?.ratings && product?.ratings.map((rating, index) => (

                                <div className="product-rating-list-star-comment" key={index}>
                                    <div className="product-rating-list-star">
                                        {Array.from({ length: 5 }, (_, index) => (
                                            <span
                                                key={index}
                                                className={index < rating.star ? 'starFilled' : 'star'}
                                            >
                                                ★
                                            </span>
                                        ))}
                                    </div>
                                    <div className="product-rating-list-comment">
                                        Comment: {rating.comment}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="similar-product-box">
                    <div className="similar-product-label">Sản phẩm tương tự </div>
                    <div className="bi bi-arrow-left-circle btn-scroll-left" onClick={scrollLeft}>
                    </div>
                    <div className="bi bi-arrow-right-circle btn-scroll-right" onClick={scrollRight}>
                    </div>
                    <div className="similar-product" ref={productListRef}>
                        {similarProduct.map((product, index) => (
                            <Link className='similar-product-item-sale' href={`/productlist/${product._id}`} key={index}>
                                {product.sale != 0 && <div className='product-item-sales'> giảm {product.sale}% </div>}
                                <div className='bi bi-heart-fill icon-like'></div>
                                <div className='similar-product-product-img'>
                                    <img className='similar-product-product-image' src={product.thumb} />
                                </div>
                                <div className='similar-product-name'>{product.title}</div>
                                {product.sale == 0 ?
                                    <div className="similar-product-price">
                                        <div className="similar-product-price-number">{formatPrice(product.price)}</div>
                                        <div className="similar-product-price-icon">₫</div>
                                    </div>
                                    :
                                    <div style={{ display: 'flex' }}>
                                        <div className="similar-product-price">
                                            <div className="similar-product-price-number">{formatPrice(product.price * (1 - product.sale / 100))}</div>
                                            <div className="similar-product-price-icon">₫</div>
                                        </div>
                                        <div className="similar-product-price">
                                            <div className="similar-product-price-sales">{formatPrice(product.price)}</div>
                                            <div className="similar-product-price-sales">₫</div>
                                        </div>
                                    </div>

                                }
                                <div className="product-evluate">
                                    <div className="star-rating">
                                        <div className="stars" style={{ width: `${(product.totalRatings / 5) * 100}%` }}>
                                            ★★★★★
                                        </div>
                                        <div className="star-overlay">★★★★★</div>
                                    </div>
                                </div>
                                {/* </div> */}
                            </Link>
                        ))}

                    </div>
                </div>

            </div>
        </div>
    )
}
export default Product;