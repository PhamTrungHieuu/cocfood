'use client'
import axiosInstance from "@/axiosConfig";
import Link from "next/link";
import { useEffect, useState } from "react";
import '@/styles/orderadminstatus.css'
import Swal from "sweetalert2";
interface Orders {
    _id: string;
    status: string;
    total: number;
    products: [{
        _id: string;
        count: number;
        product: {
            thumb: string;
            title: string;
        };
    }]
    orderBy: {
        firstname: string;
        lastname: string;
    }
}
interface ProcessingProps {
    status: string;
}
const StatusAdmin = ({ status }: ProcessingProps) => {
    const [dataOrder, setDataOrder] = useState<Orders[]>([]);
    const [isShowPopupHandleStatus, setIsShowPopupHandleStatus] = useState<{ [key: string]: boolean }>({});
    const getOrder = async () => {
        const response = await axiosInstance.get('order/admin', { params: { status } })
        if (response.data.success) {
            setDataOrder(response.data.response)
        }
    }
    useEffect(() => {
        getOrder()
    }, [status])
    const formatPrice = (price: number) => {
        return price?.toLocaleString('vi-VN');
    };
    const clickShowHandleStatus = (orderId: string) => {
        setIsShowPopupHandleStatus(prevState => ({
            [orderId]: !prevState[orderId]
        }));
    }
    const handleStatusOrder = async (oderId: string, status: String) => {
        clickShowHandleStatus(oderId)
        const response = await axiosInstance.put(`order/status/${oderId}`, { status })
        if (response.data.success) {
            await Swal.fire({
                position: "center",
                icon: "success",
                title: "Thay đổi status thành công",
                showConfirmButton: false,
                timer: 1000
            });
            getOrder()
        }
        else {
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Thay đổi status không thành công",
                showConfirmButton: false,
                timer: 1000
            });

        }
    }
    return (
        <div style={{ minHeight: '450px' }}>
            {dataOrder?.length > 0 ? <table className="table table-striped" >
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Tên khách hàng </th>
                        <th scope="col">Danh sách sản phẩm </th>
                        <th scope="col">Tổng tiền </th>
                        <th scope="col">Status</th>
                    </tr>
                </thead>
                <tbody >
                    {dataOrder?.length > 0 && dataOrder.map((order, index) => (
                        <tr key={order?._id}>
                            <th scope="row">{index + 1}</th>
                            <td style={{ alignContent: 'center' }} > {order.orderBy.firstname} {order.orderBy.lastname} </td>
                            <td>
                                {order.products && order.products.map((product) => (
                                    <div key={product?._id}>
                                        <tr >
                                            <img style={{ margin: '10px', height: '100px', maxWidth: '100px', borderRadius: '10px', marginRight: '20px' }} src={product.product.thumb}></img>
                                            <td style={{ maxWidth: '600px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: '20px' }} >{product.product.title}</td>
                                            <td style={{ maxWidth: '50px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} >SL: {product.count}</td>
                                        </tr>
                                    </div>
                                ))
                                }
                            </td>
                            <td style={{ alignContent: 'center' }} >{formatPrice(order.total)} ₫</td>
                            <td style={{ alignContent: 'center' }} >
                                {order.status}
                                <div className="status-handle-box" onMouseEnter={() => clickShowHandleStatus(order._id)}
                                    onMouseLeave={() => clickShowHandleStatus(order._id)}>
                                    <div style={{ color: '#f93', width: '100%', cursor: 'pointer' }}>Thay đổi </div>
                                    {isShowPopupHandleStatus[order._id] && <div className="status-handle">
                                        <div className="status-handle-text" onClick={() => handleStatusOrder(order._id, 'Processing')}>Processing </div>
                                        <div className="status-handle-text" onClick={() => handleStatusOrder(order._id, 'Succeed')} >Succeed </div>
                                        <div className="status-handle-text" onClick={() => handleStatusOrder(order._id, 'Cancelled')} >Cancelled</div>
                                    </div>}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
                :
                <div style={{ height: '100%', textAlign: 'center', color: '#f93', fontSize: '25px', paddingTop: '100px' }}> Không có sản phẩm nào!</div>
            }
        </div>
    );
}
export default StatusAdmin;