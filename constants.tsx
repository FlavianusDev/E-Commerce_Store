import React from 'react';
import { Product, User } from './types';

export const MOCK_USERS: User[] = [
  { 
    id: 1, 
    username: 'seller_john', 
    password: 'password', 
    role: 'seller', 
    name: 'John Doe', 
    shippingAddress: '456 Seller St, Sample Town, 20202',
    storeName: "John's Digital Goods",
    storeDescription: "High-quality digital assets for developers.",
    commissionRate: 0.10, // 10% commission
    wishlist: [],
    authProvider: 'local',
  },
  { 
    id: 2, 
    username: 'user_jane', 
    password: 'password', 
    role: 'user', 
    name: 'Jane Smith', 
    shippingAddress: '789 Buyer Blvd, Webville, 30303',
    wishlist: [4, 6],
    authProvider: 'local',
  },
  { 
    id: 3, 
    username: 'narcyty', 
    password: 'enc34c66#T62B72sswuybT&*92sksG', 
    role: 'admin', 
    name: 'Narcy T. (Admin)', 
    shippingAddress: '123 Admin Ave, Tech City, 10101',
    wishlist: [],
    authProvider: 'local',
  },
   { 
    id: 4, 
    username: 'google_user', 
    role: 'user', 
    name: 'Gia Googler', 
    shippingAddress: '1600 Amphitheatre Parkway, Mountain View, CA',
    wishlist: [],
    authProvider: 'google',
  },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'UI Component Library Snippet',
    price: 49.99,
    description: 'A collection of ready-to-use UI components for your next web project. Well-documented and easy to integrate with any modern framework like React, Vue, or Svelte. Includes over 50 components with dark mode support.',
    category: 'Code Snippet',
    imageUrl: 'https://picsum.photos/seed/code1/600/600',
    reviews: [
      { id: 101, author: 'Alex', rating: 5, comment: 'Saved me so much time!', date: '2023-10-15' },
      { id: 102, author: 'Maria', rating: 4, comment: 'Very useful, a few more examples would be nice.', date: '2023-10-12' },
    ],
    fileUrl: '#download-link-1',
    sellerId: 1,
    isFeatured: true,
    addedOn: '2023-10-20',
  },
  {
    id: 2,
    name: 'Authentication Backend Service',
    price: 89.99,
    description: 'A complete, secure backend service for handling user authentication. Includes JWT support, password hashing, and social login providers. Easy to deploy with Docker.',
    category: 'Backend',
    imageUrl: 'https://picsum.photos/seed/brokenurl/600/600',
    reviews: [
      { id: 201, author: 'John D.', rating: 5, comment: 'Works perfectly out of the box. The documentation is clear.', date: '2023-11-01' },
    ],
    fileUrl: '#download-link-2',
    sellerId: 1,
    isFeatured: false,
    addedOn: '2023-11-05',
  },
  {
    id: 3,
    name: 'E-commerce State Management Logic',
    price: 75.50,
    description: 'Robust state management solution for an e-commerce cart and checkout flow. Built with modern state management libraries, it handles complex scenarios like variations and inventory.',
    category: 'Code Snippet',
    imageUrl: 'https://picsum.photos/seed/code3/600/600',
    reviews: [
       { id: 301, author: 'Emily', rating: 5, comment: 'Made building my store so much easier. Great structure!', date: '2023-09-20' },
       { id: 302, author: 'David', rating: 4, comment: 'A bit complex to set up initially, but very powerful.', date: '2023-09-18' },
    ],
    fileUrl: '#download-link-3',
    sellerId: 1,
    isFeatured: false,
    addedOn: '2023-09-22',
  },
  {
    id: 4,
    name: 'Minimalist Portfolio Template',
    price: 25.00,
    description: 'A stylish and responsive portfolio website template. Perfect for developers and designers to showcase their work. Built with clean HTML, CSS, and minimal JavaScript.',
    category: 'Template',
    imageUrl: 'https://picsum.photos/seed/code4/600/600',
    reviews: [],
    fileUrl: '#download-link-4',
    sellerId: 1,
    isFeatured: true,
    addedOn: '2023-11-10',
    variations: [
      {
        name: 'Style',
        options: [{ name: 'Light' }, { name: 'Dark' }],
      },
      {
        name: 'Version',
        options: [{ name: 'React' }, { name: 'Vue' }],
      }
    ]
  },
  {
    id: 5,
    name: 'Data Visualization Chart Pack',
    price: 65.00,
    description: 'A pack of pre-built, interactive charts for data visualization dashboards. Easy to integrate with your data sources. Supports various chart types like bar, line, and pie.',
    category: 'Code Snippet',
    imageUrl: 'https://picsum.photos/seed/code5/600/600',
    reviews: [
       { id: 501, author: 'DataWiz', rating: 5, comment: 'The charts look amazing and are very performant. Highly recommend!', date: '2023-10-25' },
    ],
    fileUrl: '#download-link-5',
    sellerId: 1,
    isFeatured: false,
    addedOn: '2023-10-28',
  },
  {
    id: 6,
    name: 'Full-Stack Blog Engine',
    price: 150.00,
    description: 'A complete full-stack blog engine, including a database schema, REST API, and a frontend template. Comes with features like markdown support and comments.',
    category: 'Full Project',
    imageUrl: 'https://picsum.photos/seed/code6/600/600',
    reviews: [
       { id: 601, author: 'Liam', rating: 5, comment: 'Got my blog up and running in a single weekend.', date: '2023-11-05' },
    ],
    fileUrl: '#download-link-6',
    sellerId: 1,
    isFeatured: true,
    addedOn: '2023-11-15',
  },
  {
    id: 7,
    name: 'Admin-Only Special Item',
    price: 999.99,
    description: 'This is a special item that can only be managed by the site administrator. It provides access to advanced analytics and store management features.',
    category: 'Admin',
    imageUrl: 'https://picsum.photos/seed/admin/600/600',
    reviews: [],
    fileUrl: '#download-link-7',
    sellerId: 3, // Corresponds to narcyty (admin)
    isFeatured: true,
    addedOn: '2023-09-01',
  }
];


