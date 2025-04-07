import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <>
      <div className="w-full h-screen">
        <div className="w-full h-full flex md:flex-row">
          <div className="w-full flex flex-row items-center justify-center space-x-2 absolute mt-10 md:justify-start md:pl-12">
            <img
              src="/logo/logo.png"
              alt="lodo da escola"
              className="w-16 h-16"
            />
            <span className="font-bold text-black">IPIL</span>
          </div>
          <div className="w-full h-full flex flex-col items-center justify-center">
            <h2 className="font-bold text-blue-700 text-center text-2xl md:text-4xl">
              Seja bem-vindo a nossa plataforma
            </h2>
            <p className="text-blue-700 font-bold">Conecte-e já ao futuro</p>
            <div className="space-x-4 mt-24">
              <Button className="bg-blue-700 font-bold hover:bg-blue-800 rounded-xl">
                Entrar
              </Button>
              <Button className="bg-blue-700 font-bold hover:bg-blue-800 rounded-xl">
                Verificar Conta
              </Button>
            </div>
          </div>
          <div className="w-full h-full bg-blue-900 hidden md:flex items-center justify-center">
            <img src="/logo/sgi-branco.png" alt="logo" className="h-[200px]" />
          </div>
        </div>
      </div>
    </>
  );
}
