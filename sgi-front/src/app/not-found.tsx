'use client'

import BackButton from "@/components/ui/backButton";

export default function NotFoundPage() {
  return (
    <>
      <div className="w-full flex flex-col items-center justify-center">
        <div className="w-full flex flex-col items-center justify-center absolute top-12">
          <h2 className="font-bold text-blue-700 text-3xl">
            Página não Encontrada
          </h2>
          <BackButton></BackButton>
        </div>
        <img
          src="/images/rb_7970.png"
          alt="Erro 404"
          className="w-[600px] h-[600px] mt-12"
        />
      </div>
    </>
  );
}
