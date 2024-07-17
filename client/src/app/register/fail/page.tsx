'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2';
const Fail: React.FC = () => {
    const router = useRouter()
    useEffect(() => {
        const show = () => {
            Swal.fire('Thất bại', 'Đăng ký không thành công', 'error').then((result) => {
                if (result.isConfirmed) {
                    router.push('/register');
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
export default Fail;
;