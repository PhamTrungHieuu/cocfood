'use client'
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Inter } from "next/font/google";
import "./globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from "./header/page";
import { Provider } from "react-redux";
import store, { AppDispatch, persistor } from '../store/store';
import { ReactNode, useEffect } from "react";
import { PersistGate } from "redux-persist/integration/react";
const inter = Inter({ subsets: ["latin"] });

interface RootLayoutProps {
  children: ReactNode;
}
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <div style={{ height: '120px', position: 'relative', zIndex: '1000' }}>
              <Header></Header>
            </div>
            {children}
            <footer>
              hahaha
            </footer>
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}
