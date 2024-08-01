'use client';
import '@/styles/header.css';
import Link from 'next/link';
import { ChangeEvent, use, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { clearMessage, fetchUserData, logout } from '@/store/authSilce';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { toast, ToastContainer } from 'react-toastify';
import slugify from 'slugify';
interface Token extends JwtPayload {
    _id: string;
    role: string;
}
const Header: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const localData = useSelector((state: RootState) => state.auth);
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const pathname = usePathname();
    const router = useRouter();
    const slogan = [
        'Tưởng không giòn nhưng mà giòn thật',
        'Đồ ăn CocShop ăn là mập nhưng mà ngonnn!!!',
        'Đồ ăn ngon ngại gì không thử'
    ];
    const [sloganId, setSloganId] = useState(0);
    const [isVisible, setIsVisible] = useState(true);
    const [isColorTrangChu, setIsColorTrangChu] = useState('active');
    const [isColorSanPham, setIsColorSanPham] = useState('');
    const [isColorOrder, setIsColorOrder] = useState('');
    const [isColorGioiThieu, setIsColorGioiThieu] = useState('');
    const userData = localData?.userData
    const [quantityCart, setQuantityCart] = useState(0);
    const [isAdmin, setIsAdmin] = useState(false);
    const [decodedToken, setDecodedToken] = useState<Token | null>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [valueSearch, setValueSearch] = useState('');
    useEffect(() => {
        tokenDecode();
    }, [])
    useEffect(() => {
        if (userData)
            setQuantityCart(userData?.rs?.cart?.length)
        else {
            setQuantityCart(0)
        }
    }, [userData])
    useEffect(() => {
        setIsLoggedIn(localData?.isLoggedIn)
        tokenDecode();
    }, [localData])
    useEffect(() => {
        if (localData.isLoggedIn)
            dispatch(fetchUserData());
    }, [dispatch]);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsVisible(false);
            setTimeout(() => {
                setSloganId((prevSloganId) => (prevSloganId + 1) % slogan.length);
                setIsVisible(true);
            }, 500);
        }, 2500);

        return () => clearInterval(interval);
    }, [slogan.length]);
    useEffect(() => {
        if (localData.mes)
            Swal.fire({
                text: localData.mes,
                icon: "warning"
            }).then(() => {
                router.replace('/login')
                dispatch(clearMessage());
            });
    }, [localData.mes]);

    useEffect(() => {
        if (pathname === '/') {
            setIsColorTrangChu('active');
            setIsColorSanPham('');
            setIsColorOrder('');
            setIsColorGioiThieu('');
        } else if (pathname === '/productlist') {
            setIsColorTrangChu('');
            setIsColorSanPham('active');
            setIsColorOrder('');
            setIsColorGioiThieu('');
        } else if (pathname === '/order') {
            setIsColorTrangChu('');
            setIsColorSanPham('');
            setIsColorOrder('active');
            setIsColorGioiThieu('');
        } else if (pathname === '/about') {
            setIsColorTrangChu('');
            setIsColorSanPham('');
            setIsColorOrder('');
            setIsColorGioiThieu('active');
        }
        else {
            setIsColorTrangChu('');
            setIsColorSanPham('');
            setIsColorOrder('');
            setIsColorGioiThieu('');

        }
    }, [pathname]);
    const tokenDecode = () => {
        const token = localData?.token // Giả sử bạn lưu token trong localStorage    
        if (token) {
            try {
                const decoded = jwt.decode(token);
                if (typeof decoded === 'string') {
                    setDecodedToken(null);
                } else {
                    // decoded là đối tượng JwtPayload
                    setDecodedToken(decoded as Token);
                }
            } catch (error) {
                console.error('Error decoding token:', error);
            }
            if (decodedToken?.role === 'admin') {
                setIsAdmin(true)
            }
        }
        else {
            setIsAdmin(false)
        }
    }
    const handleAccountClick = () => {
        router.push('/login');
    };
    const showCart = () => {
        if (isLoggedIn) {
            router.push('/cart');
        } else {
            Swal.fire({
                title: "Chưa đăng nhập",
                text: "Đăng nhập để xem giỏ hàng!",
                icon: "warning",
                showCancelButton: true,
                cancelButtonColor: "#d33",
                confirmButtonColor: "#f93",
                confirmButtonText: "Đăng nhập ngay",
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    router.push('/login')
                }
            });
        }
    }
    const clickProfileUser = () => {
        tokenDecode();
        router.replace(`/profile/${decodedToken?._id}`)
    }
    const clickLogout = () => {
        dispatch(logout());
        setIsAdmin(false);
        Swal.fire({
            position: "center",
            icon: "success",
            title: `Đăng xuất thành công`,
            showConfirmButton: false,
            timer: 1000
        });
        setIsHovered(false)
    }
    const hanleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value
        setValueSearch(value)
    }
    const clickSearch = (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        const valueSearchSlug = slugify(valueSearch, { lower: true, strict: true });
        router.replace(`/productlist/?title=${valueSearchSlug}`)
    }
    return (
        <div className='header-box'>
            <Link href={'/'} className="header-logo">
                <img className='header-logo-img' src="https://res.cloudinary.com/dlhpuaa9i/image/upload/v1720405970/Orange_and_Blue_Illustrative_Circle_Food_Logo_bmgqyj.png" alt="Logo" />
            </Link>
            <div className="header-search">
                <form className='header-search-ip' onSubmit={clickSearch}>
                    <input type='search' className='header-search-ip-text' placeholder='Tìm kiếm sản phẩm...' value={valueSearch} onChange={hanleSearch} />

                    <button className='header-search-btn bi bi-search' type='submit'></button>
                </form>
                <div className='header-link'>
                    <Link className={`header-link-text ${isColorTrangChu}`} href={'/'}>Trang chủ</Link>
                    <Link className={`header-link-text ${isColorSanPham}`} href={'/productlist'}>Sản phẩm</Link>
                    {
                        isLoggedIn &&
                        <Link className={`header-link-text ${isColorOrder}`} href={'/order'}> Đơn hàng </Link>
                    }
                    {/* <Link className={`header-link-text ${isColorGioiThieu}`} href={'/about'}>Giới thiệu</Link> */}
                </div>
            </div>
            <div className="header-box-option">
                <div className='header-option'>
                    {/* <Link href={'/login'} className='header-option-btn header-option-favourite bi bi-heart-fill'></Link> */}
                    <button className='header-option-btn header-option-cart bi bi-cart-fill' onClick={showCart}>
                        <div className='icon-quantity-cart'>{quantityCart}</div>
                    </button>
                    {isLoggedIn ?
                        <div style={{ position: 'relative' }} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
                            <div className='header-avatar' >
                                <img className='header-avatar-img' src={userData?.rs?.avatar}></img>
                            </div>
                            {isHovered && (
                                <div className='popup-account'>
                                    <button className='popup-btn' onClick={() => { clickProfileUser() }}>Hồ sơ của bạn </button>
                                    <button className='popup-btn' onClick={() => clickLogout()} >Đăng xuất </button>
                                </div>
                            )}
                        </div>
                        :
                        <button onClick={handleAccountClick} className='header-option-btn header-option-account bi bi-box-arrow-in-right'></button>
                    }
                    {isAdmin && <Link href={'/admin'} className='header-option-btn header-option-admin bi bi-person-fill-gear'></Link>
                    }
                </div>
                <div className='header-option-slogan'>
                    <div className='slogan-icon bi bi-fire'></div>
                    <div className={`slogan-text ${isVisible ? 'show' : 'hide'}`}>{slogan[sloganId]}</div>
                </div>
            </div>
            <ToastContainer></ToastContainer>
        </div>
    );
};

export default Header;