export const ShoppingBagIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.658-.463 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
);

export const XMarkIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export const PlusIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

export const MinusIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
  </svg>
);

export const StarIcon: React.FC<{className?: string, solid?: boolean}> = ({ className, solid = false }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} fill={solid ? "currentColor" : "none"} className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
);

export const HeartIcon: React.FC<{className?: string, solid?: boolean}> = ({ className, solid = false }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" fill={solid ? "currentColor" : "none"} className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
);

export const TwitterIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
    </svg>
);

export const GitHubIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.165 6.839 9.49.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.031-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.03 1.595 1.03 2.688 0 3.848-2.338 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.001 10.001 0 0022 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
    </svg>
);

export const BanknotesIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
  </svg>
);

export const ChartBarIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
  </svg>
);

export const CogIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-1.007 1.11-1.007h1.093c.55 0 1.02.465 1.11 1.007l.073.438c.08.474.49.82.96.82h.934c.557 0 1.028.47.938 1.016l-.034.204a1.125 1.125 0 01-1.118.96h-.934c-.47 0-.879.346-.96.82l-.073.438c-.09.542-.56.987-1.11.987h-1.093c-.55 0-1.02-.445-1.11-.987l-.073-.438c-.08-.474-.49-.82-.96-.82h-.934a1.125 1.125 0 01-1.118-.96l-.034-.204c-.09-.546.381-1.016.938-1.016h.934c.47 0 .879-.346.96-.82l.073-.438z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.75c.621 0 1.125.504 1.125 1.125V15a1.125 1.125 0 01-1.125 1.125h-1.5a1.125 1.125 0 01-1.125-1.125v-1.125c0-.621.504-1.125 1.125-1.125h1.5zM12 15.75a2.25 2.25 0 00-2.25 2.25v1.5a2.25 2.25 0 002.25 2.25h.094c1.763 0 3.25-1.213 3.598-2.906l.004-.016c.01-.05.014-.1.014-.152v-.094a2.25 2.25 0 00-2.25-2.25h-.094zM4.875 16.125a1.125 1.125 0 010-2.25h1.5a1.125 1.125 0 010 2.25h-1.5z" />
    </svg>
);

export const CreditCardIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15A2.25 2.25 0 002.25 6.75v10.5A2.25 2.25 0 004.5 19.5z" />
  </svg>
);

export const PayPalIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.062 13.235c.108-.598.42-1.722.905-2.122.485-.4 1.19-.603 1.936-.603h.36c.21 0 .396.11.492.302l.68 1.343c.092.18.267.288.45.288h.92c.39 0 .626-.4.436-.73l-2.04-3.62c-.19-.33-.53-.448-.868-.29-1.55.72-2.38 2.05-2.735 3.28-.27 1.02-.04 2.03.65 2.5.69.47 1.61.47 2.5.47h.74c.48 0 .82-.28.9-.76l.09-.54c0-.04 0-.07-.04-.07h-1.39c-.58 0-1.01-.33-1.12-.9z" fill="#009cde"></path>
    <path d="M6.342 12.836c.108-.598.42-1.722.905-2.122.485-.4 1.19-.603 1.936-.603h.36c.21 0 .396.11.492.302l.68 1.343c.092.18.267.288.45.288h.92c.39 0 .626-.4.436-.73l-2.04-3.62c-.19-.33-.53-.448-.868-.29-1.55.72-2.38 2.05-2.735 3.28-.27 1.02-.04 2.03.65 2.5.69.47 1.61.47 2.5.47h.74c.48 0 .82-.28.9-.76l.09-.54c0-.04 0-.07-.04-.07h-1.39c-.58 0-1.01-.33-1.12-.9z" fill="#002f86"></path>
    <path d="M15.48 7.21h-2.12c-.52 0-.81.24-.96.75l-1.88 9.01c-.11.48.22.84.7.84h1.4c.33 0 .6-.21.7-.62l.22-1.04.04-.17c.1-.5.53-.87 1.06-.87h.84c1.17 0 2.05-.72 2.26-1.9.15-.82-.16-1.54-.74-1.95-.58-.41-1.37-.64-2.22-.64h-.82c-.35 0-.62-.2-.72-.5l-.3-1.34c-.06-.29.13-.5.42-.5z" fill="#002f86"></path>
  </svg>
);

export const GoogleIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
);

export const HomeIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" />
    </svg>
);

export const UsersIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.663M12 12a3 3 0 100-6 3 3 0 000 6z" />
    </svg>
);