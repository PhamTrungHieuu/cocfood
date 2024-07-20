'use client'
import '@/styles/productlist.css'
import axios from 'axios';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Category from '../category/page';
import { useDispatch } from 'react-redux';
import { getCategories } from '@/store/authSilce';
import { AppDispatch } from '@/store/store';

interface Product {
    _id: string,
    title: string;
    price: number;
    images: string[];
    totalRatings: number;
    thumb: string;
}
const ProductList = () => {
    const dispatch = useDispatch<AppDispatch>()
    const [popupText, setPopupText] = useState('Mặc định')
    const [isPopupSort, setIsPopupSort] = useState(false)
    const [listProduct, setListProduct] = useState<Product[]>([])
    const getPrducts = async () =>{
        axios.get('http://localhost:5000/api/product')  // Thay thế bằng API thực tế của bạn
            .then(response => {
                setListProduct(response.data.products);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }
    useEffect(() => {
        getPrducts();
        dispatch(getCategories())
    }, []);

    const formatPrice = (price: Number) => {
        return price.toLocaleString('vi-VN');
    };

    const handlePopupSortMacdinh = () => {
        setPopupText('Mặc định')
        setIsPopupSort(false);
    }

    const handlePopupSortChugiam = () => {
        setPopupText('A → Z')
        setIsPopupSort(false);
    }

    const handlePopupSortChutang = () => {
        setPopupText('Z → A')
        setIsPopupSort(false);
    }

    const handlePopupSortGiatang = () => {
        setPopupText('Giá tăng dần')
        setIsPopupSort(false);
    }

    const handlePopupSortGiagiam = () => {
        setPopupText('Giá giảm dần')
        setIsPopupSort(false);
    }

    const isPopupSortStatus = () => {
        setIsPopupSort(true);
    }

    return (
        <div className='box-productList'>
            <div style={{width: '16%' , position: 'relative'}}>
                <Category ></Category>
            </div>
            <div style={{ width: '84%', marginLeft: '20px' }}>
                {isPopupSort && (
                    <div className='popup-sort'>
                        <div className='popup-sort-btn az' onClick={handlePopupSortMacdinh}>
                            <button className='popup-sort-btn-text'>Mặc định</button>
                        </div>
                        <div className='popup-sort-btn az' onClick={handlePopupSortChutang}>
                            <button className='popup-sort-btn-text'>A → Z</button>
                        </div>
                        <div className='popup-sort-btn za' onClick={handlePopupSortChugiam}>
                            <button className='popup-sort-btn-text'>Z → A</button>
                        </div>
                        <div className='popup-sort-btn giagiam' onClick={handlePopupSortGiatang}>
                            <button className='popup-sort-btn-text'>Giá tăng dần</button>
                        </div>
                        <div className='popup-sort-btn giatang' onClick={handlePopupSortGiagiam}>
                            <button className='popup-sort-btn-text'>Giá giảm dần</button>
                        </div>
                    </div>
                )}
                <div className="productList-category">
                    Sắp xếp:
                    <div className="popup-sort-name" onClick={isPopupSortStatus}>{popupText}</div>
                </div>
                <div className='productList'>
                    {listProduct.map((product, index) => (
                        <Link className='product-item' href={`/productlist/${product._id}`} key={index}>
                            <div className='bi bi-heart-fill icon-like'></div>
                            <div className='productList-product-img'>
                                <img className='productList-product-image' src={product.thumb} />
                            </div>
                            <div className='productlist-name'>{product.title}</div>
                            <div className="productlist-price">
                                <div className="productlist-price-number">{formatPrice(product.price)}</div>
                                <div className="productlist-price-icon">₫</div>
                                <div className="product-evluate">
                                    <div className="star-rating">
                                        <div className="stars" style={{ width: `${(product.totalRatings / 5) * 100}%` }}>
                                            ★★★★★
                                        </div>
                                        <div className="star-overlay">★★★★★</div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div >
    )
}

export default ProductList;
