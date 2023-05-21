import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Loader from '../components/Loader';
import cookie from "cookie"

export default function Giris() {
    const router = useRouter();

  const [loginFormData, setLoginFormData] = useState({
    username: '',
    password: ""
  });
  const [loginStatus, setLoginStatus] = useState({
    isLoading: false,
    isError: false,
    message: '',
  });

  const handleLoginFormChange = (e) => {
    setLoginFormData(prev =>  ({...prev, [e.target.name]: e.target.value }));
  };

  const handleLoginFormSubmit = async (e) => {
    e.preventDefault();
    setLoginStatus((prev) => ({
      ...prev,
      isError: false,
      isLoading: true,
      message: '',
    }));
    axios
      .post(`/api/login`, {
        userName: loginFormData.username,
        password: loginFormData.password,
      })
      .then((res) => {
        console.log(res);
          setLoginStatus({
            isLoading: false,
            isError: false,
            message: res.data.message || '',
          });

          localStorage.setItem('user', JSON.stringify(res.data.user));
          localStorage.setItem('token', "Bearer " + res.data.token);
           router.reload();
      })
      .catch((err) => {
        console.error(err);
        setLoginStatus({
          isLoading: false,
          isError: true,
          message: 'Hata',
        });
      });
  };

  return (
    <>
      <Head>
        <title>Yemek Siparişi | Kullanıcı Girişi</title>
        <meta name='Kullanıcı Girişi' content='' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className='flex min-h-full items-center justify-center py-12 px-4'>
        <div className='border-gray-200pt-8 flex w-full max-w-md flex-col rounded-xl border bg-white '>
          <h2 className=' border-b border-gray-200 py-4 text-center text-xl font-bold tracking-tight text-gray-700'>
            Kullanıcı Girişi
          </h2>

          {loginStatus.message && (
            <div
              className={`mx-10 mt-10 rounded-md bg-green-100 py-4 px-6 text-green-800 
          ${loginStatus.isError === true && 'bg-red-100 text-red-700'} `}
            >
              {loginStatus.message}
            </div>
          )}
          <div className='flex flex-col gap-10 p-10'>
            
    <form className='flex flex-col gap-6' onSubmit={handleLoginFormSubmit}>
      <div className='relative rounded-md '>
        <input
          id='username'
          name='username'
          type='text'
          required
          disabled={loginStatus.isLoading}
          value={loginFormData.username}
          onChange={handleLoginFormChange}
          className='peer block w-full appearance-none rounded-lg border border-gray-300 bg-transparent p-4 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-0 disabled:text-gray-500 '
          placeholder=' '
        />
        <label
          htmlFor='username'
          className='absolute top-1 left-2 z-10 origin-[0] -translate-y-4 scale-75 transform bg-white px-2 text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-1 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-500 '
        >
          Kullanıcı Adı
        </label>
      </div>
      <div className='relative rounded-md '>
        <input
          id='password'
          name='password'
          type='password'
          required
          disabled={loginStatus.isLoading}
          value={loginFormData.password}
          onChange={handleLoginFormChange}
          className='peer block w-full appearance-none rounded-lg border border-gray-300 bg-transparent p-4 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-0 disabled:text-gray-500 '
          placeholder=' '
        />
        <label
          htmlFor='password'
          className='absolute top-1 left-2 z-10 origin-[0] -translate-y-4 scale-75 transform bg-white px-2 text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-1 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-500 '
        >
          Parola
        </label>
      </div>

      {loginStatus.isLoading ? (
        <div className=' mt-8 flex w-full justify-center text-center '>
          <Loader />
        </div>
      ) : (
        <button
          type='submit'
          className='group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-4 px-4 text-base font-medium text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
        >
          Gönder
        </button>
      )}
    </form>

          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  try {
    const token = cookie.parse(context.req.headers.cookie).Authorization
    const authCheck = await axios.post("http://localhost:5277/api/auth/check",{}, {headers: {Authorization: token}})
     
    const role = authCheck.data.role

    console.log(role)
    if (role === "admin") throw '/admin';
    if (role === "customer") throw '/';

    return {
      props: {},
    };
  
    } catch (err) {
    if (err === '/admin' || err === '/')
      return {
        redirect: {
          permanent: false,
          destination: err,
        },
      };
    else {
      return {
      props: {},
    };
    }
  }
}
