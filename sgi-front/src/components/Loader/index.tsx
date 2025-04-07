export default function Loader() {

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100 z-50">
      <div className="flex flex-col items-center justify-center">
        <img src="/logo/sgi.png" alt="logo" className="mb-4" />
        <div className="flex items-center justify-center mt-96">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-700 border-t-transparent"></div>
          <span className="ml-4 text-blue-700">Carregando...</span>
        </div>
      </div>
    </div>
  );
}
