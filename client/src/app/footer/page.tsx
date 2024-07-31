'use client'

import '@/styles/footer.css'
import { Container } from 'react-bootstrap';
const Footer = () => {

    return (
        <div className="footer-box">
            <Container style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div className='footer-information'>

                    <div className='footer-logo'>
                        <img className='footer-logo-img' src='https://res.cloudinary.com/dlhpuaa9i/image/upload/v1720405970/Orange_and_Blue_Illustrative_Circle_Food_Logo_bmgqyj.png'></img>
                        <div className='footer-logo-text'> Đồ ăn Cocfood ăn là mập nhưng mà ngonnn!!!</div>
                    </div>
                    <div className='footer-information-list'>
                        <div className='footer-information-label' > Địa chỉ:</div>
                        <div className='footer-information-text' > 266 Đội Cấn, Phường Liễu Giai, Hà Nội </div>
                    </div>
                    <div className='footer-information-list'>
                        <div className='footer-information-label' > Điện thoại: </div>
                        <div className='footer-information-text' > 1900 6750 </div>
                    </div>
                    <div className='footer-information-list'>
                        <div className='footer-information-label' > Email: </div>
                        <div className='footer-information-text' > trunghieu01102002@gmail.com </div>
                    </div>
                </div>
                <div className='footer-information'>

                    <div className='footer-logo-icon'>
                        <div className='footer-logo-icon-list' >
                            <img className='footer-logo-icon-list-img' src='https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/800px-Facebook_Logo_%282019%29.png'></img>
                        </div>
                        <div className='footer-logo-icon-list' >
                            <img className='footer-logo-icon-list-img' src='https://png.pngtree.com/png-vector/20221018/ourmid/pngtree-twitter-social-media-round-icon-png-image_6315985.png'></img>
                        </div>
                        <div className='footer-logo-icon-list' >
                            <img className='footer-logo-icon-list-img' src='https://static.vecteezy.com/system/resources/previews/023/986/704/non_2x/youtube-logo-youtube-logo-transparent-youtube-icon-transparent-free-free-png.png'></img>
                        </div>
                        <div className='footer-logo-icon-list' >
                            <img className='footer-logo-icon-list-img' src='https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/2048px-Instagram_icon.png'></img>
                        </div>
                    </div>
                    <div className='footer-information-list-link'>
                        <a className='footer-information-list-link-text' href='/'>Trang chủ </a>
                    </div>
                    <div className='footer-information-list-link'>
                        <a className='footer-information-list-link-text' href='/productlist'>Sản phẩm </a>
                    </div>
                    <div className='footer-information-list-link'>
                        <a className='footer-information-list-link-text'>Quà tặng </a>
                    </div>
                    <div className='footer-information-list-link'>
                        <a className='footer-information-list-link-text'>Trợ giúp </a>
                    </div>
                </div>
            </Container>
        </div>
    )
}
export default Footer;