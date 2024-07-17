'use client'
import '@/styles/admin.css'
import { useState } from 'react';
import { Container } from 'react-bootstrap';
import Users from './users/page';
const Admin = () => {
    const [navagateAdmin, setNavagateAdmin] = useState(<Users></Users>);
    return (
        <div>
            <Container>
            <div className="admin-menu">
                <div className='admin-menu-text'>Tài khoản </div>
                <div className='admin-menu-text'>Sản phẩm </div>
                <div className='admin-menu-text'>Blog </div>
            </div>
            <div>
                {navagateAdmin}
            </div>
            </Container>
        </div>
    )

}
export default Admin;