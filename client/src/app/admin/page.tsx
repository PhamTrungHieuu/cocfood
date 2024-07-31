'use client'
import '@/styles/admin.css'
import { useState } from 'react';
import { Container } from 'react-bootstrap';
import Users from './users/page';
import Products from './products/page';
import OrderAdmin from './orders/page';
import Categorys from './category/page';

const Admin = () => {
    const [navagateAdmin, setNavagateAdmin] = useState(<Users></Users>);
    const [activeMenu, setActiveMenu] = useState('account');

    const handleMenuClick = (menu : string) => {
        setActiveMenu(menu);
        if(menu === 'account'){
            setNavagateAdmin(<Users></Users>)
        }
        else if(menu === 'product'){
            setNavagateAdmin(<Products></Products>)
        }
        else if(menu === 'orders'){
            setNavagateAdmin(<OrderAdmin></OrderAdmin>)
        }
        else if(menu === 'category'){
            setNavagateAdmin(<Categorys></Categorys>)
        }
    };

    return (
        <div>
            <Container>
                <div className="admin-menu">
                    <div 
                        className={`admin-menu-text ${activeMenu === 'account' ? 'active' : ''}`} 
                        onClick={() => handleMenuClick('account')}
                    >
                        Tài khoản
                    </div>
                    <div 
                        className={`admin-menu-text ${activeMenu === 'product' ? 'active' : ''}`} 
                        onClick={() => handleMenuClick('product')}
                    >
                        Sản phẩm
                    </div>
                    <div 
                        className={`admin-menu-text ${activeMenu === 'category' ? 'active' : ''}`} 
                        onClick={() => handleMenuClick('category')}
                    >
                        Danh mục
                    </div>
                    <div 
                        className={`admin-menu-text ${activeMenu === 'orders' ? 'active' : ''}`} 
                        onClick={() => handleMenuClick('orders')}
                    >
                        Đơn hàng
                    </div>
                </div>
                <div>
                    {navagateAdmin}
                </div>
            </Container>
        </div>
    )
}

export default Admin;
