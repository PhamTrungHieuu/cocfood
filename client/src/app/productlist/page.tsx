'use client'
import '@/styles/productlist.css'
import axios from 'axios';
import { ChangeEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import Category from '../category/page';
import { useDispatch } from 'react-redux';
import { getCategories } from '@/store/authSilce';
import { AppDispatch, RootState } from '@/store/store';
import { useSelector } from 'react-redux';
import { title } from 'process';
import { useSearchParams } from 'next/navigation';

interface Product {
    _id: string,
    title: string;
    price: number;
    images: string[];
    totalRatings: number;
    thumb: string;
    sale: number;
}
const ProductList = () => {
    const dispatch = useDispatch<AppDispatch>()
    const [popupText, setPopupText] = useState('Mặc định')
    const [isPopupSort, setIsPopupSort] = useState(false)
    const [valueQuery, setValueQuery] = useState()
    const [valueQueryCategory, setValueQueryCategory] = useState('')
    const [showCategory, setShowCategory] = useState('Tất cả')
    const [valueQuerySort, setValueQuerySort] = useState('')
    const [valueQueryTitle, setValueQueryTitle] = useState('')
    const [valueQuerySale, setValueQuerySale] = useState(false)
    const [listProduct, setListProduct] = useState<Product[]>([])
    const categories = useSelector((state: RootState) => state.auth.categories);
    const [countPageTotal, setCountPageTotal] = useState(Number)
    const [countPage, setCountPage] = useState(1)
    const [countPageInput, setCountPageInput] = useState(1)
    const searchParams = useSearchParams();
    const getProduct = async () => {

        const params: { [key: string]: string } = {
        };
        params.limit = '10'
        if (valueQueryTitle) {
            params.slug = valueQueryTitle;
        }
        if (valueQueryCategory) {
            params.category = valueQueryCategory
        }
        if (valueQuerySort) {
            params.sort = valueQuerySort
        }
        if (countPage) {
            params.page = countPage.toString()
        }
        axios.get(`http://localhost:5000/api/product`, { params })  // Thay thế bằng API thực tế của bạn
            .then(response => {
                setListProduct(response.data.products);
                setCountPageTotal(response.data.counts);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }
    useEffect(() => {
        dispatch(getCategories())
    }, []);
    useEffect(() => {
        getProduct();
    }, [valueQueryTitle, valueQueryCategory, valueQuerySort, countPage]);
    useEffect(() => {
        setValueQueryTitle(searchParams.get('title') || '');
    }, [searchParams]);
    const formatPrice = (price: Number) => {
        return price.toLocaleString('vi-VN');
    };

    const handlePopupSortMacdinh = () => {
        setPopupText('Mặc định')
        setIsPopupSort(false);
        setValueQuerySort('')
    }

    const handlePopupSortChutang = () => {
        setPopupText('A → Z')
        setIsPopupSort(false);
        setValueQuerySort('title')
    }
    const handlePopupSortChugiam = () => {
        setPopupText('Z → A')
        setIsPopupSort(false);
        setValueQuerySort('-title')
    }


    const handlePopupSortGiatang = () => {
        setPopupText('Giá tăng dần')
        setIsPopupSort(false);
        setValueQuerySort('price')
    }

    const handlePopupSortGiagiam = () => {
        setPopupText('Giá giảm dần')
        setValueQuerySort('-price')
        setIsPopupSort(false);
    }
    const handlePopupSortSale = () => {
        setPopupText('Khuyến mãi')
        setValueQuerySort('-sale')
        setIsPopupSort(false);

    }
    const onClickCategory = (title: string) => {
        if (title === '') {
            setValueQueryCategory('')
            setShowCategory('Tất cả')
        }
        else {
            setValueQueryCategory(title)
            setShowCategory(title)
        }
    }

    const onClickHandlePage = (number: number) => {
        let rs = countPage + +number
        if (rs === 0) {
            setCountPage(1)
            setCountPageInput(1)
        }
        else
            if ((rs - 1) * 10 > countPageTotal) {
                setCountPage(rs - 1)
                setCountPageInput(rs - 1)
            }
            else {
                setCountPage(rs)
                setCountPageInput(rs)
            }
    }
    const handleCountPage = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        const valuePage = parseInt(value, 10) || 0
        setCountPageInput(valuePage)
    }
    const handleBlurCountPage = () => {
        if (countPageInput === 0) {
            setCountPage(1)
            setCountPageInput(1)
        } else if ((countPageInput - 1) * 10 > countPageTotal) {
            setCountPage(countPageInput % 10 === 0 ? Math.floor(countPageTotal / 10) : Math.floor(countPageTotal / 10) + 1)
            setCountPageInput(countPageInput % 10 === 0 ? Math.floor(countPageTotal / 10) : Math.floor(countPageTotal / 10) + 1)
        }
        else {
            setCountPage(countPageInput)
        }
    }
    const handleKeyCountPage = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleBlurCountPage();
        }
    };
    return (
        <div className='box-productList'>
            <div style={{ width: '16%', position: 'relative' }}>
                <div className='box-category'>
                    <div className='category-name'>Danh mục sản phẩm</div>
                    <div className='category-list-text'>
                        <div className='category-text' onClick={() => onClickCategory('')}>Tất cả </div>
                        {categories && categories.map((cat) => (
                            <div key={cat._id} className='category-text' onClick={() => onClickCategory(cat.title)}>{cat.title}</div>
                        ))
                        }
                    </div>
                </div>
                <div className='product-phan-trang'>
                    <div className='product-phan-trang-btn bi bi-caret-left-fill' onClick={() => onClickHandlePage(-1)}> </div>
                    <div className='product-phan-trang-ip'>
                        <input value={`${countPageInput}`} className='product-phan-trang-ip-text'
                            onChange={handleCountPage}
                            onBlur={handleBlurCountPage}
                            onKeyDown={handleKeyCountPage}
                        ></input>
                    </div>
                    <div>/</div>
                    <div className='product-phan-trang-total'> {Math.floor(countPageTotal % 10) === 0 ? Math.floor(countPageTotal / 10) : Math.floor(countPageTotal / 10) + 1}  </div>
                    <div className='product-phan-trang-btn bi bi-caret-right-fill' onClick={() => onClickHandlePage(1)}> </div>
                </div>
            </div>
            <div style={{ width: '84%', marginLeft: '20px' }}  >
                <div style={{ borderBottom: '1px solid #ddd', marginBottom: '20px' }}>

                    <div className="productList-category" onMouseEnter={() => setIsPopupSort(true)}
                        onMouseLeave={() => setIsPopupSort(false)}>
                        Sắp xếp:
                        <div className="popup-sort-name"  >{popupText}
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
                                    <div className='popup-sort-btn giatang' onClick={handlePopupSortSale}>
                                        <button className='popup-sort-btn-text'>Khuyến mãi </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div style={{ color: '#f93' }}>
                        {showCategory ? showCategory : 'Tất cả'}
                    </div>
                </div>
                {listProduct.length > 0 ? <div className='productList'>
                    {listProduct.map((product, index) => (
                        <Link className='product-item' href={`/productlist/${product._id}`} key={index}>
                            {product.sale != 0 && <div className='product-item-sales'> giảm {product.sale}% </div>}
                            <div className='bi bi-heart-fill icon-like'></div>
                            <div className='productList-product-img'>
                                <img className='productList-product-image' src={product.thumb} />
                            </div>
                            <div className='productlist-name'>{product.title}</div>
                            {product.sale == 0 ?
                                <div className="productlist-price">
                                    <div className="productlist-price-number">{formatPrice(product.price)}</div>
                                    <div className="productlist-price-icon">₫</div>
                                </div>
                                :
                                <div style={{ display: 'flex' }}>
                                    <div className="productlist-price">
                                        <div className="productlist-price-number">{formatPrice(product.price * (1 - product.sale / 100))}</div>
                                        <div className="productlist-price-icon">₫</div>
                                    </div>
                                    <div className="productlist-price">
                                        <div className="productlist-price-sales">{formatPrice(product.price)}</div>
                                        <div className="productlist-price-sales">₫</div>
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
                        </Link>
                    ))}
                </div>
                    :
                    <div style={{ height: '100%', textAlign: 'center', color: '#f93', fontSize: '25px', paddingTop: '100px' }}> Không có sản phẩm nào!</div>
                }
            </div>
        </div >
    )
}

export default ProductList;
