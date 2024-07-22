'use client'
import axiosInstance from '@/axiosConfig'
import { getCategories } from '@/store/authSilce'
import { AppDispatch, RootState } from '@/store/store'
import '@/styles/createdproduct.css'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { Container } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import Swal from 'sweetalert2'
interface Category {
    _id: string;
    title: string;
}
const CreatedProduct = () => {
    const [title, setTitle] = useState('')
    const [brand, setBrand] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('')
    const [sale, setSale] = useState('0')
    const [isShowAvatar, setIsShowAvatar] = useState(false)
    const [pid, setPid] = useState('')
    const [category, setCategory] = useState('')
    const [thumb, setThumb] = useState<File | null>(null)
    const [images, setImages] = useState<File[]>([]);
    const dispatch = useDispatch<AppDispatch>();
    const categories = useSelector((state: RootState) => state.auth.categories);
    const [thumbPreview, setThumbPreview] = useState<string | null>(null);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const productListRef = useRef<HTMLDivElement>(null);
    const submitButtonRef = useRef<HTMLButtonElement>(null);
    useEffect(() => {
        dispatch(getCategories());
    }, [dispatch]);
    const createdProduct = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('brand', brand);
        formData.append('description', description);
        formData.append('category', category);
        formData.append('price', price);
        formData.append('sale', sale);
        if ((thumb instanceof File)) {
            formData.append('thumb', thumb);
        }

        images.forEach((file) => {
            formData.append('images', file);
        });
        if (title === '') {
            showSwalNull('Không được để trống tên sản phẩm')
        }
        else if (brand === '') {
            showSwalNull('Không được để trống nhãn hàng')
        }
        else if (description === '') {
            showSwalNull('Không được để trống mô tả sản phẩm')
        }
        else if (category === '') {
            showSwalNull('Không được để trống danh mục sản phẩm')
        }
        else if (price === '') {
            showSwalNull('Không được để trống giá sản phẩm')
        }
        else if (thumb === null) {
            showSwalNull('Không được để trống ảnh đại diện sản phẩm')
        }
        else if (images.length === 0) {
            showSwalNull('Không được để trống ảnh chi tiết sản phẩm')
        }
        else {
            let timerInterval: NodeJS.Timeout;
            Swal.fire({
                title: "Loading....",
                html: "I will close in <b></b> milliseconds.",
                timer: 2000,
                timerProgressBar: true,
                didOpen: () => {
                    Swal.showLoading();
                    const popup = Swal.getPopup();
                    if (popup) {
                        const timer = popup.querySelector("b") as HTMLElement;
                        timerInterval = setInterval(() => {
                            timer.textContent = `${Swal.getTimerLeft()}`;
                        }, 100);
                    }
                },
                willClose: () => {
                    clearInterval(timerInterval);
                }
            }).then((result) => {
                if (result.dismiss === Swal.DismissReason.timer) {
                    console.log("I was closed by the timer");
                }
            });
            const reponse = await axiosInstance.post('product', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            }
            )
            if (reponse.data?.success) {
                await Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Tạo sản phẩm mới thành công",
                    showConfirmButton: false,
                    timer: 1000
                });
                resetData()
                console.log(reponse.data)
            }
        }
    }
    const showSwalNull = (mes: string) => {
        Swal.fire({
            text: mes,
            icon: "warning",
            confirmButtonColor: "#f93",
        });
    }
    const resetData = () => {
        setTitle('')
        setBrand('')
        setDescription('')
        setPrice('')
        setSale('0')
        setCategory('')
        setThumb(null)
        setImages([])
        setImagePreviews([])
        setThumbPreview(null)
    }
    const handleTitle = (e: ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value
        setTitle(value)
    }
    const handleBrand = (e: ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value
        setBrand(value)
    }
    const handleDescription = (e: ChangeEvent<HTMLTextAreaElement>) => {
        let value = e.target.value
        setDescription(value)
    }
    const handleCategori = (e: ChangeEvent<HTMLSelectElement>) => {
        let value = e.target.value
        setCategory(value)
    }
    const handlePrice = (e: ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value
        value = value.replace(/[^0-9]/g, '');
        if (parseInt(value, 10) > 99999999999999) {
            value = '99999999999999';
        }
        setPrice(value)
    }
    const handleSale = (e: ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value
        value = value.replace(/[^0-9]/g, '') || '0';
        // Chuyển đổi giá trị thành số nguyên
        let numericValue = parseInt(value, 10);

        // Kiểm tra giới hạn
        if (numericValue < 0) {
            numericValue = 0;
        } else if (numericValue > 100) {
            numericValue = 100;
        }
        setSale(numericValue.toString())
    }
    const handleThumb = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files && files[0]) {
            setThumb(files[0]);
            const fileUrl = URL.createObjectURL(files[0]);
            setThumbPreview(fileUrl);

            // Clean up URL object when component unmounts
            return () => {
                if (fileUrl) {
                    URL.revokeObjectURL(fileUrl);
                }
            };
        } else {
            setThumb(null);
            setThumbPreview(null);
        }
    }
    const handleImages = (e: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setImages(files);

        const fileUrls = files.map(file => URL.createObjectURL(file));
        setImagePreviews(fileUrls);
        return () => {
            fileUrls.forEach(url => URL.revokeObjectURL(url));
        };
    };
    const onclickDeleteImage = (preview: string) => {
        const newImagePreviews = imagePreviews.filter(img => img !== preview);
        const newImages = images.filter((_, index) => URL.createObjectURL(images[index]) !== preview);

        // Revoke the URL object to avoid memory leaks
        URL.revokeObjectURL(preview);

        setImagePreviews(newImagePreviews);
        setImages(newImages);
    };
    const scrollLeft = () => {
        if (productListRef.current) {
            productListRef.current.scrollBy({ left: -200, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (productListRef.current) {
            productListRef.current.scrollBy({ left: 200, behavior: 'smooth' });
        }
    };
    const handleKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            if (submitButtonRef.current) {
                submitButtonRef.current.click();
            }
        }
    };
    return (
        <div>
            <Container>

                <form onKeyDown={handleKeyDown} onSubmit={createdProduct}>
                    <div className="created-product-box" >
                        <div className="created-product">
                            <div className="created-product-row">
                                <div className="created-product-row-label"> Tên sản phẩm: </div>
                                <div className='created-product-row-ip-box'>
                                    <input className="created-product-row-ip" value={title} onChange={handleTitle}></input>
                                </div>
                            </div>
                            <div className="created-product-row">
                                <div className="created-product-row-label"> Nhãn hàng: </div>
                                <div className='created-product-row-ip-box' >
                                    <input className="created-product-row-ip" value={brand} onChange={handleBrand}></input>
                                </div>
                            </div>
                            <div className="created-product-row">
                                <div className="created-product-row-label"> Mô tả: </div>
                                <textarea
                                    className='created-product-row-ip-box'
                                    rows={5} // Bạn có thể điều chỉnh số lượng hàng mặc định theo nhu cầu của mình
                                    onChange={(e) => handleDescription(e)}
                                    value={description}
                                ></textarea>
                            </div>
                            <div className="created-product-row">
                                <div className="created-product-row-label"> Giá: </div>
                                <div className='created-product-row-ip-box'>
                                    <input className="created-product-row-ip" value={price} onChange={handlePrice}></input>
                                </div>
                            </div>
                            <div className="created-product-row">
                                <div className="created-product-row-label">Danh mục:</div>
                                <select
                                    className="created-product-row-ip-box"
                                    value={category}
                                    onChange={handleCategori}
                                >
                                    <option value="" disabled>
                                        {category ? categories ? categories.find(cat => cat._id === category)?.title : [] || 'Phân loại' : 'Phân loại'}
                                    </option>
                                    {categories ? categories.map((cat: Category) => (
                                        <option key={cat._id} value={cat._id}>
                                            {cat.title}
                                        </option>
                                    )) : []}
                                </select>
                            </div>
                            <div className="created-product-row">
                                <div className="created-product-row-label"> Khuyến mãi: </div>
                                <div className='created-product-row-ip-box'>
                                    <input className="created-product-row-ip" value={sale} onChange={handleSale}></input>
                                </div>
                            </div>
                            <div className='d-flex  justify-content-center mt-3'>
                                <button className='created-product-btn' type='submit' ref={submitButtonRef} > Thêm mới </button>
                            </div>
                        </div>
                        <div className='create-product-img'>
                            <div className='create-product-thumb'>
                                <div className='create-product-thumb-label'> Ảnh đại diện sản phẩm </div>
                                <div className="create-product-images-ip" >
                                    <input type="file" style={{ width: '100%' }} onChange={handleThumb} ></input>
                                    Tải ảnh lên
                                </div>
                                {thumbPreview ? (
                                    <div className='create-product-thumb-preview'>
                                        <img className='create-product-thumb-preview-img' src={thumbPreview} alt="Thumb Preview" />
                                    </div>
                                )
                                    :
                                    <div className='create-product-thumb-preview'>
                                    </div>
                                }
                            </div>
                            <div className='create-product-images'>
                                <div className='create-product-images-label'> Ảnh chi tiết sản phẩm </div>
                                <div className="create-product-images-ip" >
                                    <input multiple type="file" style={{ width: '100%' }} onChange={handleImages} ></input>
                                    Tải ảnh lên
                                </div>
                                {imagePreviews.length > 0 && (
                                    <div className="create-product-images-scroll" >

                                        <div className="bi bi-arrow-left-circle btn-scroll-left" onClick={scrollLeft}>
                                        </div>
                                        <div className="bi bi-arrow-right-circle btn-scroll-right" onClick={scrollRight}>
                                        </div>
                                        <div className="create-product-images-arr" ref={productListRef}>
                                            {imagePreviews.map((preview, index) => (
                                                <div style={{ position: 'relative' }}>
                                                    <div style={{ position: 'absolute', fontWeight: '600', fontSize: '15px', right: '10px', cursor: 'pointer', color: 'red' }} onClick={() => onclickDeleteImage(preview)}> x </div>
                                                    <img
                                                        key={index}
                                                        src={preview}
                                                        alt={`Image Preview ${index}`}
                                                        style={{ maxHeight: '150px', margin: '5px' }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div >
                                )}
                            </div>
                        </div>
                    </div >
                </form>
            </Container >
        </div >
    )
}
export default CreatedProduct;