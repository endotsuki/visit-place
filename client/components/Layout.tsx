import { ReactNode } from 'react';
import Navbar from './Navbar';

interface Props {
  children: ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <div className='min-h-screen bg-stone-50 font-sans antialiased transition-colors duration-300 dark:bg-stone-950'>
      <Navbar />
      <main className='min-h-[calc(100vh-60px)]'>{children}</main>
    </div>
  );
}
