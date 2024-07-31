'use client'
import '@/styles/admin.css'
import Processing from './status/page';
import { ChangeEvent, useState } from 'react';
import { Container } from 'react-bootstrap';
import Status from './status/page';
const OrderAdmin = () => {
    const [navagateAdmin, setNavagateAdmin] = useState(<Status status="Processing" ></Status>);
    const [activeMenu, setActiveMenu] = useState('Processing');

    const handleMenuClick = (menu: string) => {
        setActiveMenu(menu);
        if (menu === 'Processing') {
            setNavagateAdmin(<Status status="Processing" ></Status>)
        } else if (menu === 'Succeed') {
            setNavagateAdmin(<Status status="Succeed" ></Status>)
        }
        else if (menu === 'Cancelled') {
            setNavagateAdmin(<Status status="Cancelled" ></Status>)
        }
    };
    
    return (
        <div>
            <Container>
                <div className="admin-menu">
                    <div
                        className={`admin-menu-text ${activeMenu === 'Processing' ? 'active' : ''}`}
                        onClick={() => handleMenuClick('Processing')}
                    >
                        Đang xử lý
                    </div>
                    <div
                        className={`admin-menu-text ${activeMenu === 'Succeed' ? 'active' : ''}`}
                        onClick={() => handleMenuClick('Succeed')}
                    >
                        Thành công
                    </div>
                    <div
                        className={`admin-menu-text ${activeMenu === 'Cancelled' ? 'active' : ''}`}
                        onClick={() => handleMenuClick('Cancelled')}
                    >
                        Không thành công
                    </div>
                </div>
                <div>
                    {navagateAdmin}
                </div>
            </Container>
        </div>
    )
}
export default OrderAdmin;