'use client'

import axiosInstance from "@/axiosConfig";
import axios from "axios";
import { useParams } from "next/navigation";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Container } from "react-bootstrap";
import Swal from "sweetalert2";
import '@/styles/productpid.css'
interface Product {
    _id: string,
    title: string;
    brand: string;
    price: number;
    images: string[];
    totalRatings: number;
    thumb: string;
    sale: number;
    description: string;
}
const Productpid = () => {

    const [productData, setProductData] = useState<Product | null>(null);
    const [isShowEdit, setIsShowEdit] = useState(false);
    const [isShowEditAvatar, setIsShowEditAvatar] = useState(false);
    const [valueEdit, setValueEdit] = useState('');
    const [idEdit, setIdEdit] = useState('');
    const [labelEdit, setLabelEdit] = useState('');
    const [keyEdit, setKeyEdit] = useState('');
    const [valueAvatar, setValueAvatar] = useState<File | null>(null);
    const [images, setImages] = useState<File[]>([]);
    const productListRef = useRef<HTMLDivElement>(null);

    const param = useParams();
    const { pid } = param

    const getProducts = async () => {
        axios.get(`http://localhost:5000/api/product/?_id=${pid}`)  // Thay thế bằng API thực tế của bạn
            .then(response => {
                setProductData(response.data.products[0]);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    };

    useEffect(() => {
        getProducts();
    }, []);

    const changeProduct = (pid: string, key: string, value: string, label: string) => {
        setIdEdit(pid);
        setKeyEdit(key)
        setValueEdit(value)
        setLabelEdit(label)
        setIsShowEdit(true)
    }

    const changeAvatarProduct = (pid: string, key: string, value: string, label: string) => {
        setIdEdit(pid);
        setKeyEdit(key)
        setLabelEdit(label)
        setIsShowEditAvatar(true)
    }

    const btnCancel = () => {
        setIdEdit('');
        setKeyEdit('')
        setLabelEdit('')
        setValueEdit('')
        setIsShowEdit(false)
        setIsShowEditAvatar(false)
        setValueAvatar(null)
    }

    const handleEdit = (e: ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value
        if (keyEdit === 'price') {
            value = value.replace(/[^0-9]/g, '');
            if (parseInt(value, 10) > 99999999999999) {
                value = '99999999999999';
            }
            setValueEdit(value)
        } else if (keyEdit === 'sale') {
            value = value.replace(/[^0-9]/g, '') || '0';
            // Chuyển đổi giá trị thành số nguyên
            let numericValue = parseInt(value, 10);

            // Kiểm tra giới hạn
            if (numericValue < 0) {
                numericValue = 0;
            } else if (numericValue > 100) {
                numericValue = 100;
            }
            setValueEdit(numericValue.toString());
        } else
            setValueEdit(value)
    }
    const handleEditAvatar = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            if (keyEdit === 'thumb') {
                const files = e.target.files
                setValueAvatar(files[0]);
            }
            else {

                const files = Array.from(e.target.files);
                setImages(files);
            }
        }
    }
    const btnSubmitEidtProduct = async () => {
        if (valueEdit) {
            try {
                const payload = {
                    [keyEdit]: valueEdit
                };
                const response = await axiosInstance.put(`product/${pid}`, payload);
                if (response.data.success) {
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: `Thay đổi ${labelEdit} thành công`,
                        showConfirmButton: false,
                        timer: 1500
                    });
                    btnCancel()
                } else {
                    Swal.fire({
                        position: "center",
                        icon: "error",
                        title: `Thay đổi ${labelEdit} không thành công`,
                        showConfirmButton: false,
                        timer: 1500
                    });
                    btnCancel()
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
            getProducts();
        } else {
            Swal.fire({
                title: "Không được để trống",
                icon: "question"
            });
        }
    }
    const formatPrice = (price: Number) => {
        return price?.toLocaleString('vi-VN');
    };
    const btnSubmitEidtAvatar = async () => {
        if (valueAvatar || images) {
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
                if (keyEdit === 'thumb') {
                    if (!(valueAvatar instanceof File)) {
                        throw new Error('valueAvatar is not a file object');
                    }

                    formData.append('thumb', valueAvatar);

                    const response = await axiosInstance.put(`product/uploadthumb/${pid}`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });
                    if (response.data.success) {
                        Swal.fire({
                            position: "center",
                            icon: "success",
                            title: `Thay đổi ${labelEdit} thành công`,
                            showConfirmButton: false,
                            timer: 1500
                        });
                        btnCancel()
                    } else {
                        Swal.fire({
                            position: "center",
                            icon: "error",
                            title: `Thay đổi ${labelEdit} không thành công`,
                            showConfirmButton: false,
                            timer: 1500
                        });
                        btnCancel()
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
                        Swal.fire({
                            position: "center",
                            icon: "success",
                            title: `Thay đổi ${labelEdit} thành công`,
                            showConfirmButton: false,
                            timer: 1500
                        });
                        btnCancel()
                    } else {
                        Swal.fire({
                            position: "center",
                            icon: "error",
                            title: `Thay đổi ${labelEdit} không thành công`,
                            showConfirmButton: false,
                            timer: 1500
                        });
                        btnCancel()
                    }
                }
            } catch (error) {
                console.error('Error uploading file:', error);
            }
            getProducts();
        } else {
            Swal.fire({
                title: "Không được để trống",
                icon: "question"
            });
        }
    }
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
    const onclickDeleteImage = (fileImage: string) => {
        Swal.fire({
            title: "Bạn có muốn tiếp tục xóa ảnh?",
            icon: "warning",
            showCancelButton: true,
            reverseButtons: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#f93",
            confirmButtonText: "Xóa ảnh"
        }).then((result) => {
            if (result.isConfirmed) {
                deleteImage(fileImage)
            }
        });
    }
    const deleteImage = async (fileImage: string) => {
        await axiosInstance.delete(`http://localhost:5000/api/product/images/${pid}`, { data: { fileImage } })  // Thay thế bằng API thực tế của bạn
            .then(response => {
                if (response.data.success) {
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: `Xóa ảnh thành công`,
                        showConfirmButton: false,
                        timer: 1500
                    });
                }else{
                    Swal.fire({
                        position: "center",
                        icon: "error",
                        title: `Xóa ảnh không thành công`,
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
            getProducts();
    }
    return (
        <div>
            <Container>
                <div>
                    <div className="header">Thông tin sản phẩm </div>
                    {productData && <div className="profile-product-box">
                        {isShowEdit && <div className="profile-product-edit-product">
                            <div className="profile-product-edit-product-form">
                                <div className="profile-product-edit-product-label"> {labelEdit} </div>
                                {keyEdit === 'description' ?
                                    <textarea
                                        className="profile-product-edit-product-ip-description"
                                        style={{ width: '100%', resize: 'none' }}
                                        onChange={(e) => handleEdit}
                                        value={valueEdit}
                                        rows={10} // Bạn có thể điều chỉnh số lượng hàng mặc định theo nhu cầu của mình
                                    ></textarea> :
                                    <div className="profile-product-edit-product-ip">
                                        <input className="profile-product-edit-product-ip-text" style={{ width: '100%' }} onChange={handleEdit} value={valueEdit}></input>
                                    </div>
                                }
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <button className="profile-product-edit-product-btn-cancel" onClick={btnCancel}>Quay lại</button>
                                    <button className="profile-product-edit-product-btn" onClick={btnSubmitEidtProduct}>Submit</button>
                                </div>
                            </div>
                        </div>}
                        {isShowEditAvatar && <div className="profile-product-edit-product">
                            <div className="profile-product-edit-product-form">
                                <div className="profile-product-edit-product-label"> {labelEdit} </div>
                                <div style={{ marginTop: '30px' }}>
                                    {keyEdit === 'thumb' ?
                                        <input type="file" className="profile-product-edit-product-avatar" style={{ width: '100%' }} onChange={handleEditAvatar} ></input>
                                        : <input multiple type="file" className="profile-product-edit-product-avatar" style={{ width: '100%' }} onChange={handleEditAvatar} ></input>
                                    }
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <button className="profile-product-edit-product-btn-cancel" onClick={btnCancel}>Quay lại</button>
                                    <button className="profile-product-edit-product-btn" onClick={btnSubmitEidtAvatar}>Submit</button>
                                </div>
                            </div>
                        </div>}
                        <div className="profile-product">
                            <div className="profile-product-row">
                                <div className="profile-product-row-lable"> Tên sản phẩm: </div>
                                <div className="profile-product-row-ip"> {productData.title} </div>
                                <button className="profile-product-row-edit" onClick={() => changeProduct(productData._id, 'title', productData.title, 'Tên sản phẩm')}> Thay đổi</button>

                            </div>
                            <div className="profile-product-row">
                                <div className="profile-product-row-lable"> Nhãn hàng: </div>
                                <div className="profile-product-row-ip">{productData.brand}</div>
                                <button className="profile-product-row-edit" onClick={() => changeProduct(productData._id, 'brand', productData.brand, 'Nhãn hàng')}> Thay đổi</button>
                            </div>
                            <div className="profile-product-row">
                                <div className="profile-product-row-lable"> Mô tả: </div>
                                <div className="profile-product-row-ip profile-product-row-ip-description"> {productData.description} </div>
                                <button className="profile-product-row-edit" onClick={() => changeProduct(productData._id, 'description', productData.description, 'Mô tả')}> Thay đổi</button>
                            </div>
                            <div className="profile-product-row">
                                <div className="profile-product-row-lable"> Giá: </div>
                                <div className="profile-product-row-ip"> {formatPrice(productData.price)}đ </div>
                                <button className="profile-product-row-edit" onClick={() => changeProduct(productData._id, 'price', productData.price.toString(), 'Giá')}> Thay đổi</button>
                            </div>
                            <div className="profile-product-row">
                                <div className="profile-product-row-lable"> Khuyến mãi: </div>
                                <div className="profile-product-row-ip">{productData.sale}%</div>
                                <button className="profile-product-row-edit" onClick={() => changeProduct(productData._id, 'sale', productData.sale.toString(), ' Khuyến mãi')}> Thay đổi</button>
                            </div>
                        </div>
                        <div className="profile-product-img">
                            <div className="profile-product-avata-box">
                                <div className="profile-product-avata-lable"> Ảnh đại diện sản phẩm </div>
                                <div className="profile-product-avata">
                                    <img className="profile-product-avata-img" src={productData.thumb}></img>
                                </div>
                                <button style={{ width: '100%', textAlign: 'center' }} className="profile-product-row-edit" onClick={() => changeAvatarProduct(productData._id, 'thumb', productData.thumb, 'Ảnh đại diện sản phẩm')}> Thay đổi</button>
                            </div>
                            <div className="profile-product-avata-box">
                                <div className="profile-product-avata-lable"> Ảnh chi tiết sản phẩm </div>
                                <div className="profile-product-avata-scroll" >

                                    <div className="bi bi-arrow-left-circle btn-scroll-left" onClick={scrollLeft}>
                                    </div>
                                    <div className="bi bi-arrow-right-circle btn-scroll-right" onClick={scrollRight}>
                                    </div>

                                    <div className="profile-product-avata-arr" ref={productListRef}>
                                        {productData?.images?.map((image, index) => (
                                            <div style={{ position: 'relative' }}>
                                                <div style={{ position: 'absolute', fontWeight: '600', fontSize: '15px', right: '10px', cursor: 'pointer', color: 'red' }} onClick={() => onclickDeleteImage(image)}> x </div>
                                                <img key={index} className="profile-product-avata-img" src={image} alt={`Product ${index}`} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <button style={{ width: '100%', textAlign: 'center' }} className="profile-product-row-edit" onClick={() => changeAvatarProduct(productData._id, 'images', productData.thumb, 'Ảnh chi tiết sản phẩm')}> Thay đổi</button>
                            </div>
                        </div>
                    </div>}
                </div>
            </Container>
        </div>
    )
}
export default Productpid;