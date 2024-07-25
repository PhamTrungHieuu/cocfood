'use client'
import "@/styles/page.css";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchUserData} from "@/store/authSilce";
import Link from "next/link";
import { Container } from "react-bootstrap";
import axios from "axios";
interface Product {
  _id: string,
  title: string;
  price: number;
  images: string[];
  totalRatings: number;
  thumb: string;
  sale:number;
}
export default function Home() {
  const dispatch = useDispatch<AppDispatch>(); // Sử dụng kiểu AppDispatch
  const [timeLeft, setTimeLeft] = useState(3600); // 1 giờ = 3600 giây
  const [products, setProducts] = useState<Product[]>([])
  const productListRef = useRef<HTMLDivElement>(null);

  const getProducts = () => {
    axios.get('http://localhost:5000/api/product/?sale[gt]=0')  // Thay thế bằng API thực tế của bạn
      .then(response => {
        setProducts(response.data.products);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }
  useEffect(() => {
    getProducts();
  }, []);
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTimeSec = (seconds: number) => {
    const secs = String(seconds % 60).padStart(2, '0');
    return secs;
  };
  const formatTimeMin = (seconds: number) => {
    const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    return minutes;
  };
  const formatTimeHour = (seconds: number) => {
    const hours = String(Math.floor(seconds / 3600)).padStart(2, '0');
    return hours;
  };
  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);
  const formatPrice = (price: Number) => {
    return price.toLocaleString('vi-VN');
  };
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
    <Container>
      <div>
        <div className="box-banner">
          <div className="link-banner">
            <Link href='/'  >
              <img className="img-banner" src="https://res.cloudinary.com/dlhpuaa9i/image/upload/v1721099777/Yellow_Red_Modern_Fried_Chicken_Promotion_Banner_r6tkab.png"></img>
            </Link>
            <div className="banner-small">
              <div className="banner-small-link">
                <Link href='/'   >
                  <img className="img-banner-small" src="https://res.cloudinary.com/dlhpuaa9i/image/upload/v1721102218/img_3banner_1_sbqiti.webp"></img>
                </Link>
              </div>
              <Link href='/' className="banner-small-link"  >
                <img className="img-banner-small" src="https://res.cloudinary.com/dlhpuaa9i/image/upload/v1721102139/img_3banner_2_en3gmw.webp"></img>
              </Link>
            </div>
          </div>
        </div>
        <div className="box-sale">
          < div className="flast-sale" >
            <div className="time-flast-sale" >
              <div className="time-flast-sale-text">
                Ăn THẢ GA - KHÔNG LO VỀ GIÁ
              </div>
              <div className="time-sale"> {formatTimeHour(timeLeft)}
                <div className="time-sale-label">Giờ </div>
              </div>
              <div className="time-sale-cham">:</div>
              <div className="time-sale">  {formatTimeMin(timeLeft)}
                <div className="time-sale-label">Phút </div>
              </div>
              <div className="time-sale-cham">:</div>
              <div className="time-sale">  {formatTimeSec(timeLeft)}
                <div className="time-sale-label">Giây </div>
              </div>
            </div>
            <div className="bi bi-arrow-left-circle btn-scroll-left" onClick={scrollLeft}>
            </div>
            <div className="bi bi-arrow-right-circle btn-scroll-right" onClick={scrollRight}>
            </div>
            <div className="productlist" ref={productListRef}>
              {products.map((product, index) => (
                <Link className='product-item-sale' href={`/productlist/${product._id}`} key={index}>
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
                  {/* </div> */}
                </Link>
              ))}

            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
