import React from "react";
import Layout from "../app/layout";
import Link from "next/link";

const NotFound: React.FC = () => {
  return (
    <Layout>
      <div className="min-h-[70vh] flex flex-col items-center justify-center py-16">
        <div className="text-center">
          <h1 className="text-9xl font-bold text-notary mb-4 font-serif">
            404
          </h1>
          <h2 className="text-3xl font-bold text-gray-700 mb-6">
            Halaman Tidak Ditemukan
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Maaf, halaman yang Anda cari tidak ditemukan atau telah dipindahkan.
          </p>
          <Link href="/" className="btn-primary inline-block">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
