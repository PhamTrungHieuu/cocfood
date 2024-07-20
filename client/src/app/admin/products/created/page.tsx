'use client'
import axiosInstance from '@/axiosConfig'
import { getCategories } from '@/store/authSilce'
import { AppDispatch, RootState } from '@/store/store'
import '@/styles/createdproduct.css'
import { ChangeEvent, useEffect, useState } from 'react'
import {  Container } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import Swal from 'sweetalert2'

const CreatedProduct = () => {
    const [title, setTitle] = useState('')
    const [brand, setBrand] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('')
    const [sale, setSale] = useState('0')
    const [isShowAvatar, setIsShowAvatar] = useState(false)
    const [keyAvatar, setKeyAvatar] = useState('avatar')
    const [pid, setPid] = useState('')
    const [category, setCategori] = useState('')
    const [avatar, setAvatar] = useState<File | null>(null)
    const [images, setImages] = useState<File[]>([]);
    const dispatch = useDispatch<AppDispatch>();
    const categories = useSelector((state: RootState) => state.auth.categories).prodCategories;
    console.log(category)
    useEffect(() => {
        dispatch(getCategories());
    }, [dispatch]);
    const createdProduct = async () => {
        const payload = {
            title: title,
            brand: brand,
            description: description,
            category: category,
            price: price,
            sale: sale,
        }
        if (payload.title === '') {
            showSwalNull('Không được để trống tên sản phẩm')
        }
        else if (payload.brand === '') {
            showSwalNull('Không được để trống nhãn hàng')
        }
        else if (payload.description === '') {
            showSwalNull('Không được để trống mô tả sản phẩm')
        }
        else if (payload.category === '') {
            showSwalNull('Không được để trống mô tả sản phẩm')
        }
        else if (payload.price === '') {
            showSwalNull('Không được để trống giá sản phẩm')
        }
        else {

            const reponse = await axiosInstance.post('product', payload)
            if (reponse.data.success) {
                await Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Tạo sản phẩm mới thành công",
                    showConfirmButton: false,
                    timer: 1000
                });
                setPid(reponse.data.createProduct._id)
                resetData()
                Swal.fire({
                    text: "Bạn có muốn cập nhật ảnh sản phẩm ngay bây giờ",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#f93",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Cập nhật ảnh",
                    reverseButtons: true
                }).then((result) => {
                    if (result.isConfirmed) {
                        setIsShowAvatar(true)
                    }
                });
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
        setCategori(value)
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
    const handleEditAvatar = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            if (keyAvatar === 'avatar') {
                const files = e.target.files
                setAvatar(files[0]);
            }
            else {
                const files = Array.from(e.target.files);
                setImages(files);
            }
        }
    }
    const btnCancel = () => {
        setIsShowAvatar(false)
        setKeyAvatar('avatar')
    }
    const btnSubmitEidtAvatar = async () => {
        if (avatar || images) {
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
            try {

                const formData = new FormData();
                if (keyAvatar === 'avatar') {
                    if (!(avatar instanceof File)) {
                        throw new Error('valueAvatar is not a file object');
                    }

                    formData.append('thumb', avatar);

                    const response = await axiosInstance.put(`product/uploadthumb/${pid}`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });
                    if (response.data.success) {
                        await Swal.fire({
                            position: "center",
                            icon: "success",
                            title: `Cập nhật ảnh đại diện sản phẩm thành công`,
                            showConfirmButton: false,
                            timer: 1500
                        });
                        setKeyAvatar('images')
                        setAvatar(null)
                    } else {
                        Swal.fire({
                            position: "center",
                            icon: "error",
                            title: `Cập nhật ảnh đại diện sản phẩm không thành công`,
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }
                }
                else {
                    images.forEach((file) => {
                        formData.append('images', file);
                    });
                    const response = await axiosInstance.put(`product/uploadimage/${pid}`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });
                    if (response.data.success) {
                        await Swal.fire({
                            position: "center",
                            icon: "success",
                            title: `Cập nhật ảnh chi tiết sản phẩm thành công`,
                            showConfirmButton: false,
                            timer: 1500
                        });
                        btnCancel()
                    } else {
                        Swal.fire({
                            position: "center",
                            icon: "error",
                            title: `Cập nhật ảnh chi tiết sản phẩm không thành công`,
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }
                }
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        } else {
            Swal.fire({
                title: "Không được để trống",
                icon: "question"
            });
        }
    }
    return (
        <div>
            <Container>
                {isShowAvatar ?
                    keyAvatar === 'avatar' ?
                        <div className="header">Cập nhật ảnh đại diện sản phẩm </div>
                        :
                        <div className="header">Cập nhật ảnh chi tiết sản phẩm </div>
                    :
                    <div className="header">Thêm mới sản phẩm </div>
                }
                <div className="created-product-box">
                    {isShowAvatar &&
                        <div className='update-avatar-box'>
                            <div className="update-avatar-form">
                                <div style={{ marginTop: '30px' }}>
                                    {keyAvatar === 'avatar' ?
                                        <input type="file" className="profile-product-edit-product-avatar" style={{ width: '100%' }} onChange={handleEditAvatar} ></input>
                                        : <input multiple type="file" className="profile-product-edit-product-avatar" style={{ width: '100%' }} onChange={handleEditAvatar} ></input>
                                    }
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <button className="update-avatar-btn-cancel" onClick={btnCancel}> Hủy </button>
                                    <button className="update-avatar-btn" onClick={btnSubmitEidtAvatar}>Submit</button>
                                </div>
                            </div>
                        </div>

                    }
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
                            <div className="created-product-row-label">Phân loại:</div>
                            <select
                                className='created-product-row-ip-box'
                                value={category}
                                onChange={handleCategori}
                            >
                                <option className="created-product-row-ip" value={category} >{category ? category : 'Phân loại'}</option>
                                {categories && categories?.map((category: any) => (
                                    <option key={category._id} value={category.title}>{category.title}</option>
                                ))}
                            </select>
                        </div>
                        <div className="created-product-row">
                            <div className="created-product-row-label"> Khuyến mãi: </div>
                            <div className='created-product-row-ip-box'>
                                <input className="created-product-row-ip" value={sale} onChange={handleSale}></input>
                            </div>
                        </div>
                        <div className='d-flex  justify-content-center mt-3'>
                            <button className='created-product-btn' onClick={createdProduct} > Thêm mới </button>
                        </div>
                    </div>
                </div>
            </Container >
        </div >
    )
}
export default CreatedProduct;