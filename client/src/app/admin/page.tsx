'use client'
import '@/styles/admin.css'
import { useState } from 'react';
import { Container } from 'react-bootstrap';
import Users from './users/page';
import Products from './products/page';

const Admin = () => {
    const [navagateAdmin, setNavagateAdmin] = useState(<Users></Users>);
    const [activeMenu, setActiveMenu] = useState('account');

    const handleMenuClick = (menu : string) => {
        setActiveMenu(menu);
        if(menu === 'account'){
            setNavagateAdmin(<Users></Users>)
        }else if(menu === 'product'){
            setNavagateAdmin(<Products></Products>)
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
                        className={`admin-menu-text ${activeMenu === 'blog' ? 'active' : ''}`} 
                        onClick={() => handleMenuClick('blog')}
                    >
                        Blog
                    </div>
                    <div 
                        className={`admin-menu-text ${activeMenu === 'oder' ? 'active' : ''}`} 
                        onClick={() => handleMenuClick('oder')}
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
