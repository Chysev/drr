import Link from "next/link";

const page = () => {
  return (
    <div className="relative bg-gradient-to-br from-blue-50 to-gray-100 min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-6 py-12">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-800 leading-tight mb-6 animate-fade-in">
            Plataporma para sa Pag-uulat ng Sakuna
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-600 mb-12 animate-fade-in delay-100">
            Mabilis na iulat ang mga sakuna at makakuha ng mga balita mula sa
            inyong komunidad.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link href="/report" passHref>
              <button className="bg-red-500 text-white py-3 px-8 rounded-full font-medium hover:bg-red-600 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-300 text-base sm:text-lg md:text-xl shadow-md">
                Gumawa ng Ulat
              </button>
            </Link>
            <Link href="/reports" passHref>
              <button className="bg-blue-500 text-white py-3 px-8 rounded-full font-medium hover:bg-blue-600 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 text-base sm:text-lg md:text-xl shadow-md">
                Listahan ng Mga Ulat
              </button>
            </Link>
          </div>
        </div>
        <div className="mt-20 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
            Paano Ito Gumagana
          </h2>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Gumawa ng ulat sa pamamagitan ng pagpili ng lokasyon, paglagay ng
            paglalarawan, at pag-upload ng larawan. Manatiling may alam sa mga
            kasalukuyang sakuna at tingnan ang mga ulat mula sa iba.
          </p>
        </div>
      </div>
    </div>
  );
};

export default page;
