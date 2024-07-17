'use client'
import axiosInstance from '@/axiosConfig';
import { fetchUserData } from '@/store/authSilce';
import { AppDispatch, RootState } from '@/store/store';
import '@/styles/cart.css'
import { useRouter } from 'next/navigation';
import { it } from 'node:test';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import Swal from 'sweetalert2';
interface Cart {
    _id: string;
    product: {
        _id: string;
        title: string;
        price: number
        thumb: string;
    }
    price: number;
    quantity: number;
}
const Cart = () => {
    const router = useRouter()
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const localData = useSelector((state: RootState) => state.auth);
    const [quantity, setQuantity] = useState(0);
    const [dataCart, setDataCart] = useState<Cart[]>([])
    const [sumPrice, setSumPrice] = useState(0);
    const dispatch = useDispatch<AppDispatch>();
    const fetchData = async () => {
        try {
            const response = await axiosInstance.get('user/cart');
            setDataCart(response.data.dataCart.cart);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    useEffect(() => {
        setIsLoggedIn(localData.isLoggedIn)
    }, [localData])
    useEffect(() => {
        fetchData();
    }, []);
    useEffect(() => {
        const total = dataCart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
        setSumPrice(total);
    }, [dataCart]);
    const handleChangeQuantity = async (e, pid: string) => {
        const value = e.target.value.replace(/\D/g, '');
        const newValue = value === '' ? '0' : value;
        const newQuantity = parseInt(newValue, 10);
        setDataCart((prevCart) =>
            prevCart.map((item) =>
                item.product._id === pid
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        );
    };
    const handleBlur = async (e, pid: string) => {
        const cartItem = dataCart.find(item => item.product._id === pid);
        if (cartItem) {
            if (cartItem?.quantity === 0)
                deleteCart(pid)
            else
                updateCart(pid, cartItem.quantity, true)
        }
    };
    const handleQuantity = async (congtru: number, pid: string) => {
        if (congtru === 0) {
            deleteCart(pid)
        }
        else
            updateCart(pid, congtru, false);
    }
    const updateCart = async (pid: string, quantity: number, isInput: boolean) => {
        try {
            const response = await axiosInstance.put('user/cart', { pid: pid, quantity: quantity, isInput: isInput });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        fetchData();
    }
    const deleteCart = async (pid: string) => {
        try {
            const response = await axiosInstance.delete('user/cart', { data: { pid: pid } });
            // if (response.data.success) {
                toast.error('Xóa sản phẩn thành công!', { autoClose: 1000 });
            // }
        } catch (error) {
            console.error('Error detele cart:', error);
        }
        fetchData();
        dispatch(fetchUserData());
    }
    const formatPrice = (price: number) => {
        return price.toLocaleString('vi-VN');
    };
    return (
        <div>
            {true && <div className="cart-container">
                <div className="cart-table">
                    <div className="cart-table-header">
                        <div className="cart-table-product">Thông tin sản phẩm </div>
                        <div className="cart-table-price">Đơn giá </div>
                        <div className="cart-table-quantity">số lượng</div>
                        <div className="cart-table-sum-price-product">Thành tiền</div>
                    </div>
                    {dataCart && dataCart.map(item => (
                        <div className="cart-table-body">
                            <div className="cart-table-body-product">
                                <div className="cart-table-body-product-img">
                                    <img className="cart-table-body-product-img-img" src={item.product.thumb}></img>
                                </div>
                                <div className="cart-table-body-product-name">
                                    <div className="cart-table-body-product-name-text">
                                        {item.product.title}
                                    </div>
                                    <div className="cart-table-body-product-delete" onClick={() => deleteCart(item.product._id)}>
                                        Xóa
                                    </div>
                                </div>
                            </div>
                            <div className="cart-table-body-product-price">
                                {formatPrice(item.product.price)}
                            </div>
                            <div className="cart-table-body-product-quantity">
                                <div className="detail-option-quantity-change">
                                    <button className="detail-option-tru"
                                        onClick={() => handleQuantity(item.quantity === 1 ? 0 : -1, item.product._id)}
                                    >-</button>
                                    <input className="detail-option-ip"
                                        value={item.quantity}
                                        onChange={(e) => handleChangeQuantity(e, item.product._id)}
                                        onBlur={(e) => handleBlur(e, item.product._id)}
                                    ></input>
                                    <button className="detail-option-cong"
                                        onClick={() => handleQuantity(1, item.product._id)}
                                    >+</button>

                                </div>
                            </div>
                            <div className="cart-table-body-product-sum-price">
                                {formatPrice(item.product.price * item.quantity)}
                            </div>
                        </div>
                    ))}
                </div>
                <div className='box-sum-price'>
                    <button className='btn-oder'>Đặt hàng </button>
                    <div className='sum-price-number'>
                        Tổng tiền: {formatPrice(sumPrice)}
                        <div className="sum-price-icon">₫</div>
                    </div>
                </div>
            </div>}
            <ToastContainer></ToastContainer>
        </div>
    )
}

export default Cart;