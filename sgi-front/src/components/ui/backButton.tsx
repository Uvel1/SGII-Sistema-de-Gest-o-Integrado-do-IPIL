import { useRouter } from "next/navigation";

const BackButton = () => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="text-white bg-blue-700 rounded-lg hover:bg-blue-800 px-2"
    >
      Voltar
    </button>
  );
};

export default BackButton;
