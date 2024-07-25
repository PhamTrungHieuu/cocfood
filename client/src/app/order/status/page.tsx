'use client'
import axiosInstance from "@/axiosConfig";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
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
}
interface ProcessingProps {
    status: string;
}
const Status = ({ status }: ProcessingProps) => {
    const [dataOrder, setDataOrder] = useState<Orders[]>([]);
    const getOrder = async () => {
        const response = await axiosInstance.get('order', { params: { status } })
        if (response.data.success) {
            setDataOrder(response.data.response)
        }
    }
    useEffect(() => {
        getOrder()
    }, [])
    useEffect(() => {
        getOrder()
    }, [status])
    const formatPrice = (price: number) => {
        return price?.toLocaleString('vi-VN');
    };
    return (
        <div style={{minHeight: '500px'}}>

            {dataOrder?.length > 0 ? <table className="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Danh sách sản phẩm </th>
                        <th scope="col">Tổng tiền </th>
                    </tr>
                </thead>
                <tbody >
                    {dataOrder?.length > 0 && dataOrder.map((order, index) => (
                        <tr key={order?._id}>
                            <th scope="row">{index + 1}</th>
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
export default Status;