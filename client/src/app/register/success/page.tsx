'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2';
const Success: React.FC = () => {
    const router = useRouter()
    useEffect(() => {
        const show = () => {
            Swal.fire('Thành công', 'Đăng ký thành công', 'success').then((result) => {
                if (result.isConfirmed) {
                    router.push('/login');
                }
            });
        };
        
        show();
    }, [router]); 
    return (
        <div>

        </div>
    )
}
export default Success;